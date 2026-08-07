import React from 'react';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SectionCTA from '../../components/SectionCTA';
import Testimonials from '../../components/Testimonials';

export default function TestimonialsPage() {
  return (
    <>
      <SEO title="آراء العملاء | شركة زجاج الرياض" description="صفحة آراء العملاء لموقع شركة زجاج الرياض" />
      <Navbar />
      <main className="min-h-screen">

      <div className="bg-[#0F172A] text-white pt-32 pb-16 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">آراء العملاء</h1>
          <p className="text-lg text-gray-300">ماذا يقول عملاؤنا عن خدماتنا</p>
        </div>
      </div>

        <Testimonials />
        <div className="py-12 bg-white border-t border-gray-100"><SectionCTA /></div>
      </main>
      <Footer />
    </>
  );
}