import React from 'react';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FAQ from '../../components/FAQ';

export default function FAQPage() {
  return (
    <>
      <SEO title="الأسئلة الشائعة | شركة زجاج الرياض" description="صفحة الأسئلة الشائعة لموقع شركة زجاج الرياض" />
      <Navbar />
      <main className="min-h-screen">

      <div className="bg-[#0F172A] text-white pt-32 pb-16 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">الأسئلة الشائعة</h1>
          <p className="text-lg text-gray-300">إجابات وافية على كافة استفساراتكم</p>
        </div>
      </div>

        <div className="bg-gray-50 py-12">
            <FAQ />
        </div>
      </main>
      <Footer />
    </>
  );
}