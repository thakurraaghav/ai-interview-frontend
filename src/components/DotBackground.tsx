export default function DotBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#FAF9F6] dark:bg-[#050505] transition-colors duration-500 flex items-center justify-center">
      
      {/* Dotted Background Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-60 dark:opacity-40" 
        style={{
          backgroundImage: `radial-gradient(rgba(99, 102, 241, 0.4) 1.5px, transparent 1.5px)`,
          backgroundSize: '32px 32px',
          backgroundPosition: 'center center'
        }}
      />

      {/* Radial Mask to fade edges seamlessly into the background color */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,#FAF9F6_80%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_20%,#050505_80%)]" />

      {/* Subtle background glow for extra depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
