import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export default function AmbientBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#F9FAFB]">
      {/* Floating Light Particles / Soft blur effects */}
      <motion.div
        animate={{
          x: mousePosition.x * 2,
          y: mousePosition.y * 2,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#0284C7]/10 blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-300/10 blur-[120px]" 
        />
      </motion.div>
      
      {/* Glass Reflections / Subtle glass highlights */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.2)_100%)] mix-blend-overlay"></div>
    </div>
  );
}
