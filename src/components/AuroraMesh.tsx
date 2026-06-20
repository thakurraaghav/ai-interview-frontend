export default function AuroraMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#FAF9F6] dark:bg-[#0A0A0A] transition-colors duration-500">
      
      {/* 
        The core aurora gradients. 
        We use multiple large, blurry orbs that animate slowly.
      */}
      <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-indigo-400/40 dark:bg-indigo-600/30 blur-[120px] rounded-full animate-aurora-1 mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-400/40 dark:bg-purple-600/30 blur-[120px] rounded-full animate-aurora-2 mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] bg-blue-400/40 dark:bg-blue-600/30 blur-[120px] rounded-full animate-aurora-3 mix-blend-multiply dark:mix-blend-screen" />
      
      {/* 
        Noise Texture Overlay 
        A very faint SVG noise texture adds that premium "grain" feel without performance cost.
      */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.4] dark:opacity-[0.25] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
    </div>
  );
}
