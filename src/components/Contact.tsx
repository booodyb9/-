import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { supabase } from '../lib/supabase';

interface CompanyInfoItem {
  key?: string;
  value?: string;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    message: '',
    hp: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const { getContent } = useContent();
  const contactContent = getContent('contact_content');
  const companyInfoContent = getContent('company_info');

  const companyInfo = useMemo<CompanyInfoItem[]>(() => {
    if (!companyInfoContent?.body) return [];
    try {
      const parsed = JSON.parse(companyInfoContent.body);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Invalid company_info content:', error);
      return [];
    }
  }, [companyInfoContent?.body]);

  const getCompanyValue = (key: string, fallback: string) => {
    const item = companyInfo.find((entry) => entry.key === key);
    return typeof item?.value === 'string' && item.value.trim() ? item.value : fallback;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
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

      const { error } = await supabase.from('messages').insert(payload);
      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', phone: '', service: '', message: '', hp: '' });
      window.setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Contact submission failed:', err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0F172A] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-[#0ea5e9] text-sm font-bold tracking-widest uppercase mb-4">تواصل معنا</h2>
          {contactContent?.body ? (
            <div className="prose prose-lg prose-invert mx-auto mb-6" dangerouslySetInnerHTML={{ __html: contactContent.body }} />
          ) : (
            <>
              <h3 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">مستعدون لتنفيذ مشروعك القادم</h3>
              <p className="text-lg text-gray-400">احصل على استشارة مجانية وعرض سعر مبدئي لمشروعك. فريقنا متواجد للرد على جميع استفساراتك.</p>
            </>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/5 text-[#0ea5e9] rounded-2xl shadow-inner border border-white/10 flex items-center justify-center shrink-0"><MapPin className="h-6 w-6" /></div>
              <div>
                <h4 className="text-xl font-bold mb-2">موقعنا</h4>
                <p className="text-gray-400 leading-relaxed">{getCompanyValue('address', 'طريق الملك فهد، حي العليا')}<br />{getCompanyValue('address_details', 'الرياض، المملكة العربية السعودية')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/5 text-[#0ea5e9] rounded-2xl shadow-inner border border-white/10 flex items-center justify-center shrink-0"><Phone className="h-6 w-6" /></div>
              <div>
                <h4 className="text-xl font-bold mb-2">اتصل بنا</h4>
                <p className="text-gray-400 leading-relaxed" dir="ltr">{getCompanyValue('phone', '+966 51 023 3706')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/5 text-[#0ea5e9] rounded-2xl shadow-inner border border-white/10 flex items-center justify-center shrink-0"><Mail className="h-6 w-6" /></div>
              <div>
                <h4 className="text-xl font-bold mb-2">البريد الإلكتروني</h4>
                <p className="text-gray-400 leading-relaxed">{getCompanyValue('email', 'info@glassvision-ksa.com')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/5 text-[#0ea5e9] rounded-2xl shadow-inner border border-white/10 flex items-center justify-center shrink-0"><Clock className="h-6 w-6" /></div>
              <div>
                <h4 className="text-xl font-bold mb-2">ساعات العمل</h4>
                <p className="text-gray-400 leading-relaxed">{getCompanyValue('working_hours', 'الأحد - الخميس: 8 صباحاً - 6 مساءً')}<br />{getCompanyValue('working_hours_friday', 'الجمعة: مغلق')}</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463877.31244093843!2d46.93246736569614!3d24.725455364177265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1714152542566!5m2!1sen!2s"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="موقع الرياض"
              />
            </div>
          </motion.div>

          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-10 sm:p-12 shadow-[0_20px_60px_rgb(0,0,0,0.3)] text-[#0F172A] border border-gray-100"
            >
              <h4 className="text-3xl font-extrabold text-[#0F172A] mb-8">أرسل لنا رسالة</h4>
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

                {status === 'success' && <div className="bg-green-50 text-green-700 p-4 rounded-sm border border-green-200">تم إرسال طلبك بنجاح! سنتواصل معك قريباً.</div>}
                {status === 'error' && <div className="bg-red-50 text-red-700 p-4 rounded-sm border border-red-200">حدث خطأ أثناء الإرسال. تحقق من البيانات وحاول مرة أخرى.</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">الاسم الكريم</label>
                    <input id="name" type="text" required minLength={1} maxLength={120} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/10 transition-all bg-gray-50 outline-none rounded-xl" placeholder="أحمد محمد" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">رقم الجوال</label>
                    <input id="phone" type="tel" required minLength={5} maxLength={30} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} dir="ltr" className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/10 transition-all bg-gray-50 outline-none rounded-xl text-right" placeholder="+966 5X XXX XXXX" />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-bold text-gray-700 mb-2">نوع الخدمة المطلوبة</label>
                  <select id="service" value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/10 transition-all bg-gray-50 outline-none rounded-xl appearance-none">
                    <option value="">اختر الخدمة...</option>
                    <option value="واجهات زجاجية">واجهات زجاجية</option>
                    <option value="قواطع مكتبية">قواطع مكتبية</option>
                    <option value="أبواب ونوافذ">أبواب ونوافذ</option>
                    <option value="كبائن شاور">كبائن شاور</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">تفاصيل الطلب</label>
                  <textarea id="message" required minLength={1} maxLength={4000} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={4} className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/10 transition-all bg-gray-50 outline-none rounded-xl resize-none" placeholder="اكتب تفاصيل مشروعك أو استفسارك هنا..." />
                </div>

                <button type="submit" disabled={status === 'submitting'} className="w-full bg-[#0284C7] text-white font-bold py-4 hover:bg-[#0369A1] transition-colors rounded-xl disabled:bg-gray-400">
                  {status === 'submitting' ? 'جاري الإرسال...' : 'إرسال الطلب'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
