import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function RequestQuote() {
  const [formData, setFormData] = useState({ name: '', phone: '', service: '', message: '', hp: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    const payload = {
      name: formData.name.trim().slice(0, 120),
      phone: formData.phone.trim().slice(0, 30),
      service: formData.service.trim().slice(0, 120) || null,
      message: formData.message.trim().slice(0, 4000),
      hp: formData.hp,
    };

    if (!payload.name || payload.phone.length < 5 || !payload.message) {
      setStatus('error');
      return;
    }

    try {
      const { error } = await supabase.from('messages').insert(payload);
      if (error) throw error;
      setFormData({ name: '', phone: '', service: '', message: '', hp: '' });
      setStatus('success');
    } catch (error) {
      console.error('Quote request submission failed:', error);
      setStatus('error');
    }
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
              <p className="text-gray-600 text-lg">يرجى تعبئة النموذج وسنتواصل معك لتقديم التسعيرة المناسبة.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <input
                type="text"
                name="website"
                value={formData.hp}
                onChange={(e) => setFormData({ ...formData, hp: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              {status === 'success' && <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">تم إرسال طلب عرض السعر بنجاح.</div>}
              {status === 'error' && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">تعذر الإرسال. تحقق من البيانات وحاول مرة أخرى.</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="quote-name" className="block text-sm font-bold text-gray-700 mb-2">الاسم الكريم</label>
                  <input id="quote-name" type="text" required minLength={1} maxLength={120} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-colors" placeholder="الاسم" />
                </div>
                <div>
                  <label htmlFor="quote-phone" className="block text-sm font-bold text-gray-700 mb-2">رقم الجوال</label>
                  <input id="quote-phone" type="tel" required minLength={5} maxLength={30} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-colors text-right" placeholder="05XXXXXXXX" dir="ltr" />
                </div>
              </div>

              <div>
                <label htmlFor="quote-service" className="block text-sm font-bold text-gray-700 mb-2">الخدمة المطلوبة</label>
                <select id="quote-service" value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-colors appearance-none bg-white">
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
                <textarea id="quote-message" required minLength={1} maxLength={4000} rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-colors resize-none" placeholder="اكتب تفاصيل المساحة والنوع المطلوب..." />
              </div>

              <button type="submit" disabled={status === 'submitting'} className="w-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-lg py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-60">
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
