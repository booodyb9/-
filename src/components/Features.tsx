import { useMemo } from 'react';
import { Shield, Clock, Wrench, ThumbsUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useContent } from '../contexts/ContentContext';

const defaultFeatures = [
  {
    icon: 'Shield',
    title: 'جودة لا تضاهى',
    description: 'نستخدم أفضل أنواع الزجاج (السيكوريت والمزدوج) المطابق للمواصفات السعودية والعالمية.'
  },
  {
    icon: 'Clock',
    title: 'التزام بالمواعيد',
    description: 'نقدر وقت عملائنا، لذا نحرص على تسليم المشاريع في الوقت المتفق عليه دون تأخير.'
  },
  {
    icon: 'Wrench',
    title: 'فريق محترف',
    description: 'لدينا طاقم من المهندسين والفنيين ذوي الخبرة الطويلة في مجال تركيب الزجاج.'
  },
  {
    icon: 'ThumbsUp',
    title: 'أسعار تنافسية',
    description: 'نقدم أفضل الأسعار في سوق الرياض مع الحفاظ على أعلى معايير الجودة والضمان.'
  }
];

const renderIcon = (iconName: string | undefined, index: number) => {
  const props = { className: "h-6 w-6" };
  const fallbackIcons = [
    <Shield {...props} />,
    <Clock {...props} />,
    <Wrench {...props} />,
    <ThumbsUp {...props} />,
  ];
  
  if (!iconName) return fallbackIcons[index % fallbackIcons.length];
  
  switch (iconName) {
    case 'Shield': return <Shield {...props} />;
    case 'Clock': return <Clock {...props} />;
    case 'Wrench': return <Wrench {...props} />;
    case 'ThumbsUp': return <ThumbsUp {...props} />;
    default: return fallbackIcons[index % fallbackIcons.length];
  }
};

export default function Features() {
  const { getContent } = useContent();

  const introContent = getContent('features_intro');
  const itemsContent = getContent('features_items');

  const features = useMemo(() => {
    if (itemsContent?.body) {
      try {
        const parsed = JSON.parse(itemsContent.body);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse features items", e);
      }
    }
    return defaultFeatures;
  }, [itemsContent]);

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-blue-50 opacity-50 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-blue-50 opacity-50 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-[#0284C7] text-sm font-bold tracking-widest uppercase mb-3">لماذا تختارنا؟</h2>
              <h3 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-6">
                شريكك الموثوق لأعمال الزجاج في العاصمة
              </h3>
              
              {introContent?.body ? (
                <div className="prose prose-lg text-gray-600 mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: introContent.body }} />
              ) : (
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  في روائع الزجاج، لا نكتفي بتركيب الزجاج فحسب، بل نصنع واجهات تعكس هوية مشروعك. نجمع بين الحرفية العالية والتكنولوجيا الحديثة لنقدم لك نتائج تفوق التوقعات.
                </p>
              )}

              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
                }}
              >
                {features.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="flex gap-4"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                    }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 bg-[#0284C7]/10 text-[#0284C7] rounded-sm flex items-center justify-center">
                        {renderIcon(feature.icon, index)}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#0F172A] mb-2">{feature.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden shadow-2xl relative border-l-8 border-[#0284C7]">
                <img
                  src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop"
                  alt="Modern office interior with glass partitions"
                  className="w-full h-full object-cover"
                />
                
                {/* Stats overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#111827] p-8 flex justify-between items-center shadow-2xl border-t border-gray-800">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#0284C7] mb-1">+500</p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">مشروع منجز</p>
                  </div>
                  <div className="w-px h-12 bg-gray-700"></div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#0284C7] mb-1">15</p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">سنة خبرة</p>
                  </div>
                  <div className="w-px h-12 bg-gray-700"></div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#0284C7] mb-1">%100</p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">رضا العملاء</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
