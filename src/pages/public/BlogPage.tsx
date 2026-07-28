import React from 'react';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Blog from '../../components/Blog';

export default function BlogPage() {
  return (
    <>
      <SEO title="المدونة | شركة زجاج الرياض" description="اقرأ أحدث المقالات والنصائح حول عالم الزجاج." />
      <Navbar />
      <main>

      <div className="bg-[#0F172A] text-white pt-32 pb-16 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">المدونة</h1>
          <p className="text-lg text-gray-300">أحدث المقالات والنصائح في عالم الزجاج</p>
        </div>
      </div>

        <Blog />
      </main>
      <Footer />
    </>
  );
}
