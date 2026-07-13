import { useMemo } from 'react';
import { motion } from 'motion/react';
import { PhoneCall, Ruler, Hammer, Wrench, CheckCircle } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

const defaultSteps = [
  {
    icon: 'PhoneCall',
    title: 'الاستشارة والاتفاق',
    description: 'تواصل معنا لمناقشة متطلبات مشروعك، وسنقدم لك أفضل الحلول والخيارات المناسبة لميزانيتك وتفضيلاتك.',
  },
  {
    icon: 'Ruler',
    title: 'أخذ المقاسات',
    description: 'يقوم فريقنا الفني بزيارة الموقع لأخذ المقاسات الدقيقة والرفع المساحي لضمان دقة التصنيع.',
  },
  {
    icon: 'Hammer',
    title: 'التصنيع والقص',
    description: 'يتم قص وتجهيز الزجاج في مصانعنا بأحدث التقنيات لضمان أعلى معايير الجودة والصلابة.',
  },
  {
    icon: 'Wrench',
    title: 'التركيب',
    description: 'يقوم فريق التركيب المتخصص لدينا بتركيب الزجاج والإكسسوارات باحترافية عالية وفي الوقت المحدد.',
  },
  {
    icon: 'CheckCircle',
    title: 'التسليم والضمان',
    description: 'يتم تنظيف الموقع وتسليم العمل مع تقديم شهادة الضمان الشامل على جودة الزجاج والتركيب.',
  }
];

const renderIcon = (iconName: string | undefined, index: number) => {
  const props = { className: "h-6 w-6" };
  const fallbackIcons = [
    <PhoneCall {...props} />,
    <Ruler {...props} />,
    <Hammer {...props} />,
    <Wrench {...props} />,
    <CheckCircle {...props} />,
  ];
  
  if (!iconName) return fallbackIcons[index % fallbackIcons.length];
  
  switch (iconName) {
    case 'PhoneCall': return <PhoneCall {...props} />;
    case 'Ruler': return <Ruler {...props} />;
    case 'Hammer': return <Hammer {...props} />;
    case 'Wrench': return <Wrench {...props} />;
    case 'CheckCircle': return <CheckCircle {...props} />;
    default: return fallbackIcons[index % fallbackIcons.length];
  }
};

export default function Process() {
  const { getContent } = useContent();
  const itemsContent = getContent('process_items');

  const steps = useMemo(() => {
    if (itemsContent?.body) {
      try {
        const parsed = JSON.parse(itemsContent.body);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse process items", e);
      }
    }
    return defaultSteps;
  }, [itemsContent]);

  return (
    <section id="process" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-[#0284C7] text-sm font-bold tracking-widest uppercase mb-3">آلية العمل</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] leading-tight">
            خطوات التنفيذ
          </h3>
          <p className="text-gray-600 mt-6 leading-relaxed">
            نتبع منهجية عمل واضحة لضمان تسليم مشاريعكم بأعلى جودة وفي الوقت المحدد.
          </p>
        </motion.div>

        <div className="relative mt-12">
          {/* Timeline Line (Desktop only) */}
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gray-100 z-0"></div>
          
          <div className={`grid grid-cols-1 lg:grid-cols-${steps.length} gap-12 lg:gap-8 relative z-10`}>
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-white border-4 border-gray-50 rounded-full flex items-center justify-center text-[#0284C7] shadow-sm mb-6 relative">
                  {renderIcon(step.icon, index)}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#0F172A] text-white text-sm font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {index + 1}
                  </div>
                </div>
                <h4 className="text-xl font-bold text-[#0F172A] mb-3">{step.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed max-w-[250px] mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
