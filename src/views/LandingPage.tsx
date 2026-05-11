import { motion } from 'framer-motion';
import { 
  ArrowRight, Sparkles, Zap, Brain, MessageSquare, 
  ShieldCheck, BarChart3, Globe, Cpu, ChevronRight 
} from 'lucide-react';

interface Props { onStart: () => void; }

export default function LandingPage({ onStart }: Props) {
  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-indigo-500/30 font-sans">
      
      {/* 1. Header/Nav - Responsive Padding & Layout */}
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-md border-b border-white/5 bg-black/20">
        <div className="flex justify-between items-center p-4 md:p-6 max-w-7xl mx-auto">
          <div className="text-xl md:text-2xl font-bold tracking-tighter flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:scale-110 transition-transform">
              <Zap size={18} className="md:w-5 md:h-5" fill="white" />
            </div>
            Recruit<span className="text-indigo-500">AI</span>
          </div>
          
          {/* Hidden on Mobile */}
          <div className="hidden lg:flex gap-10 text-[11px] uppercase tracking-[0.2em] font-black text-gray-500">
            <a href="#" className="hover:text-indigo-400 transition-colors">Features</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Methodology</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a>
          </div>

          <button 
            onClick={onStart} 
            className="px-5 md:px-7 py-2 md:py-2.5 rounded-full bg-white text-black text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all active:scale-95 shadow-lg shadow-white/5"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* 2. Hero Section - Responsive Typography & Spacing */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-32 md:pt-48 pb-20 md:pb-32 relative z-10 text-center">
        {/* Background Radial Glow - Scaled for mobile */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] md:h-[500px] bg-indigo-600/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-6 md:space-y-10"
        >
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[8px] md:text-[9px] font-black tracking-[0.3em] uppercase text-indigo-400 shadow-inner">
            <Sparkles size={10} className="md:w-3 md:h-3" /> Live AI Interview Intelligence
          </div>
          
          <h1 className="text-5xl md:text-8xl lg:text-[120px] font-bold tracking-tighter leading-[1] md:leading-[0.9] mb-4">
            Refine your<br className="hidden md:block" />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20"> technical edge.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-base md:text-lg lg:text-xl text-gray-400 font-light leading-relaxed px-4 md:px-0">
            Stop chatting with bots. Start talking to an adaptive AI that listens, reacts, and evaluates in real-time. Designed for elite engineers.
          </p>

          <div className="pt-4 md:pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto group relative px-10 md:px-12 py-5 md:py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-[0.2em] transition-all hover:bg-indigo-500 hover:shadow-[0_0_40px_rgba(79,70,229,0.3)] active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
              Start Free Session <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-[0.2em] hover:bg-white/10 transition-all">
              Watch Demo
            </button>
          </div>
        </motion.div>
      </main>

      {/* 3. The "Bento Grid" Section - Responsive Grid Layout */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 pb-24 md:pb-40">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-auto md:auto-rows-[240px]">
          
          {/* Box 1: Large Performance Insight */}
          <BentoBox className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-indigo-950/20 to-transparent min-h-[350px] md:min-h-0">
             <BarChart3 size={32} className="text-indigo-500 mb-6 md:mb-8" />
             <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">Executive Reporting</h3>
             <p className="text-gray-500 font-light leading-relaxed text-sm md:text-base">Get a detailed breakdown of your technical depth, communication clarity, and confidence scores immediately after your call.</p>
             <div className="mt-8 md:mt-auto pt-6 md:pt-8 border-t border-white/5 flex flex-wrap gap-2 md:gap-3">
                <Badge>Llama 3.3 Core</Badge>
                <Badge>JSON Grading</Badge>
             </div>
          </BentoBox>

          {/* Box 2: Voice Detection */}
          <BentoBox className="md:col-span-2 min-h-[180px] md:min-h-0">
             <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500 shrink-0">
                  <Zap size={24} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 tracking-tight">Voice Activity Detection</h3>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">Advanced VAD stops the AI the moment you start speaking. Natural flow, zero buttons.</p>
                </div>
             </div>
          </BentoBox>

          {/* Box 3: Context Memory */}
          <BentoBox className="min-h-[180px] md:min-h-0">
             <Cpu size={24} className="text-purple-500 mb-4" />
             <h3 className="text-lg font-bold mb-1 tracking-tight">Tech Stack Context</h3>
             <p className="text-gray-500 text-xs font-light">Remembers your history and specific project architecture.</p>
          </BentoBox>

          {/* Box 4: Speech to Text */}
          <BentoBox className="min-h-[180px] md:min-h-0">
             <MessageSquare size={24} className="text-blue-500 mb-4" />
             <h3 className="text-lg font-bold mb-1 tracking-tight">Whisper-Fast STT</h3>
             <p className="text-gray-500 text-xs font-light">Industry-leading transcription with zero latency.</p>
          </BentoBox>

        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-12 md:py-20 text-center border-t border-white/5">
        <div className="text-gray-700 text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] px-4">
          PrepareAI © 2026 / Intelligence for Developers
        </div>
      </footer>
    </div>
  );
}

function Badge({ children }: any) {
  return (
    <div className="px-2 md:px-3 py-1 rounded-md bg-white/[0.03] border border-white/10 text-gray-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest">
      {children}
    </div>
  );
}

function BentoBox({ children, className }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`relative group p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 bg-[#0A0A0A] overflow-hidden transition-all duration-500 hover:border-indigo-500/30 hover:shadow-[0_0_40px_rgba(79,70,229,0.05)] ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -inset-px bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}