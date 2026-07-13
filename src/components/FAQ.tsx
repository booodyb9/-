import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

const defaultFaqs = [
  {
    question: 'ما هي أنواع الزجاج المستخدمة في الواجهات؟',
    answer: 'نستخدم بشكل أساسي زجاج السيكوريت (المقسى) لمتانته العالية ومقاومته للكسر، والزجاج المزدوج (Double Glass) لعزله الممتاز للحرارة والصوت. يتم اختيار النوع بناءً على متطلبات المشروع والمواصفات الهندسية.'
  },
  {
    question: 'كم تستغرق عملية التركيب؟',
    answer: 'تعتمد مدة التركيب على حجم المشروع وتفاصيله. المشاريع الصغيرة مثل كبائن الشاور قد تستغرق يوماً واحداً بعد التصنيع، بينما المشاريع التجارية والواجهات قد تستغرق من عدة أيام إلى أسابيع. نقوم بتحديد جدول زمني دقيق بعد المعاينة وأخذ المقاسات.'
  },
  {
    question: 'كيف يمكنني الحفاظ على نظافة ولمعان الزجاج؟',
    answer: 'ينصح بتنظيف الزجاج بانتظام باستخدام منظفات الزجاج المخصصة وقطعة قماش ناعمة (مايكروفايبر). تجنب استخدام المواد الكاشطة أو الأدوات الحادة التي قد تخدش السطح لتجنب تلفه.'
  },
  {
    question: 'هل تقدمون ضماناً على أعمالكم؟',
    answer: 'نعم، نقدم ضماناً شاملاً يصل إلى 10 سنوات على جودة الزجاج المستخدم، وضماناً على جودة التركيب والإكسسوارات المستخدمة لضمان راحة بال عملائنا واستدامة المشروع.'
  },
  {
    question: 'هل توفرون خدمة الصيانة الدورية؟',
    answer: 'نعم، لدينا فريق متخصص لخدمات الصيانة الدورية والإصلاحات الطارئة لجميع أنواع الواجهات والأبواب الزجاجية، سواء للمشاريع التي قمنا بتنفيذها أو للمشاريع الأخرى.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { getContent } = useContent();
  const itemsContent = getContent('faq_items');

  const faqs = useMemo(() => {
    if (itemsContent?.body) {
      try {
        const parsed = JSON.parse(itemsContent.body);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse FAQ items", e);
      }
    }
    return defaultFaqs;
  }, [itemsContent]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-[#0284C7] text-sm font-bold tracking-widest uppercase mb-3">الأسئلة الشائعة</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] leading-tight">
            إجابات لاستفساراتكم
          </h3>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white border-2 border-gray-200 hover:border-[#0284C7] transition-colors duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-right focus:outline-none"
              >
                <span className="font-bold text-lg text-[#0F172A]">{faq.question}</span>
                <ChevronDown 
                  className={`h-5 w-5 text-[#0284C7] transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
