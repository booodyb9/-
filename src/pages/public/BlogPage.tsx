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
      <main className="pt-20">
        <Blog />
      </main>
      <Footer />
    </>
  );
}
