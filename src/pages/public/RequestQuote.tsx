import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { buildMessagePayload } from '../dashboard/dashboard-utils.mjs';

export default function RequestQuote() {
  const [formData, setFormData] = useState({ name: '', phone: '', service: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: import('react').FormEvent) => {
    event.preventDefault();
    setStatus('submitting');

    const { error } = await supabase.from('messages').insert([
      buildMessagePayload({ ...formData, source: 'صفحة طلب عرض سعر' }),
    ]);

    if (error) {
      console.error('Quote request failed:', error);
      setStatus('error');
      return;
    }

    setFormData({ name: '', phone: '', service: '', message: '' });
    setStatus('success');
  };

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

            <form className="space-y-6" onSubmit={handleSubmit}>
              {status === 'success' && <div className="bg-green-50 text-green-700 p-4 rounded-lg">تم إرسال طلبك بنجاح وسنتواصل معك قريباً.</div>}
              {status === 'error' && <div className="bg-red-50 text-red-700 p-4 rounded-lg">تعذر إرسال الطلب. حاول مرة أخرى أو تواصل معنا عبر واتساب.</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="quote-name" className="block text-sm font-bold text-gray-700 mb-2">الاسم الكريم</label>
                  <input id="quote-name" type="text" required value={formData.name} onChange={event => setFormData({ ...formData, name: event.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-colors" placeholder="الاسم" />
                </div>
                <div>
                  <label htmlFor="quote-phone" className="block text-sm font-bold text-gray-700 mb-2">رقم الجوال</label>
                  <input id="quote-phone" type="tel" required value={formData.phone} onChange={event => setFormData({ ...formData, phone: event.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-colors text-right" placeholder="05XXXXXXXX" dir="ltr" />
                </div>
              </div>

              <div>
                <label htmlFor="quote-service" className="block text-sm font-bold text-gray-700 mb-2">الخدمة المطلوبة</label>
                <select id="quote-service" required value={formData.service} onChange={event => setFormData({ ...formData, service: event.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-colors appearance-none bg-white">
                  <option value="">اختر الخدمة...</option>
                  <option value="واجهات زجاجية واستركشر">واجهات زجاجية واستركشر</option>
                  <option value="قواطع زجاجية مكتبية">قواطع زجاجية مكتبية</option>
                  <option value="درابزين زجاجي">درابزين زجاجي</option>
                  <option value="كبائن شاور">كبائن شاور</option>
                  <option value="مرايا ديكورية">مرايا ديكورية</option>
                  <option value="خدمة أخرى">خدمة أخرى</option>
                </select>
              </div>

              <div>
                <label htmlFor="quote-message" className="block text-sm font-bold text-gray-700 mb-2">تفاصيل إضافية عن المشروع</label>
                <textarea id="quote-message" rows={4} value={formData.message} onChange={event => setFormData({ ...formData, message: event.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-colors resize-none" placeholder="اكتب تفاصيل المساحة والنوع المطلوب..." />
              </div>

              <button type="submit" disabled={status === 'submitting'} className="w-full bg-[#0284C7] hover:bg-[#0369A1] disabled:bg-gray-400 text-white font-bold text-lg py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl">
                {status === 'submitting' ? 'جاري الإرسال...' : 'إرسال الطلب'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
