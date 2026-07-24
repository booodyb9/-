import { useEffect, useMemo } from 'react';
import { useContent } from '../contexts/ContentContext';
import { useLocation } from 'react-router-dom';

export default function SEOHelper() {
  const { getContent } = useContent();
  const { pathname } = useLocation();
  const seoContent = getContent('seo_settings');

  const seoData = useMemo(() => {
    if (seoContent?.body) {
      try {
        const parsed = JSON.parse(seoContent.body);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [];
  }, [seoContent]);

  useEffect(() => {
    if (seoData.length > 0) {
      const title = seoData.find((s: any) => s.key === 'title')?.value;
      const description = seoData.find((s: any) => s.key === 'description')?.value;
      const keywords = seoData.find((s: any) => s.key === 'keywords')?.value;
      
      if (title && pathname === '/') {
        document.title = title;
      }

      if (description) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', description);
      }

      if (keywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', keywords);
      }
    }
  }, [seoData, pathname]);

  return null;
}
