import React from 'react';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Terms() {
  return (
    <>
      <SEO title="الشروط والأحكام | شركة زجاج الرياض" description="الشروط والأحكام الخاصة بشركة زجاج الرياض" />
      <Navbar />
      <main className="pt-32 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-10">الشروط والأحكام</h1>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>مرحباً بك في موقع شركة زجاج الرياض. باستخدامك لهذا الموقع، فإنك توافق على الالتزام بالشروط والأحكام التالية:</p>
            <h3 className="text-2xl font-bold text-[#0F172A] mt-8 mb-4">1. الخدمات المقدمة</h3>
            <p>نحن نقدم خدمات تفصيل وتركيب الزجاج للمشاريع التجارية والسكنية. جميع المواصفات والأسعار قابلة للتغيير بناءً على متطلبات المشروع ومعاينة الموقع.</p>
            <h3 className="text-2xl font-bold text-[#0F172A] mt-8 mb-4">2. المعاينة والتسعير</h3>
            <p>عروض الأسعار المقدمة عبر الموقع أو الهاتف هي تقديرية. السعر النهائي يعتمد على المعاينة الميدانية وأخذ المقاسات الدقيقة.</p>
            <h3 className="text-2xl font-bold text-[#0F172A] mt-8 mb-4">3. الضمان</h3>
            <p>نقدم ضماناً على أعمال التركيب وجودة المواد المستخدمة وفقاً لما يتم الاتفاق عليه في العقد الرسمي المبرم بين الطرفين.</p>
            <h3 className="text-2xl font-bold text-[#0F172A] mt-8 mb-4">4. حقوق الملكية الفردية</h3>
            <p>جميع محتويات هذا الموقع من نصوص وصور وتصاميم هي ملك لشركة زجاج الرياض ولا يجوز استخدامها دون إذن مسبق.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}