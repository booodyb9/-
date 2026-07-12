import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, ArrowRight, ArrowLeft } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    categoryAr: 'دليل تقني',
    categoryEn: 'Technical Guide',
    titleAr: 'دليلك الشامل لاختيار الزجاج المناسب لكبائن الشاور',
    titleEn: 'Your Comprehensive Guide to Choosing the Right Glass for Shower Cabins',
    excerptAr: 'تعرف على الفرق بين زجاج السيكوريت والزجاج العادي، وأهمية السماكة المناسبة لضمان الأمان والاناقة في حمامك.',
    excerptEn: 'Learn the difference between tempered and regular glass, and the importance of appropriate thickness for safety and elegance in your bathroom.',
    date: '2024-05-15',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    categoryAr: 'اتجاهات الصناعة',
    categoryEn: 'Industry Trends',
    titleAr: 'مستقبل الواجهات الزجاجية الذكية في المعمار الحديث',
    titleEn: 'The Future of Smart Glass Facades in Modern Architecture',
    excerptAr: 'كيف تساهم التقنيات الحديثة في صناعة زجاج يتحكم بالحرارة والضوء لتقليل استهلاك الطاقة في المباني الكبرى.',
    excerptEn: 'How modern technologies contribute to making glass that controls heat and light to reduce energy consumption in large buildings.',
    date: '2024-05-10',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    categoryAr: 'دراسة حالة',
    categoryEn: 'Case Study',
    titleAr: 'تحويل مساحة مكتبية مغلقة إلى بيئة عمل مفتوحة ومشرقة',
    titleEn: 'Transforming a Closed Office Space into a Bright, Open Environment',
    excerptAr: 'نستعرض كيف ساهمت قواطع الزجاج المزدوجة في تحسين الإضاءة الطبيعية والإنتاجية في مقر شركة تقنية بالرياض.',
    excerptEn: 'We review how double-glazed partitions improved natural lighting and productivity at a tech company headquarters in Riyadh.',
    date: '2024-05-02',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  }
];

export default function Blog() {
  const { language } = useLanguage();

  return (
    <section id="blog" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-[#0284C7] text-sm font-bold tracking-widest uppercase mb-3">
            {language === 'ar' ? 'المدونة والمعرفة' : 'Knowledge Blog'}
          </h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-4">
            {language === 'ar' ? 'أحدث المقالات والنصائح' : 'Latest Articles & Tips'}
          </h3>
          <p className="text-gray-600 leading-relaxed text-lg">
            {language === 'ar'
              ? 'اكتشف أحدث اتجاهات صناعة الزجاج، واقرأ أدلة تقنية تساعدك في اتخاذ قرارات أفضل لمشروعك.'
              : 'Discover the latest glass industry trends, and read technical guides to help you make better decisions for your project.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={language === 'ar' ? post.titleAr : post.titleEn}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 ltr:left-4 ltr:right-auto bg-[#0284C7] text-white text-xs font-bold px-3 py-1 rounded-sm">
                  {language === 'ar' ? post.categoryAr : post.categoryEn}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <Calendar className="h-4 w-4 ml-2 ltr:mr-2" />
                  <time dateTime={post.date}>{new Date(post.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                </div>
                <h4 className="text-xl font-bold text-[#0F172A] mb-3 line-clamp-2 hover:text-[#0284C7] transition-colors cursor-pointer">
                  {language === 'ar' ? post.titleAr : post.titleEn}
                </h4>
                <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                  {language === 'ar' ? post.excerptAr : post.excerptEn}
                </p>
                <div className="mt-auto">
                  <button className="flex items-center text-[#0284C7] font-bold group-hover:text-[#0369A1] transition-colors">
                    {language === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                    {language === 'ar' ? (
                      <ArrowLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
