import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const { getContent } = useContent();
  const contactContent = getContent('contact_content');
  const companyInfoContent = getContent('company_info');

  const companyInfo = typeof companyInfoContent?.body === 'string' ? JSON.parse(companyInfoContent.body) : [];
  
  const getCompanyValue = (key: string, fallback: string) => {
    try {
      const item = companyInfo.find((i: any) => i.key === key);
      return item ? item.value : fallback;
    } catch {
      return fallback;
    }
  };

  const handleSubmit = async (e: import("react").FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const { error } = await supabase.from('messages').insert([{
        name: formData.name,
        email: formData.phone, // storing phone in email field as in original
        message: `[الخدمة: ${formData.service}] - ${formData.message}`,
        is_read: false
      }]);
      if (error) throw error;
      
      setStatus('success');
      setFormData({ name: '', phone: '', service: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0F172A] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
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
              <h3 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                مستعدون لتنفيذ مشروعك القادم
              </h3>
              <p className="text-lg text-gray-400">
                احصل على استشارة مجانية وعرض سعر مبدئي لمشروعك. فريقنا متواجد للرد على جميع استفساراتك.
              </p>
            </>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/5 text-[#0ea5e9] rounded-2xl shadow-inner border border-white/10 flex items-center justify-center shrink-0">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">موقعنا</h4>
                <p className="text-gray-400 leading-relaxed">
                  {getCompanyValue('address', 'طريق الملك فهد، حي العليا')}<br />
                  {getCompanyValue('address_details', 'الرياض، المملكة العربية السعودية')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/5 text-[#0ea5e9] rounded-2xl shadow-inner border border-white/10 flex items-center justify-center shrink-0">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">اتصل بنا</h4>
                <p className="text-gray-400 leading-relaxed" dir="ltr">
                  {getCompanyValue('phone', '+966 51 023 3706')}<br />
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/5 text-[#0ea5e9] rounded-2xl shadow-inner border border-white/10 flex items-center justify-center shrink-0">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">البريد الإلكتروني</h4>
                <p className="text-gray-400 leading-relaxed">
                  {getCompanyValue('email', 'info@glassvision-ksa.com')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/5 text-[#0ea5e9] rounded-2xl shadow-inner border border-white/10 flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">ساعات العمل</h4>
                <p className="text-gray-400 leading-relaxed">
                  {getCompanyValue('working_hours', 'الأحد - الخميس: 8 صباحاً - 6 مساءً')}<br />
                  {getCompanyValue('working_hours_friday', 'الجمعة: مغلق')}
                </p>
              </div>
            </div>
            <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463877.31244093843!2d46.93246736569614!3d24.725455364177265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1714152542566!5m2!1sen!2s"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="موقع الرياض"
              ></iframe>
            </div>
          </motion.div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-10 sm:p-12 shadow-[0_20px_60px_rgb(0,0,0,0.3)] text-[#0F172A] border border-gray-100"
            >
              <h4 className="text-3xl font-extrabold text-[#0F172A] mb-8">أرسل لنا رسالة</h4>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                {status === 'success' && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-sm border border-green-200">
                    تم إرسال طلبك بنجاح! سنتواصل معك قريباً.
                  </div>
                )}
                {status === 'error' && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-sm border border-red-200">
                    حدث خطأ أثناء الإرسال. الرجاء المحاولة مرة أخرى.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">الاسم الكريم</label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/10 transition-all bg-gray-50 outline-none rounded-xl"
                      placeholder="أحمد محمد"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">رقم الجوال</label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      dir="ltr"
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/10 transition-all bg-gray-50 outline-none rounded-xl text-right"
                      placeholder="+966 5X XXX XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-bold text-gray-700 mb-2">نوع الخدمة المطلوبة</label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/10 transition-all bg-gray-50 outline-none rounded-xl appearance-none"
                  >
                    <option value="">اختر الخدمة...</option>
                    <option value="facade">واجهات زجاجية</option>
                    <option value="partition">قواطع مكتبية</option>
                    <option value="doors">أبواب ونوافذ</option>
                    <option value="shower">كبائن شاور</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">تفاصيل الطلب</label>
                  <textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/10 transition-all bg-gray-50 outline-none rounded-xl resize-none"
                    placeholder="اكتب تفاصيل مشروعك أو استفسارك هنا..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-[#0284C7] text-white font-bold py-4 hover:bg-[#0369A1] transition-colors shadow-none rounded-none disabled:bg-gray-400"
                >
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
