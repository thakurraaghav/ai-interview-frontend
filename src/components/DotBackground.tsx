import { useEffect, useRef } from 'react';

interface Props {
  isDark: boolean;
}

export default function DotBackground({ isDark }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const dots: { x: number; y: number; baseX: number; baseY: number; size: number }[] = [];
    const spacing = 35; // Space between dots
    
    const initDots = () => {
      dots.length = 0;
      // Overshoot screen slightly so dots don't pop in at edges
      for (let x = -spacing; x < width + spacing; x += spacing) {
        for (let y = -spacing; y < height + spacing; y += spacing) {
          dots.push({ x, y, baseX: x, baseY: y, size: 1.5 });
        }
      }
    };
    initDots();

    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initDots();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Much more visible dots in dark mode (white/40%) vs light mode (indigo/60%)
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(99, 102, 241, 0.6)';

      const mouseRadius = 180; // Anti-gravity influence radius

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Anti-gravity repelling force
        if (distance < mouseRadius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          // The closer the mouse, the stronger the force
          const force = (mouseRadius - distance) / mouseRadius;
          
          const maxPush = 12; // Max speed at which dots run away
          dot.x -= forceDirectionX * force * maxPush;
          dot.y -= forceDirectionY * force * maxPush;
        }

        // Spring tension to snap back to original position
        dot.x += (dot.baseX - dot.x) * 0.08;
        dot.y += (dot.baseY - dot.y) * 0.08;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#FAF9F6] dark:bg-[#050505] transition-colors duration-500">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 block"
      />
      
      {/* Subtle background glow for extra depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
