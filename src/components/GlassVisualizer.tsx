import { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

const glassStyles = [
  {
    id: 'clear',
    nameAr: 'شفاف',
    nameEn: 'Clear',
    style: {
      backdropFilter: 'blur(0px) brightness(1)',
      backgroundColor: 'rgba(255, 255, 255, 0)',
      boxShadow: 'inset 0 0 0px rgba(255,255,255,0)',
      backgroundImage: 'none'
    }
  },
  {
    id: 'frosted',
    nameAr: 'مثلج (ساندبلاست)',
    nameEn: 'Frosted (Sandblasted)',
    style: {
      backdropFilter: 'blur(12px) brightness(1.1)',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      boxShadow: 'inset 0 0 20px rgba(255,255,255,0.3)',
      backgroundImage: 'none'
    }
  },
  {
    id: 'tinted',
    nameAr: 'ملون (برونزي)',
    nameEn: 'Tinted (Bronze)',
    style: {
      backdropFilter: 'blur(0px) brightness(0.6) sepia(0.5)',
      backgroundColor: 'rgba(92, 64, 51, 0.4)',
      boxShadow: 'inset 0 0 10px rgba(92,64,51,0.2)',
      backgroundImage: 'none'
    }
  },
  {
    id: 'reflective',
    nameAr: 'عاكس (أزرق)',
    nameEn: 'Reflective (Blue)',
    style: {
      backdropFilter: 'blur(0px) brightness(0.85) contrast(1.1)',
      backgroundColor: 'rgba(100, 150, 220, 0.2)',
      backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.2) 100%)',
      boxShadow: 'inset 0 0 15px rgba(255,255,255,0.4)'
    }
  }
];

export default function GlassVisualizer() {
  const [activeStyle, setActiveStyle] = useState(glassStyles[0].id);
  const { language } = useLanguage();

  const currentStyle = glassStyles.find(s => s.id === activeStyle)?.style || glassStyles[0].style;

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-[#0284C7] text-sm font-bold tracking-widest uppercase mb-3">
            {language === 'ar' ? 'المحاكي البصري' : 'Visualizer'}
          </h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] leading-tight">
            {language === 'ar' ? 'اكتشف أنواع الزجاج' : 'Explore Glass Types'}
          </h3>
          <p className="text-gray-600 mt-6 leading-relaxed">
            {language === 'ar' 
              ? 'شاهد الفرق بين أنواع الزجاج المختلفة وكيف تؤثر على الرؤية والإضاءة لتختار ما يناسب مساحتك.'
              : 'See the difference between various glass types and how they affect visibility and lighting to choose what suits your space.'}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          {/* Controls */}
          <div className="w-full lg:w-1/3 flex flex-col gap-3">
            {glassStyles.map(style => (
              <button
                key={style.id}
                onClick={() => setActiveStyle(style.id)}
                className={`p-4 border-2 transition-all flex items-center justify-between font-bold ${
                  activeStyle === style.id 
                    ? 'border-[#0284C7] bg-white text-[#0F172A] shadow-md' 
                    : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <span>{language === 'ar' ? style.nameAr : style.nameEn}</span>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${activeStyle === style.id ? 'border-[#0284C7]' : 'border-gray-400'}`}>
                  {activeStyle === style.id && <div className="w-2 h-2 bg-[#0284C7] rounded-full" />}
                </div>
              </button>
            ))}
          </div>

          {/* Visualizer Frame */}
          <div className="w-full lg:w-2/3 max-w-3xl">
            <div className="relative rounded-sm overflow-hidden shadow-2xl aspect-video bg-gray-200 border-[12px] border-[#0F172A]">
              {/* Background Image (The view outside) */}
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                alt="Room view" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Glass Pane */}
              <div className="absolute inset-0 p-2 sm:p-4 md:p-8">
                <div 
                  className="w-full h-full rounded-sm border border-white/20 transition-all duration-700 ease-in-out relative overflow-hidden"
                  style={{
                    WebkitBackdropFilter: currentStyle.backdropFilter,
                    backdropFilter: currentStyle.backdropFilter,
                    backgroundColor: currentStyle.backgroundColor,
                    boxShadow: currentStyle.boxShadow,
                    backgroundImage: currentStyle.backgroundImage
                  }}
                >
                  {/* Subtle glare effect that moves slightly based on active style */}
                  <div className={`absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 transform -skew-x-12 translate-x-full ${activeStyle === 'reflective' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700 pointer-events-none`}></div>
                </div>
              </div>

              {/* Window Frame Inner Details */}
              <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.6)] pointer-events-none"></div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse"></span>
              {language === 'ar' ? 'صورة تفاعلية للمحاكاة' : 'Interactive Simulation Image'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
