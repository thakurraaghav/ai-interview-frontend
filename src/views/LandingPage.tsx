import { motion, AnimatePresence } from 'framer-motion';
import { 
   Zap, MessageSquare, 
   BarChart3, Cpu, ChevronRight, Sun, Moon 
} from 'lucide-react';

interface Props { 
  onStart: () => void; 
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LandingPage({ onStart, isDark, setIsDark }: Props) {
  return (
    <div className="bg-[#FAF9F6] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#FAF9F6] min-h-screen overflow-x-hidden selection:bg-indigo-500/10 font-sans tracking-tight transition-colors duration-500">
      
      {/* 1. ARCHITECTURAL HEADER / NAV */}
      <nav className="fixed top-0 w-full z-50 bg-[#FAF9F6]/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-[#0A0A0A]/5 dark:border-white/5 transition-colors duration-500">
        <div className="flex justify-between items-center p-6 md:p-8 max-w-7xl mx-auto">
          <div className="text-lg font-black uppercase tracking-[0.25em] flex items-center gap-2.5 group cursor-pointer font-mono text-[#0A0A0A] dark:text-[#FAF9F6]">
            <Zap size={15} fill="currentColor" className="text-indigo-600" />
            Recruit<span className="font-light text-gray-400 dark:text-gray-600">.AI</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-12 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 dark:text-gray-500">
            <a href="#matrix" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">The Matrix</a>
            <a href="#architecture" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Architecture</a>
          </div>

          <div className="flex items-center gap-6">
            {/* 💡 THEME TOGGLE SWITCH MODULE CONNECTED TO GLOBAL PROP */}
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-sm bg-[#0A0A0A]/5 dark:bg-white/5 text-gray-500 hover:text-[#0A0A0A] dark:hover:text-white transition-all active:scale-90 cursor-pointer"
              aria-label="Toggle structural theme interface"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? 'dark' : 'light'}
                  initial={{ y: -10, opacity: 0, rotate: -20 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 10, opacity: 0, rotate: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
                </motion.div>
              </AnimatePresence>
            </button>

            <button 
              onClick={onStart} 
              className="px-6 py-2.5 rounded-sm bg-[#0A0A0A] dark:bg-[#FAF9F6] text-[#FAF9F6] dark:text-[#0A0A0A] text-[10px] font-black uppercase tracking-[0.25em] hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white transition-all active:scale-95 shadow-xs"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HIGH-CONTRAST HERO GRID */}
      <header className="max-w-7xl mx-auto px-6 md:px-8 pt-44 md:pt-60 pb-32 relative text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-8">
            <div className="inline-flex items-center gap-2 text-[9px] font-black tracking-[0.35em] uppercase text-indigo-600 font-mono">
              // Adaptive Neural Workspaces
            </div>
            
            <h1 className="text-5xl md:text-8xl lg:text-[105px] font-black tracking-tighter leading-[0.95] md:leading-[0.9] text-[#0A0A0A] dark:text-[#FAF9F6] transition-colors duration-500">
                Refine your<br />
                <span className="block pt-2 font-light italic text-gray-400 dark:text-gray-600 transition-colors duration-500">technical edge.</span>
              </h1>
          </div>

          <div className="lg:col-span-4 lg:pt-14 space-y-10">
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-normal leading-relaxed transition-colors duration-500">
              Stop talking to text bots. Transition immediately into an organic, adaptive interview ecosystem that evaluates execution pacing in real-time. Designed exclusively for elite software craftspeople.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onStart}
                className="group px-8 py-5 bg-[#0A0A0A] dark:bg-[#FAF9F6] text-[#FAF9F6] dark:text-[#0A0A0A] rounded-sm font-black uppercase text-[10px] tracking-[0.2em] transition-all hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white active:scale-98 flex items-center justify-center gap-3 shadow-xs"
              >
                Start Free Session <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

        {/* Framing Hairline Decorative Divider */}
        <div className="w-full h-px bg-[#0A0A0A]/10 dark:bg-white/10 mt-32 transition-colors duration-500" />
      </header>

      {/* 3. ASYMMETRIC CHRONICLE MATRIX */}
      <section id="matrix" className="max-w-7xl mx-auto px-6 md:px-8 pb-40">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-4 sticky top-32 space-y-4">
            <span className="text-[9px] font-black tracking-[0.4em] text-indigo-600 uppercase font-mono">01 / Capabilities</span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-[#0A0A0A] dark:text-[#FAF9F6] transition-colors duration-500">The Framework</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs leading-relaxed transition-colors duration-500">A purely diagnostic playground designed to analyze system execution benchmarks safely.</p>
          </div>

          <div className="lg:col-span-8 border-l border-[#0A0A0A]/10 dark:border-white/10 pl-6 md:pl-12 space-y-24 transition-colors duration-500">
            
            {/* Feature 1 */}
            <div className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <div className="md:col-span-4 text-xs font-mono font-black text-gray-300 dark:text-neutral-800 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-widest pt-1">// 01.01 DIAGNOSTICS</div>
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center gap-3 text-gray-400 dark:text-gray-600"><BarChart3 size={16} /> <h3 className="text-lg font-bold tracking-tight text-[#0A0A0A] dark:text-[#FAF9F6] transition-colors duration-500">Executive Reporting Matrix</h3></div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-light leading-relaxed transition-colors duration-500">Receive a stark, detailed analysis of your conceptual depth, communication velocity, and structural logic immediately following session terminations.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <div className="md:col-span-4 text-xs font-mono font-black text-gray-300 dark:text-neutral-800 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-widest pt-1">// 01.02 CORE AUDIO</div>
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center gap-3 text-gray-400 dark:text-gray-600"><Zap size={16} /> <h3 className="text-lg font-bold tracking-tight text-[#0A0A0A] dark:text-[#FAF9F6] transition-colors duration-500">Dynamic Stream Activation</h3></div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-light leading-relaxed transition-colors duration-500">Advanced threshold capture sequences isolate your voice and halt the model stream the exact millisecond you execute speech. Zero manual keys required.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <div className="md:col-span-4 text-xs font-mono font-black text-gray-300 dark:text-neutral-800 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-widest pt-1">// 01.03 INGESTION</div>
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center gap-3 text-gray-400 dark:text-gray-600"><Cpu size={16} /> <h3 className="text-lg font-bold tracking-tight text-[#0A0A0A] dark:text-[#FAF9F6] transition-colors duration-500">Persistent Tech Context</h3></div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-light leading-relaxed transition-colors duration-500">Maintains multi-turn context tracking your historic code submissions, profile repositories, and specialized architectural styles across separate sessions organically.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <div className="md:col-span-4 text-xs font-mono font-black text-gray-300 dark:text-neutral-800 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-widest pt-1">// 01.04 SPEECH ENGINE</div>
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center gap-3 text-gray-400 dark:text-gray-600"><MessageSquare size={16} /> <h3 className="text-lg font-bold tracking-tight text-[#0A0A0A] dark:text-[#FAF9F6] transition-colors duration-500">Zero-Latency Synthesis</h3></div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-light leading-relaxed transition-colors duration-500">High-performance custom transcription pipelines ingest and transcribe vocals with tight, near-instant audio translation limits to match real interview velocities.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. STRUCTURAL FOOTER */}
      <footer className="py-16 text-center bg-[#0A0A0A] dark:bg-[#FAF9F6] text-[#FAF9F6] dark:text-[#0A0A0A] transition-colors duration-500">
        <div className="text-[9px] font-mono font-bold uppercase tracking-[0.4em] opacity-40 dark:opacity-60">
          PrepareAI © 2026 / Precision Workspace Interfaces For Developers
        </div>
      </footer>
    </div>
  );
}