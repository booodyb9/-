import { useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ChevronLeft, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContent } from '../contexts/ContentContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Keyboard, Parallax } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

const defaultHeroImages = [
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', alt: 'واجهات زجاجية حديثة' },
  { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', alt: 'قواطع زجاجية' }
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
        const filtered = parsed.filter((img: any) => img.url && typeof img.url === 'string' && img.url.trim() !== '');
        if (filtered.length > 0) return filtered;
      } catch (e) {}
    }
    return defaultHeroImages;
  }, [heroImagesContent]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Keyboard, Parallax]}
          effect="fade"
          speed={1500}
          parallax={true}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          keyboard={{ enabled: true }}
          navigation={{ nextEl: '.swiper-button-next-custom', prevEl: '.swiper-button-prev-custom' }}
          className="w-full h-full group"
        >
          {heroImages.map((img: any, index: number) => (
            <SwiperSlide key={index} className="overflow-hidden bg-black">
              <div className="w-full h-full" data-swiper-parallax="20%" data-swiper-parallax-scale="1.05">
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover opacity-50 transform transition-transform duration-[15000ms] ease-linear hover:scale-110"
                />
              </div>
            </SwiperSlide>
          ))}
          
          <div className="absolute inset-y-0 right-0 z-50 flex items-center pr-4 md:pr-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <button className="swiper-button-next-custom bg-black/20 hover:bg-black/40 border border-white/10 backdrop-blur-md p-4 rounded-full text-white transition-all transform hover:scale-105 active:scale-95">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute inset-y-0 left-0 z-50 flex items-center pl-4 md:pl-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <button className="swiper-button-prev-custom bg-black/20 hover:bg-black/40 border border-white/10 backdrop-blur-md p-4 rounded-full text-white transition-all transform hover:scale-105 active:scale-95">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </Swiper>
        
        {/* Architectural Gradients & Noise */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none rtl:bg-gradient-to-l"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full pt-20">
        <div className="max-w-3xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-8 inline-block">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0284C7] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0284C7]"></span>
                </span>
                <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">
                  {language === 'ar' ? 'الشركة الرائدة في الرياض' : 'Leading Company in Riyadh'}
                </span>
              </div>
            </motion.div>
            
            {heroContent?.body ? (
              <motion.div 
                variants={itemVariants}
                className="prose prose-invert prose-lg prose-h1:text-5xl prose-h1:md:text-7xl prose-h1:font-bold prose-h1:text-white prose-h1:leading-[1.1] prose-h1:mb-6 prose-p:text-lg prose-p:md:text-xl prose-p:text-gray-300 prose-p:mb-10 prose-p:leading-relaxed prose-p:max-w-2xl" 
                dangerouslySetInnerHTML={{ __html: heroContent.body }} 
              />
            ) : (
              <>
                <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-[5rem] font-bold text-white leading-[1.05] tracking-tight mb-8">
                  {language === 'ar' ? (
                    <>أرقى أعمال <br/><span className="text-[#0284C7] italic pr-2">الزجاج الحديث</span></>
                  ) : (
                    <>Premium <br/><span className="text-[#0284C7] italic">Modern Glass</span></>
                  )}
                </motion.h1>
                
                <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl font-light">
                  {language === 'ar' 
                    ? 'نقدم حلولاً مبتكرة وعصرية لتركيب الزجاج للمشاريع التجارية والسكنية في جميع أنحاء الرياض. جودة عالية، دقة في التنفيذ، وتصاميم هندسية متطورة.'
                    : 'We provide innovative and modern glass installation solutions for commercial and residential projects across Riyadh. High quality, precise execution, and advanced architectural designs.'
                  }
                </motion.p>
              </>
            )}

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5">
              <a
                href="#services"
                className="group relative flex items-center justify-center gap-3 bg-white text-black px-8 py-4 font-semibold text-base overflow-hidden rounded-none hover:text-white transition-colors duration-300"
              >
                <div className="absolute inset-0 bg-black translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                <span className="relative z-10">{language === 'ar' ? 'استكشف مشاريعنا' : 'Explore Projects'}</span>
                {language === 'ar' ? <ArrowLeft className="w-4 h-4 relative z-10 group-hover:-translate-x-1 transition-transform" /> : <ArrowUpRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />}
              </a>
              <a
                href={`https://wa.me/966510233706?text=${encodeURIComponent('مرحباً، أود الحصول على تسعيرة.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 bg-white/5 border border-white/20 backdrop-blur-md text-white px-8 py-4 font-semibold text-base hover:bg-white/10 transition-colors duration-300"
              >
                {language === 'ar' ? 'طلب تسعيرة' : 'Request Quote'}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative Bottom Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20"></div>
    </div>
  );
}
