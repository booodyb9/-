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
      <main className="pt-20">
        <Gallery />
      </main>
      <Footer />
    </>
  );
}