import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { Content } from '../pages/dashboard/types';
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

  // Public visitors only need one content request. Dashboard saves explicitly refresh
  // this state, so a permanent Realtime websocket is unnecessary on every page view.
  useEffect(() => {
    void fetchContents();
  }, [fetchContents]);

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
