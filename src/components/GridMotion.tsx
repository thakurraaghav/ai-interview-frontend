import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function GridMotion() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      backgroundPositionY: ["0px", "60px"],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear"
      }
    });
  }, [controls]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#FAF9F6] dark:bg-[#050505] transition-colors duration-500 flex items-end justify-center">
      
      {/* 3D Perspective Container */}
      <div 
        className="absolute inset-0 w-full h-full" 
        style={{ perspective: "600px" }}
      >
        {/* Animated Moving Grid Surface */}
        <motion.div 
          className="absolute w-[200vw] h-[150vh] left-[-50vw] top-[10vh] opacity-40 dark:opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(99, 102, 241, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(99, 102, 241, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transformOrigin: 'top center',
            rotateX: 70,
          }}
          animate={controls}
        />
      </div>

      {/* Horizon Fade (Gradient Vignette) - Masks the top and bottom to create depth */}
      <div className="absolute inset-0 bg-linear-to-b from-[#FAF9F6] via-transparent to-[#FAF9F6] dark:from-[#050505] dark:via-transparent dark:to-[#050505] opacity-90 pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-r from-[#FAF9F6] via-transparent to-[#FAF9F6] dark:from-[#050505] dark:via-transparent dark:to-[#050505] opacity-60 pointer-events-none" />
      
      {/* Subtle Glow at the Center Horizon */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[60%] h-[30%] bg-indigo-500/10 blur-[120px] pointer-events-none" />
    </div>
  );
}
