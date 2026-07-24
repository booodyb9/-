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
      <main className="pt-20 min-h-screen">
        <div className="bg-gray-50 py-12">
            <FAQ />
        </div>
      </main>
      <Footer />
    </>
  );
}