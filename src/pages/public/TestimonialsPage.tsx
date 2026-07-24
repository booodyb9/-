import React from 'react';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Testimonials from '../../components/Testimonials';

export default function TestimonialsPage() {
  return (
    <>
      <SEO title="آراء العملاء | شركة زجاج الرياض" description="صفحة آراء العملاء لموقع شركة زجاج الرياض" />
      <Navbar />
      <main className="pt-20 min-h-screen">
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}