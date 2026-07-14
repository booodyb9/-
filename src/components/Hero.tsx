import { useMemo } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContent } from '../contexts/ContentContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

const defaultHeroImages = [
  { url: '/images/hero-1.jpg', alt: 'تركيب واجهات زجاجية حديثة في الرياض' },
  { url: '/images/hero-2.jpg', alt: 'قواطع زجاجية للمكاتب والشركات' },
  { url: '/images/hero-3.jpg', alt: 'كبائن شاور زجاجية عصرية' },
  { url: '/images/hero-4.jpg', alt: 'درابزين زجاجي للسلالم بأعلى معايير الأمان' }
];

export default function Hero() {
  const { language } = useLanguage();
  const { getContent } = useContent();
  const heroContent = getContent('hero_content');
  const heroImagesContent = getContent('hero_images');

  const heroImages = useMemo(() => {
    if (heroImagesContent?.body) {
      try {
        const parsed = JSON.parse(heroImagesContent.body);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse hero images", e);
      }
    }
    return defaultHeroImages;
  }, [heroImagesContent]);

  return (
    <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden min-h-[90vh] flex items-center bg-[#F9FAFB]">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="w-full h-full"
        >
          {heroImages.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover grayscale opacity-30"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute inset-0 bg-gradient-to-l from-[#F9FAFB]/95 via-[#F9FAFB]/80 to-transparent md:from-[#F9FAFB] md:via-[#F9FAFB]/90 md:to-transparent ltr:bg-gradient-to-r z-10 pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#0284C7] text-xs font-bold uppercase tracking-tighter mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-sm bg-[#0284C7] opacity-75"></span>
                  <span className="relative inline-flex rounded-sm h-2.5 w-2.5 bg-[#0284C7]"></span>
                </span>
                {language === 'ar' ? 'الشركة الرائدة في الرياض' : 'Leading Company in Riyadh'}
              </div>
            </motion.div>
            
            {heroContent?.body ? (
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                className="prose prose-lg prose-h1:text-4xl prose-h1:md:text-7xl prose-h1:font-extrabold prose-h1:text-[#0F172A] prose-h1:leading-[1.1] prose-h1:mb-6 prose-p:text-lg prose-p:md:text-xl prose-p:text-gray-600 prose-p:mb-8 prose-p:leading-relaxed prose-p:max-w-2xl" 
                dangerouslySetInnerHTML={{ __html: heroContent.body }} 
              />
            ) : (
              <>
                <motion.h1 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="text-4xl md:text-7xl font-extrabold text-[#0F172A] leading-[1.1] mb-6">
                  {language === 'ar' ? (
                    <>نصمم وننفذ أرقى أعمال <span className="text-[#0284C7]">الزجاج الحديث</span></>
                  ) : (
                    <>Design & Build Premium <span className="text-[#0284C7]">Modern Glass</span></>
                  )}
                </motion.h1>
                
                <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                  {language === 'ar' 
                    ? 'نقدم حلولاً مبتكرة وعصرية لتركيب الزجاج للمشاريع التجارية والسكنية في جميع أنحاء الرياض. جودة عالية، دقة في التنفيذ، وأسعار تنافسية.'
                    : 'We provide innovative and modern glass installation solutions for commercial and residential projects across Riyadh. High quality, precise execution, and competitive prices.'
                  }
                </motion.p>
              </>
            )}

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="flex flex-col sm:flex-row gap-4">
              <a
                href={`https://wa.me/966510233706?text=${encodeURIComponent('مرحباً، أود الحصول على تسعيرة لخدمات تركيب الزجاج.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-8 py-4 font-bold text-lg hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 group"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                {language === 'ar' ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
              </a>
              <a
                href="#services"
                className="bg-transparent text-[#111827] border-2 border-[#111827] px-8 py-4 font-bold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                {language === 'ar' ? 'استكشف خدماتنا' : 'Explore Services'}
              </a>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="mt-12 flex flex-wrap gap-6 items-center text-sm font-bold text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#0284C7]" />
                <span>{language === 'ar' ? 'ضمان يصل لـ 10 سنوات' : 'Up to 10 Years Warranty'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#0284C7]" />
                <span>{language === 'ar' ? 'تنفيذ سريع واحترافي' : 'Fast & Professional Execution'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#0284C7]" />
                <span>{language === 'ar' ? 'معاينة مجانية للموقع' : 'Free Site Inspection'}</span>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
