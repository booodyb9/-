import re

with open('src/pages/public/RequestQuote.tsx', 'r') as f:
    content = f.read()

# Add imports
if 'supabase' not in content:
    content = content.replace(
        "import React from 'react';",
        "import React, { useState } from 'react';\nimport { supabase } from '../../lib/supabase';"
    )

new_form = """
export default function RequestQuote() {
  const [formData, setFormData] = useState({ name: '', phone: '', service: '', details: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const { error } = await supabase.from('messages').insert([{
        name: formData.name,
        email: formData.phone,
        message: `[طلب عرض سعر: ${formData.service}]\n${formData.details}`,
        is_read: false
      }]);
      if (error) throw error;
      
      setStatus('success');
      setFormData({ name: '', phone: '', service: '', details: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
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
              <p className="text-gray-600 text-lg">نحن هنا لخدمتك. يرجى تعبئة النموذج أدناه وسنقوم بالتواصل معك في أقرب وقت لتقديم التسعيرة المناسبة.</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {status === 'success' && (
                <div className="bg-green-50 text-green-700 p-4 rounded-sm border border-green-200">
                  تم إرسال طلبك بنجاح! سيقوم فريقنا بالتواصل معك قريباً.
                </div>
              )}
              {status === 'error' && (
                <div className="bg-red-50 text-red-700 p-4 rounded-sm border border-red-200">
                  حدث خطأ أثناء الإرسال. الرجاء المحاولة مرة أخرى أو الاتصال بنا مباشرة.
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكريم</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-colors" placeholder="الاسم" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">رقم الجوال</label>
                  <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-colors text-right" placeholder="05XXXXXXXX" dir="ltr" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الخدمة المطلوبة</label>
                <select required value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-colors appearance-none bg-white">
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
                <label className="block text-sm font-bold text-gray-700 mb-2">تفاصيل الطلب (اختياري)</label>
                <textarea value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-colors" placeholder="اكتب أي تفاصيل إضافية عن مساحة العمل أو متطلبات خاصة..."></textarea>
              </div>
              
              <button disabled={status === 'submitting'} type="submit" className="w-full bg-[#0F172A] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#0284C7] transition-colors shadow-lg hover:shadow-[#0284C7]/20 disabled:opacity-50">
                {status === 'submitting' ? 'جاري الإرسال...' : 'إرسال طلب عرض السعر'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
"""

content = re.sub(
    r"export default function RequestQuote\(\) \{.*?\}\);\}",
    new_form.strip(),
    content, flags=re.DOTALL
)
# I need to match properly if the original file ended there, but since there could be trailing newlines, I will do a replace.

with open('src/pages/public/RequestQuote.tsx', 'w') as f:
    f.write(content)
