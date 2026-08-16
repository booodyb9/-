import React, { useState, useMemo, useEffect } from 'react';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Search, Loader2, MessageSquare, Sparkles } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';
import { Link, useNavigate } from 'react-router-dom';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [smartResults, setSmartResults] = useState<any[] | null>(null);
  
  const { getContent } = useContent();
  const navigate = useNavigate();
  
  const servicesContent = getContent('services_items');
  const portfolioContent = getContent('premium_portfolio_projects');
  const blogContent = getContent('blog_items');
  const faqContent = getContent('faq_items');

  const dynamicSearchData = useMemo(() => {
    const data: any[] = [];
    let idCounter = 1;
    
    const parseBody = (body: any, category: string, linkPrefix: string, descKey: string) => {
        try {
            const parsed = JSON.parse(body);
            if (Array.isArray(parsed)) {
                parsed.forEach((s: any) => {
                    const slug = s.slug || s.title.replace(/\s+/g, '-').toLowerCase();
                    data.push({ 
                        id: String(idCounter++),
                        title: s.title || s.question || s.name, 
                        description: s[descKey] || s.description || s.excerpt || s.answer, 
                        category, 
                        href: `/${linkPrefix}/${slug}` 
                    });
                });
            }
        } catch (e) {}
    };

    if (servicesContent?.body) parseBody(servicesContent.body, 'الخدمات', 'services', 'description');
    if (portfolioContent?.body) parseBody(portfolioContent.body, 'أعمالنا', 'portfolio', 'description');
    if (blogContent?.body) parseBody(blogContent.body, 'المدونة', 'blog', 'excerpt');
    if (faqContent?.body) parseBody(faqContent.body, 'الأسئلة الشائعة', 'faq', 'answer'); // faq might not use slug, but we'll link to /faq

    return data;
  }, [servicesContent, portfolioContent, blogContent, faqContent]);

  const exactMatches = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return dynamicSearchData.filter(item => 
      item.title?.toLowerCase().includes(lowerQuery) ||
      item.description?.toLowerCase().includes(lowerQuery) ||
      item.category?.toLowerCase().includes(lowerQuery)
    );
  }, [query, dynamicSearchData]);

  // Debounced Smart Search
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.trim().length > 2 && exactMatches.length === 0) {
        setIsSearching(true);
        try {
            // Simplify data for AI to save tokens
            const siteDataStr = JSON.stringify(dynamicSearchData.map(d => ({id: d.id, t: d.title, c: d.category})));
            const res = await fetch('/api/smart-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, siteData: siteDataStr })
            });
            const data = await res.json();
            const parsed = JSON.parse(data.result);
            if (parsed.matchedIds && Array.isArray(parsed.matchedIds)) {
                const matched = parsed.matchedIds.map((id: string) => dynamicSearchData.find(d => d.id === String(id))).filter(Boolean);
                setSmartResults(matched);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSearching(false);
        }
      } else {
        setSmartResults(null);
      }
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [query, exactMatches.length, dynamicSearchData]);

  const resultsToDisplay = exactMatches.length > 0 ? exactMatches : (smartResults || []);

  return (
    <>
      <SEO title="البحث الذكي | شركة زجاج الرياض" description="ابحث في خدمات ومقالات شركة زجاج الرياض باستخدام الذكاء الاصطناعي" />
      <Navbar />
      <main className="min-h-screen pt-32 pb-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-[#0F172A] flex items-center justify-center gap-3">
              البحث الذكي
              <Sparkles className="w-8 h-8 text-[#0284C7]" />
            </h1>
            <p className="text-gray-500 mt-2">يفهم العبارات والمعاني للوصول لأفضل نتيجة</p>
          </div>
          
          <div className="relative mb-12">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن الخدمات، المشاريع، أو اسألنا..." 
              className="w-full pl-12 pr-6 py-4 rounded-xl border border-gray-200 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none text-lg transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
            {isSearching && (
               <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0284C7] w-5 h-5 animate-spin" />
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {query.length > 0 ? (
                resultsToDisplay.length > 0 ? (
                    <div>
                        {exactMatches.length === 0 && smartResults && smartResults.length > 0 && (
                            <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg flex items-center gap-2 font-bold text-sm">
                                <Sparkles className="w-4 h-4" />
                                لم نجد تطابقاً حرفياً، لكن هذه أقرب النتائج لما تقصده:
                            </div>
                        )}
                        <div className="space-y-6 text-right">
                            {resultsToDisplay.map((result: any, idx: number) => (
                                <Link key={idx} to={result.category === 'الأسئلة الشائعة' ? '/faq' : result.href} className="block group">
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
                    </div>
                ) : (
                    <div className="text-center py-12">
                        {isSearching ? (
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-8 h-8 text-[#0284C7] animate-spin" />
                                <p className="text-gray-600">الذكاء الاصطناعي يحلل طلبك...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-gray-600 text-lg">لم نتمكن من العثور على خدمات تطابق "{query}"</p>
                                <button onClick={() => navigate('/contact')} className="inline-flex items-center gap-2 bg-[#0284C7] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-bold">
                                    <MessageSquare className="w-5 h-5" />
                                    لم تجد ما تبحث عنه؟ أرسل لنا طلبك
                                </button>
                            </div>
                        )}
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