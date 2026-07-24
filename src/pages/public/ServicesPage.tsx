import React from 'react';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Services from '../../components/Services';
import Process from '../../components/Process';
import Maintenance from '../../components/Maintenance';

export default function ServicesPage() {
  return (
    <>
      <SEO title="خدماتنا | شركة زجاج الرياض" description="جميع خدمات تركيب الواجهات والقواطع الزجاجية." />
      <Navbar />
      <main className="pt-20">
        <Services />
        <Process />
        <Maintenance />
      </main>
      <Footer />
    </>
  );
}
