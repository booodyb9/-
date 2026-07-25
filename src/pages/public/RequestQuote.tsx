import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function RequestQuote() {
  return (
    <>
      <SEO title="طلب عرض سعر | شركة زجاج الرياض" description="اطلب تسعيرة لخدمات تركيب الزجاج" />
      <Navbar />
      <main className="min-h-screen pt-32 pb-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4">طلب عرض سعر</h1>
              <p className="text-gray-600 text-lg">نحن هنا لخدمتك. يرجى تعبئة النموذج أدناه وسنقوم بالتواصل معك في أقرب وقت لتقديم التسعيرة المناسبة.</p>
            </div>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكريم</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-colors" placeholder="الاسم" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">رقم الجوال</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-colors text-right" placeholder="05XXXXXXXX" dir="ltr" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الخدمة المطلوبة</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-colors appearance-none bg-white">
                  <option value="">اختر الخدمة...</option>
                  <option value="facades">واجهات زجاجية واستركشر</option>
                  <option value="partitions">قواطع زجاجية مكتبية</option>
                  <option value="stairs">درابزين زجاجي</option>
                  <option value="shower">كبائن شاور</option>
                  <option value="mirrors">مرايا ديكورية</option>
                  <option value="other">خدمة أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">تفاصيل إضافية عن المشروع</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-colors resize-none" placeholder="اكتب تفاصيل المساحة والنوع المطلوب..."></textarea>
              </div>

              <button type="submit" className="w-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-lg py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl">
                إرسال الطلب
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}