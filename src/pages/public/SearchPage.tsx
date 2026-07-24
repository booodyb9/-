import React, { useState, useMemo } from 'react';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Search } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';
import { Link } from 'react-router-dom';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { getContent } = useContent();

  const servicesContent = getContent('services_items');
  const portfolioContent = getContent('gallery_items');
  const blogContent = getContent('blog_items');
  const faqContent = getContent('faq_items');

  const dynamicSearchData = useMemo(() => {
    const data: any[] = [];
    
    if (servicesContent?.body) {
      try {
        const parsed = JSON.parse(servicesContent.body);
        if (Array.isArray(parsed)) {
          parsed.forEach((s: any) => {
             const slug = s.title.replace(/\s+/g, '-').toLowerCase();
             data.push({ title: s.title, description: s.description, category: 'الخدمات', href: `/services/${slug}` });
          });
        }
      } catch (e) {}
    }

    if (portfolioContent?.body) {
      try {
        const parsed = JSON.parse(portfolioContent.body);
        if (Array.isArray(parsed)) {
          parsed.forEach((s: any) => {
             const slug = s.title.replace(/\s+/g, '-').toLowerCase();
             data.push({ title: s.title, description: s.description, category: 'أعمالنا', href: `/portfolio/${slug}` });
          });
        }
      } catch (e) {}
    }

    if (blogContent?.body) {
      try {
        const parsed = JSON.parse(blogContent.body);
        if (Array.isArray(parsed)) {
          parsed.forEach((s: any) => {
             const slug = s.title.replace(/\s+/g, '-').toLowerCase();
             data.push({ title: s.title, description: s.excerpt, category: 'المدونة', href: `/blog/${slug}` });
          });
        }
      } catch (e) {}
    }

    if (faqContent?.body) {
      try {
        const parsed = JSON.parse(faqContent.body);
        if (Array.isArray(parsed)) {
          parsed.forEach((s: any) => {
             data.push({ title: s.question, description: s.answer, category: 'الأسئلة الشائعة', href: `/faq` });
          });
        }
      } catch (e) {}
    }

    return data;
  }, [servicesContent, portfolioContent, blogContent, faqContent]);

  const filteredResults = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return dynamicSearchData.filter(item => 
      item.title?.toLowerCase().includes(lowerQuery) ||
      item.description?.toLowerCase().includes(lowerQuery) ||
      item.category?.toLowerCase().includes(lowerQuery)
    );
  }, [query, dynamicSearchData]);


  return (
    <>
      <SEO title="البحث | شركة زجاج الرياض" description="ابحث في خدمات ومقالات شركة زجاج الرياض" />
      <Navbar />
      <main className="min-h-screen pt-32 pb-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-[#0F172A] mb-8 text-center">البحث</h1>
          <div className="relative mb-12">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن الخدمات، المشاريع، أو المقالات..." 
              className="w-full pl-12 pr-6 py-4 rounded-xl border border-gray-200 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none text-lg transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {query.length > 0 ? (
                filteredResults.length > 0 ? (
                    <div className="space-y-6 text-right">
                        {filteredResults.map((result, idx) => (
                            <Link key={idx} to={result.href} className="block group">
                                <div className="border-b border-gray-100 pb-6 group-hover:bg-gray-50 p-4 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs font-bold px-2 py-1 bg-[#0284C7]/10 text-[#0284C7] rounded">
                                            {result.category}
                                        </span>
                                        <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-[#0284C7] transition-colors">{result.title}</h3>
                                    </div>
                                    {result.description && (
                                        <p className="text-gray-600 line-clamp-2">{result.description}</p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-gray-600 text-lg">لم يتم العثور على نتائج لـ "{query}"</p>
                    </div>
                )
            ) : (
                <div className="text-center">
                    <p className="text-gray-500">أدخل كلمة البحث في المربع أعلاه للبدء</p>
                </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}