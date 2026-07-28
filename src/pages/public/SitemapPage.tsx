import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function SitemapPage() {
  const links = [
    { name: 'الرئيسية', path: '/' },
    { name: 'عن الشركة', path: '/about' },
    { name: 'الخدمات', path: '/services' },
    { name: 'معرض الأعمال', path: '/portfolio' },
    { name: 'المدونة', path: '/blog' },
    { name: 'الأسئلة الشائعة', path: '/faq' },
    { name: 'آراء العملاء', path: '/testimonials' },
    { name: 'اتصل بنا', path: '/contact' },
    { name: 'طلب تسعيرة', path: '/request-quote' },
    { name: 'سياسة الخصوصية', path: '/privacy-policy' },
    { name: 'الشروط والأحكام', path: '/terms' }
  ];

  return (
    <>
      <SEO title="خريطة الموقع | شركة زجاج الرياض" description="خريطة الموقع لشركة زجاج الرياض للوصول السريع لجميع الصفحات." />
      <Navbar />
      <main className="pt-32 pb-24 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-8">خريطة الموقع</h1>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {links.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-[#0284C7] hover:underline text-lg font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
