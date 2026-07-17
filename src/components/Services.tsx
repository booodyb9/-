import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Home, Building, Maximize, Droplets, LayoutGrid, Store } from 'lucide-react';
import CostCalculator from './CostCalculator';
import { useContent } from '../contexts/ContentContext';

const defaultServices = [
  {
    icon: 'Building',
    title: 'واجهات زجاجية واستركشر',
    description: 'تركيب واجهات زجاجية (كرتن وول) واستركشر للمباني التجارية والمحلات، بتصاميم عصرية مقاومة للعوامل الجوية وتوفر عزلاً حرارياً وصوتياً ممتازاً.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    icon: 'LayoutGrid',
    title: 'قواطع زجاجية مكتبية',
    description: 'تقسيم مساحات العمل والمكاتب بقواطع زجاجية سيكوريت عازلة للصوت، تمنح المكان اتساعاً ورؤية واضحة وتزيد من إنتاجية بيئة العمل.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    icon: 'Home',
    title: 'درابزين زجاجي للسلالم',
    description: 'تفصيل وتركيب درابزين زجاجي فاخر للسلالم والبلكونات، يجمع بين متانة الزجاج السيكوريت والتصميم الأنيق لإضافة لمسة فخامة للمكان.',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    icon: 'Droplets',
    title: 'كبائن شاور',
    description: 'تصميم وتركيب كبائن الاستحمام الزجاجية (الشاور) بأجود أنواع الزجاج السيكوريت المقاوم للكسر، مع إكسسوارات مقاومة للصدأ تدوم طويلاً.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    icon: 'Maximize',
    title: 'مرايا ديكورية وذكية',
    description: 'تفصيل مرايا ديكورية حديثة ومرايا ليد (LED) ذكية مضيئة للحمامات والصالات الرياضية والمداخل، بأبعاد وتصاميم هندسية دقيقة.',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    icon: 'Store',
    title: 'واجهات وأبواب سيكوريت',
    description: 'تنفيذ وتركيب أبواب سيكوريت مفصلية وسحابة أوتوماتيكية للفلل والمولات التجارية، تمتاز بالقوة والمتانة وسهولة الاستخدام.',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

const renderIcon = (iconName: string) => {
  const props = { className: "h-8 w-8" };
  switch (iconName) {
    case 'Building': return <Building {...props} />;
    case 'LayoutGrid': return <LayoutGrid {...props} />;
    case 'Home': return <Home {...props} />;
    case 'Droplets': return <Droplets {...props} />;
    case 'Maximize': return <Maximize {...props} />;
    case 'Store': return <Store {...props} />;
    default: return <Building {...props} />;
  }
};

export default function Services() {
  const phoneNumber = "966510233706";
  const { getContent } = useContent();

  const introContent = getContent('services_intro');
  const itemsContent = getContent('services_items');

  const services = useMemo(() => {
    if (itemsContent?.body) {
      try {
        const parsed = JSON.parse(itemsContent.body);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse services items", e);
      }
    }
    return defaultServices;
  }, [itemsContent]);

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-[#0284C7] text-sm font-bold uppercase tracking-widest mb-3">خدماتنا</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-6">
            حلول زجاجية متكاملة لكل احتياجاتك
          </h3>
          
          {introContent?.body ? (
            <div className="prose prose-lg mx-auto text-gray-600 mb-8" dangerouslySetInnerHTML={{ __html: introContent.body }} />
          ) : (
            <p className="text-lg text-gray-600 mb-8">
              نقدم مجموعة واسعة من خدمات تركيب الزجاج باستخدام أفضل الخامات العالمية وبأيدي فنيين محترفين.
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300 group border border-gray-200 flex flex-col"
            >
              <div className="h-48 overflow-hidden relative shrink-0">
                {service.image && typeof service.image === 'string' && service.image.trim() !== '' && (
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="w-14 h-14 bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center mb-6 group-hover:bg-[#0284C7] group-hover:text-white transition-colors duration-300 rounded-sm shrink-0">
                  {renderIcon(service.icon)}
                </div>
                <h4 className="text-xl font-bold text-[#0F172A] mb-3">{service.title}</h4>
                <p className="text-gray-600 leading-relaxed flex-grow mb-6">
                  {service.description}
                </p>
                
                <a
                  href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(`مرحباً، أود الاستفسار عن خدمة ${service.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-2 w-full border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white px-4 py-3 text-sm font-bold rounded-sm transition-colors group/btn"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  طلب الخدمة عبر واتساب
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <CostCalculator />
      </div>
    </section>
  );
}
