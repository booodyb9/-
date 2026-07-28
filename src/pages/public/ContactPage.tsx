import React from 'react';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Contact from '../../components/Contact';

export default function ContactPage() {
  return (
    <>
            <SEO 
        title="اتصل بنا | شركة زجاج الرياض" 
        description="تواصل معنا للاستفسار وطلب الخدمات."
        structuredData={{
          "@type": "ContactPage",
          "name": "اتصل بنا",
          "description": "تواصل معنا للاستفسار وطلب الخدمات.",
          "mainEntity": {
            "@type": "ContactPoint",
            "telephone": "+966510233706",
            "contactType": "customer service",
            "availableLanguage": ["Arabic", "English"]
          }
        }}
      />
      <Navbar />
      <main>

      <div className="bg-[#0F172A] text-white pt-32 pb-16 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">اتصل بنا</h1>
          <p className="text-lg text-gray-300">نحن هنا لخدمتك والرد على استفساراتك</p>
        </div>
      </div>

        <Contact />
      </main>
      <Footer />
    </>
  );
}
