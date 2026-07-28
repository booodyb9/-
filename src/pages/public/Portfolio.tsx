import React from 'react';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Gallery from '../../components/Gallery';

export default function Portfolio() {
  return (
    <>
      <SEO title="معرض الأعمال | شركة زجاج الرياض" description="تصفح معرض أعمالنا ومشاريعنا السابقة." />
      <Navbar />
      <main>

      <div className="bg-[#0F172A] text-white pt-32 pb-16 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">معرض الأعمال</h1>
          <p className="text-lg text-gray-300">تصفح أحدث مشاريعنا وأعمالنا السابقة</p>
        </div>
      </div>

        <Gallery />
      </main>
      <Footer />
    </>
  );
}