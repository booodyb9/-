import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Content } from '../pages/dashboard/types';

interface ContentContextType {
  contents: Content[];
  loading: boolean;
  getContent: (key: string) => Content | undefined;
  refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContents = async () => {
    try {
      // Mock data
      const stored = localStorage.getItem('mock_contents');
      if (stored) {
        setContents(JSON.parse(stored));
      } else {
        setContents([]);
      }
    } catch (err) {
      console.error("Error fetching contents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
    
    const handleStorageChange = () => {
      fetchContents();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('mock-data-update', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('mock-data-update', handleStorageChange);
    };
  }, []);

  const getContent = (key: string) => contents.find(c => c.key === key);

  return (
    <ContentContext.Provider value={{ contents, loading, getContent, refreshContent: fetchContents }}>
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
