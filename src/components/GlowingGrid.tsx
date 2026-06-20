import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';

export default function GlowingGrid() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Add a spring for a smooth trailing cursor effect
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Framer motion template to dynamically update the radial gradient position
  const background = useMotionTemplate`radial-gradient(600px circle at ${smoothX}px ${smoothY}px, rgba(99, 102, 241, 0.15), transparent 80%)`;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#FAF9F6] dark:bg-[#0A0A0A] transition-colors duration-500">
      {/* Static Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-50 dark:opacity-30" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Dynamic Cursor Glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background }}
      />
      
      {/* Subtle Static Edge Glows for ambiance */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
    </div>
  );
}
