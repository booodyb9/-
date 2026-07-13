import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Content } from '../pages/dashboard/types';

interface ContentContextType {
  contents: Content[];
  loading: boolean;
  getContent: (key: string) => Content | undefined;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contents')
      .then(res => res.json())
      .then(data => {
        setContents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching contents:", err);
        setLoading(false);
      });
  }, []);

  const getContent = (key: string) => contents.find(c => c.key === key);

  return (
    <ContentContext.Provider value={{ contents, loading, getContent }}>
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
