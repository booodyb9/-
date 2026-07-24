import React from 'react';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <SEO title="سياسة الخصوصية | شركة زجاج الرياض" description="سياسة الخصوصية الخاصة بشركة زجاج الرياض" />
      <Navbar />
      <main className="pt-32 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-10">سياسة الخصوصية</h1>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>نحن في شركة زجاج الرياض نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيفية جمعنا للمعلومات واستخدامها.</p>
            <h3 className="text-2xl font-bold text-[#0F172A] mt-8 mb-4">1. المعلومات التي نجمعها</h3>
            <p>قد نقوم بجمع المعلومات الشخصية التي تقدمها لنا طواعية عند ملء نماذج الاتصال، مثل الاسم، رقم الهاتف، البريد الإلكتروني، وتفاصيل المشروع.</p>
            <h3 className="text-2xl font-bold text-[#0F172A] mt-8 mb-4">2. استخدام المعلومات</h3>
            <p>نستخدم معلوماتك لغرض التواصل معك لتقديم عروض الأسعار، الرد على استفساراتك، وتقديم خدماتنا بشكل أفضل.</p>
            <h3 className="text-2xl font-bold text-[#0F172A] mt-8 mb-4">3. حماية البيانات</h3>
            <p>نتخذ إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف.</p>
            <h3 className="text-2xl font-bold text-[#0F172A] mt-8 mb-4">4. مشاركة المعلومات</h3>
            <p>نحن لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك فقط مع مزودي الخدمات الذين يساعدوننا في تشغيل موقعنا وتقديم خدماتنا.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}