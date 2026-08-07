import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { Content } from '../pages/dashboard/types';
import { supabase } from '../lib/supabase';

interface ContentContextType {
  mediaFiles: MediaFile[];
  fetchMedia: () => Promise<void>;
  forceRefresh: () => Promise<void>;
  contents: Content[];
  loading: boolean;
  getContent: (key: string) => Content | undefined;
  refreshContent: () => Promise<void>;
  updateContent: (key: string, body: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export interface MediaFile {
  id: string | number;
  url: string;
  name: string;
  created_at?: string;
  storage_path?: string;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [contents, setContents] = useState<Content[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedia = useCallback(async () => {
    const { data, error } = await supabase
      .from('media')
      .select('id,name,url,storage_path,created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching media from Supabase:', error);
      return;
    }

    setMediaFiles((data ?? []) as MediaFile[]);
  }, []);

  const fetchContents = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('contents').select('*');
      if (error) {
        console.error('Error fetching contents from Supabase:', error);
        return;
      }
      setContents((data ?? []) as Content[]);
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const forceRefresh = useCallback(async () => {
    await Promise.all([fetchContents(), fetchMedia()]);
  }, [fetchContents, fetchMedia]);

  useEffect(() => {
    void forceRefresh();

    const contentsChannel = supabase
      .channel('contents_changes_ctx')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contents' }, () => {
        void fetchContents();
      })
      .subscribe();

    const mediaChannel = supabase
      .channel('media_changes_ctx')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'media' }, () => {
        void fetchMedia();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(contentsChannel);
      void supabase.removeChannel(mediaChannel);
    };
  }, [fetchContents, fetchMedia, forceRefresh]);

  const getContent = useCallback((key: string) => contents.find((content) => content.key === key), [contents]);

  const updateContent = useCallback((key: string, body: string) => {
    setContents((previous) => previous.map((content) => (content.key === key ? { ...content, body } : content)));
  }, []);

  const value = useMemo(
    () => ({
      contents,
      loading,
      getContent,
      refreshContent: fetchContents,
      updateContent,
      mediaFiles,
      fetchMedia,
      forceRefresh,
    }),
    [contents, loading, getContent, fetchContents, updateContent, mediaFiles, fetchMedia, forceRefresh]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
