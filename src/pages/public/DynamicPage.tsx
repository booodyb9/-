import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useContent } from '../../contexts/ContentContext';

const Hero = React.lazy(() => import('../../components/Hero'));
const Services = React.lazy(() => import('../../components/Services'));
const Process = React.lazy(() => import('../../components/Process'));
const GlassVisualizer = React.lazy(() => import('../../components/GlassVisualizer'));
const ProjectStats = React.lazy(() => import('../../components/ProjectStats'));
const Features = React.lazy(() => import('../../components/Features'));
const Gallery = React.lazy(() => import('../../components/Gallery'));
const Testimonials = React.lazy(() => import('../../components/Testimonials'));
const TrustedPartners = React.lazy(() => import('../../components/TrustedPartners'));
const FAQ = React.lazy(() => import('../../components/FAQ'));
const Maintenance = React.lazy(() => import('../../components/Maintenance'));
const Blog = React.lazy(() => import('../../components/Blog'));
const Contact = React.lazy(() => import('../../components/Contact'));

type LazySection = React.LazyExoticComponent<React.ComponentType<any>>;

const SectionMap: Record<string, LazySection> = {
  Hero,
  Services,
  Process,
  GlassVisualizer,
  ProjectStats,
  Features,
  Gallery,
  Testimonials,
  TrustedPartners,
  FAQ,
  Maintenance,
  Blog,
  Contact,
};

function SectionFallback() {
  return <div className="min-h-32" aria-hidden="true" />;
}

export default function DynamicPage() {
  const { slug } = useParams();
  const { contents, loading } = useContent();
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    if (loading) return;

    const pages = contents.filter((content) => content.key.startsWith('page_') && content.type === 'page');
    for (const page of pages) {
      if (!page.body) continue;
      try {
        const data = JSON.parse(page.body);
        if (data.slug === slug) {
          // Drafts are never exposed on the public route. They stay editable in Dashboard.
          setPageData(data.status === 'draft' ? 'not_found' : data);
          return;
        }
      } catch (error) {
        console.error('Error parsing page JSON', error);
      }
    }

    setPageData('not_found');
  }, [slug, contents, loading]);

  if (loading || !pageData) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center pt-32">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0284C7] border-t-transparent" />
        </main>
        <Footer />
      </>
    );
  }

  if (pageData === 'not_found') {
    return (
      <>
        <SEO noindex title="الصفحة غير موجودة | 404" description="الصفحة المطلوبة غير موجودة." />
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center px-4 pb-12 pt-32 text-center">
          <div className="mb-4 text-9xl font-bold text-[#0284C7]">404</div>
          <h1 className="mb-6 text-3xl font-bold text-gray-900">عذراً، الصفحة غير موجودة</h1>
          <p className="mb-8 max-w-md text-gray-600">يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو حذفها، أو أن الرابط غير صحيح.</p>
          <Link to="/" className="rounded-md bg-[#0284C7] px-8 py-3 font-medium text-white transition-colors hover:bg-[#0369A1]">العودة للرئيسية</Link>
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
        canonical={pageData.seo?.canonical}
        image={pageData.seo?.ogImage}
        noindex={pageData.seo?.noindex}
      />

      <Navbar />
      <main className="min-h-screen pt-20">
        {pageData.featuredImage ? (
          <div className="relative h-[40vh] w-full md:h-[50vh]">
            <img
              src={pageData.featuredImage}
              alt={pageData.title || 'صورة الصفحة'}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <h1 className="px-4 text-center text-4xl font-bold text-white md:text-5xl">{pageData.title}</h1>
            </div>
          </div>
        ) : (
          <div className="border-b border-gray-100 bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold text-gray-900">{pageData.title}</h1>
            </div>
          </div>
        )}

        {pageData.content && (
          <div className="prose prose-lg mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
          </div>
        )}

        {(pageData.sections || []).map((sectionName: string, index: number) => {
          if (sectionName === 'CustomHTML') {
            return (
              <div key={`custom-${index}`} className="mx-auto my-8 max-w-7xl rounded border border-dashed border-gray-300 px-4 py-12 text-center text-gray-500 sm:px-6 lg:px-8">
                Custom HTML block (not implemented yet)
              </div>
            );
          }

          const SectionComponent = SectionMap[sectionName];
          if (!SectionComponent) return null;

          return (
            <React.Suspense key={`${sectionName}-${index}`} fallback={<SectionFallback />}>
              <SectionComponent />
            </React.Suspense>
          );
        })}
      </main>
      <Footer />
    </>
  );
}
