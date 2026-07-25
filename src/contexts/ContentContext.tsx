import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Content } from '../pages/dashboard/types';
import { supabase } from '../lib/supabase';

interface ContentContextType {
  contents: Content[];
  loading: boolean;
  getContent: (key: string) => Content | undefined;
  refreshContent: () => Promise<void>;
  updateContent: (key: string, body: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase.from('contents').select('*');
      if (error) {
        console.error("Error fetching contents from Supabase:", error);
      } else if (data) {
        setContents(data as Content[]);
      }
    } catch (err) {
      console.error("Error fetching contents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();

    const channel = supabase
      .channel('contents_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contents' },
        (payload) => {
          fetchContents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getContent = (key: string) => contents.find(c => c.key === key);

  const updateContent = (key: string, body: string) => {
    setContents(prev => prev.map(c => c.key === key ? { ...c, body } : c));
  };

  return (
    <ContentContext.Provider value={{ contents, loading, getContent, refreshContent: fetchContents, updateContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

