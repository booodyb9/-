import React from 'react';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Services from '../../components/Services';
import Process from '../../components/Process';
import { useContent } from '../../contexts/ContentContext';
import Maintenance from '../../components/Maintenance';

export default function ServicesPage() {
  const { getContent } = useContent();
  const itemsContent = getContent('services_items');
  
  let services: any[] = [];
  if (itemsContent?.body) {
    try {
      const parsed = JSON.parse(itemsContent.body);
      if (Array.isArray(parsed)) services = parsed;
    } catch (e) {}
  }

  const structuredData = {
    "@type": "ItemList",
    "itemListElement": services.map((service, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": service.title,
        "description": service.description,
        "url": `https://riyadh-glass.ai.studio/services/${service.title ? service.title.replace(/\s+/g, '-').toLowerCase() : ''}`,
        "provider": {
          "@type": "HomeAndConstructionBusiness",
          "name": "شركة زجاج الرياض"
        }
      }
    }))
  };

  return (
    <>
      <SEO 
        title="خدماتنا | شركة زجاج الرياض" 
        description="جميع خدمات تركيب الواجهات والقواطع الزجاجية." 
        structuredData={services.length > 0 ? structuredData : undefined}
      />
      <Navbar />
      <main>

      <div className="bg-[#0F172A] text-white pt-32 pb-16 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">خدماتنا</h1>
          <p className="text-lg text-gray-300">اكتشف مجموعة واسعة من الخدمات التي نقدمها</p>
        </div>
      </div>

        <Services />
        <Process />
        <Maintenance />
      </main>
      <Footer />
    </>
  );
}
