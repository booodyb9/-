import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SectionCTA from '../../components/SectionCTA';
import { useContent } from '../../contexts/ContentContext';

export default function ServiceDetails() {
  const { slug } = useParams();
  const { getContent } = useContent();
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    const servicesContent = getContent('services_items');
    if (servicesContent && servicesContent.body) {
      try {
        const services = JSON.parse(servicesContent.body);
        const found = services.find((s: any) => 
          !s.isHidden && (
            s.title === decodeURIComponent(slug || '') || 
            s.title.replace(/\s+/g, '-').toLowerCase() === slug
          )
        );
        setService(found);
      } catch (e) {}
    }
  }, [slug, getContent]);


  const serviceSchema = service ? {
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": "شركة زجاج الرياض",
      "image": "https://riyadh-glass.ai.studio/og-image.jpg"
    },
    "areaServed": "الرياض",
    "image": service.image
  } : undefined;

  if (!service) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-12 px-4 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold mb-4">جاري التحميل أو الخدمة غير موجودة</div>
          <Link to="/services" className="text-[#0284C7] hover:underline font-bold">العودة للخدمات</Link>
      </main>
        <Footer />
      </>
    );
  }

  return (
    <>
            
      <SEO 
        title={service.seoTitle || `${service.title} | شركة زجاج الرياض`} 
        description={service.seoDescription || service.description}
        keywords={service.seoKeywords}
        canonical={service.seoCanonical}
        image={service.seoImage || service.image}
        noindex={service.seoNoIndex}
        structuredData={{

          "@type": "Service",
          "name": service.title,
          "description": service.description,
          "provider": {
            "@type": "HomeAndConstructionBusiness",
            "name": "شركة زجاج الرياض",
            "image": "https://riyadh-glass.ai.studio/og-image.jpg"
          },
          "image": service.image,
          "areaServed": "الرياض"
        }}
      />
      <Navbar />
      <main className="min-h-screen pt-24 pb-12">
        {service.bgImage && (
          <div className="absolute top-0 left-0 w-full h-[600px] -z-10">
            <div className="absolute inset-0 bg-black/60 z-10" />
            <img loading="lazy" decoding="async" src={service.bgImage} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {service.image && (
            <div className="h-[400px] w-full overflow-hidden">
              <img loading="lazy" decoding="async" src={service.image} alt={service.title || 'صورة'} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{service.title}</h1>
            <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: service.description }} />
            
            <div className="mt-12">
              <SectionCTA />
              <div className="mt-8 text-center">
                <Link to="/services" className="bg-gray-100 text-gray-800 px-8 py-3 rounded-md hover:bg-gray-200 transition-colors font-bold inline-block">
                  العودة للخدمات
                </Link>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
