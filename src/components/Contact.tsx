import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-[#111827] text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-[#0284C7] text-sm font-bold tracking-widest uppercase mb-3">تواصل معنا</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold mb-6">
            مستعدون لتنفيذ مشروعك القادم
          </h3>
          <p className="text-lg text-gray-400">
            احصل على استشارة مجانية وعرض سعر مبدئي لمشروعك. فريقنا متواجد للرد على جميع استفساراتك.
          </p>
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
              <div className="w-12 h-12 bg-white/5 text-[#0284C7] rounded-sm flex items-center justify-center shrink-0">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">موقعنا</h4>
                <p className="text-gray-400 leading-relaxed">
                  طريق الملك فهد، حي العليا<br />
                  الرياض، المملكة العربية السعودية
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 text-[#0284C7] rounded-sm flex items-center justify-center shrink-0">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">اتصل بنا</h4>
                <p className="text-gray-400 leading-relaxed" dir="ltr">
                  +966 51 023 3706<br />
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 text-[#0284C7] rounded-sm flex items-center justify-center shrink-0">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">البريد الإلكتروني</h4>
                <p className="text-gray-400 leading-relaxed">
                  info@glassvision-ksa.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 text-[#0284C7] rounded-sm flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">ساعات العمل</h4>
                <p className="text-gray-400 leading-relaxed">
                  الأحد - الخميس: 8 صباحاً - 6 مساءً<br />
                  الجمعة: مغلق
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 shadow-2xl text-gray-900 border border-gray-200"
            >
              <h4 className="text-3xl font-extrabold text-[#0F172A] mb-8">أرسل لنا رسالة</h4>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">الاسم الكريم</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#0284C7] transition-colors bg-[#F9FAFB] outline-none rounded-none"
                      placeholder="أحمد محمد"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">رقم الجوال</label>
                    <input
                      type="tel"
                      id="phone"
                      dir="ltr"
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#0284C7] transition-colors bg-[#F9FAFB] outline-none rounded-none text-right"
                      placeholder="+966 5X XXX XXXX"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="service" className="block text-sm font-bold text-gray-700 mb-2">نوع الخدمة المطلوبة</label>
                  <select
                    id="service"
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#0284C7] transition-colors bg-[#F9FAFB] outline-none rounded-none appearance-none"
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
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#0284C7] transition-colors bg-[#F9FAFB] outline-none rounded-none resize-none"
                    placeholder="اكتب تفاصيل مشروعك أو استفسارك هنا..."
                  ></textarea>
                </div>
                <button
                  type="button"
                  onClick={() => alert('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.')}
                  className="w-full bg-[#0284C7] text-white font-bold py-4 hover:bg-[#0369A1] transition-colors shadow-none rounded-none"
                >
                  إرسال الطلب
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
