import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

const defaultTestimonials = [
  {
    name: 'مؤسسة أبعاد التطوير',
    role: 'مشروع واجهات تجارية',
    content: 'تعاملنا مع شركة زجاج الرياض في تنفيذ واجهات مشروعنا التجاري. احترافية عالية في العمل، التزام دقيق بالمواعيد، وجودة تنفيذ تفوق التوقعات.',
    rating: 5,
  },
  {
    name: 'عبدالله السالم',
    role: 'فيلا سكنية - الملقا',
    content: 'قمت بتركيب نوافذ وكبائن شاور للفيلا. الشغل جداً نظيف ومرتب، والفريق متعاون جداً في تقديم الاستشارات والتعديلات المطلوبة. أنصح بالتعامل معهم.',
    rating: 5,
  },
  {
    name: 'شركة رؤية المستقبل',
    role: 'قواطع مكتبية',
    content: 'احترافية في التعامل وسرعة في الإنجاز. تم تركيب القواطع الزجاجية لمكاتبنا في وقت قياسي وبجودة عالية جداً تعكس صورة احترافية للشركة.',
    rating: 5,
  }
];

export default function Testimonials() {
  const { getContent } = useContent();
  const itemsContent = getContent('testimonials_items');

  const testimonials = useMemo(() => {
    if (itemsContent?.body) {
      try {
        const parsed = JSON.parse(itemsContent.body);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse testimonials items", e);
      }
    }
    return defaultTestimonials;
  }, [itemsContent]);

  return (
    <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-[#0284C7] text-sm font-bold tracking-widest uppercase mb-3">آراء العملاء</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] leading-tight">
            ماذا يقول عملاؤنا
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#F9FAFB] p-8 border border-gray-200 relative flex flex-col"
            >
              <Quote className="absolute top-6 left-6 h-12 w-12 text-gray-200" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(Number(testimonial.rating) || 5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#0284C7] text-[#0284C7]" />
                ))}
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-8 relative z-10 font-medium">
                "{testimonial.content}"
              </p>
              
              <div className="border-t border-gray-200 pt-6 mt-auto">
                <h4 className="font-bold text-[#0F172A]">{testimonial.name}</h4>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
