import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function NotFound() {
  return (
    <>
      <SEO title="الصفحة غير موجودة | 404" noindex={true} />
      <Navbar />
      <main className="min-h-screen pt-32 pb-12 px-4 flex flex-col items-center justify-center text-center">
        <div className="text-9xl font-bold text-[#0284C7] mb-4">404</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">عذراً، الصفحة غير موجودة</h2>
        <p className="text-gray-600 mb-8 max-w-md">يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو حذفها، أو أن الرابط غير صحيح.</p>
        <Link to="/" className="bg-[#0284C7] text-white px-8 py-3 rounded-md hover:bg-[#0369A1] transition-colors font-medium">العودة للرئيسية</Link>
      </main>
      <Footer />
    </>
  );
}
