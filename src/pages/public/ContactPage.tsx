import React from 'react';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Contact from '../../components/Contact';

export default function ContactPage() {
  return (
    <>
      <SEO title="اتصل بنا | شركة زجاج الرياض" description="تواصل معنا للاستفسار وطلب الخدمات." />
      <Navbar />
      <main className="pt-20">
        <Contact />
      </main>
      <Footer />
    </>
  );
}
