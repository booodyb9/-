import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useContent } from '../../contexts/ContentContext';
import { useAuth } from '../../contexts/AuthContext';

// Import all sections we can dynamically render
import Hero from '../../components/Hero';
import Services from '../../components/Services';
import Process from '../../components/Process';
import GlassVisualizer from '../../components/GlassVisualizer';
import ProjectStats from '../../components/ProjectStats';
import Features from '../../components/Features';
import Gallery from '../../components/Gallery';
import Testimonials from '../../components/Testimonials';
import TrustedPartners from '../../components/TrustedPartners';
import FAQ from '../../components/FAQ';
import Maintenance from '../../components/Maintenance';
import Blog from '../../components/Blog';
import Contact from '../../components/Contact';

const SectionMap: Record<string, React.FC> = {
  'Hero': Hero,
  'Services': Services,
  'Process': Process,
  'GlassVisualizer': GlassVisualizer,
  'ProjectStats': ProjectStats,
  'Features': Features,
  'Gallery': Gallery,
  'Testimonials': Testimonials,
  'TrustedPartners': TrustedPartners,
  'FAQ': FAQ,
  'Maintenance': Maintenance,
  'Blog': Blog,
  'Contact': Contact
};

export default function DynamicPage() {
  const { slug } = useParams();
  const { contents, loading } = useContent();
  const { isAdmin } = useAuth();
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    if (loading) return;
    
    // Look for a page that matches this slug
    const pageContent = contents.find(c => c.key.startsWith('page_') && c.type === 'page');
    if (pageContent && pageContent.body) {
      try {
        const pages = contents.filter(c => c.key.startsWith('page_') && c.type === 'page');
        for (const p of pages) {
            const data = JSON.parse(p.body);
            if (data.slug === slug) {
                // If it's a draft, only admins can see it
                if (data.status === 'draft' && !isAdmin) {
                   setPageData('not_found');
                   return;
                }
                setPageData(data);
                return;
            }
        }
      } catch (e) {
          console.error(e);
      }
    }
    
    setPageData('not_found');
  }, [slug, contents, loading, isAdmin]);

  if (loading || !pageData) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </>
    );
  }

  if (pageData === 'not_found') {
    return (
      <>
        <SEO title="الصفحة غير موجودة | 404" />
        <Navbar />
        <main className="min-h-screen pt-32 pb-12 px-4 flex flex-col items-center justify-center text-center">
          <h1 className="text-9xl font-bold text-[#0284C7] mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">عذراً، الصفحة غير موجودة</h2>
          <p className="text-gray-600 mb-8 max-w-md">يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو حذفها، أو أن الرابط غير صحيح.</p>
          <Link to="/" className="bg-[#0284C7] text-white px-8 py-3 rounded-md hover:bg-[#0369A1] transition-colors font-medium">العودة للرئيسية</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO 
        title={`${pageData.seo?.title || pageData.title} | شركة زجاج الرياض`} 
        description={pageData.seo?.description}
        keywords={pageData.seo?.keywords}
      />
      <Navbar />
      <main className="min-h-screen pt-20">
        
        {pageData.featuredImage && (
            <div className="w-full h-[40vh] md:h-[50vh] relative">
                <img src={pageData.featuredImage} alt={pageData.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white px-4 text-center">{pageData.title}</h1>
                </div>
            </div>
        )}
        
        {!pageData.featuredImage && (
            <div className="bg-gray-50 py-12 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-gray-900">{pageData.title}</h1>
                </div>
            </div>
        )}
        
        {pageData.content && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
            </div>
        )}

        {pageData.sections && pageData.sections.map((sectionName: string, index: number) => {
            if (sectionName === 'CustomHTML') {
                return (
                    <div key={`custom-${index}`} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-500 border border-dashed border-gray-300 my-8 rounded">
                        Custom HTML block (not implemented yet)
                    </div>
                );
            }
            const SectionComponent = SectionMap[sectionName];
            if (SectionComponent) {
                return <SectionComponent key={`${sectionName}-${index}`} />;
            }
            return null;
        })}

      </main>
      <Footer />
    </>
  );
}
