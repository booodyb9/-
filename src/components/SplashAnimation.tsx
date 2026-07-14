import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function SplashAnimation() {
  const [show, setShow] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    // We can use sessionStorage so it only shows once per session,
    // but for the sake of the 'wow' factor requested by the user, we'll show it 
    // when they first enter. To not annoy them, we'll keep it relatively short.
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    
    if (hasSeenSplash) {
      setShow(false);
      return;
    }

    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('hasSeenSplash', 'true');
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          exit={{ 
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[100] bg-[#0F172A] flex items-center justify-center overflow-hidden"
        >
          {/* Decorative ambient glass effects */}
          <motion.div 
            initial={{ opacity: 0, rotate: 45, scale: 0.5 }}
            animate={{ opacity: 0.1, rotate: 45, scale: 1.5 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] bg-gradient-to-tr from-white/20 to-transparent backdrop-blur-3xl rounded-3xl"
          />
          <motion.div 
            initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
            animate={{ opacity: 0.05, rotate: -45, scale: 2 }}
            transition={{ duration: 2.5, ease: "easeOut", delay: 0.2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vh] h-[80vh] bg-gradient-to-bl from-[#0284C7]/30 to-transparent backdrop-blur-xl rounded-full"
          />

          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Logo Text Reveal */}
            <div className="overflow-hidden pb-4">
              <motion.h1 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
                className="text-5xl md:text-7xl font-extrabold text-white tracking-tight"
              >
                {language === 'ar' ? 'شركة زجاج الرياض' : 'Riyadh Glass Company'}
              </motion.h1>
            </div>
            
            {/* Subtitle / Line Reveal */}
            <div className="flex items-center gap-4 mt-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "3rem", opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="h-[2px] bg-[#0284C7]"
              />
              <motion.p 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1 }}
                className="text-[#0284C7] text-xl md:text-2xl font-medium tracking-wide uppercase"
              >
                {language === 'ar' ? 'أرقى أعمال الزجاج' : 'Premium Glass'}
              </motion.p>
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "3rem", opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="h-[2px] bg-[#0284C7]"
              />
            </div>

            {/* Shimmer loading effect */}
            <motion.div 
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.4, ease: "easeInOut" }}
              className="w-48 h-[1px] bg-white/20 mt-12 relative overflow-hidden"
            >
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1, delay: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
