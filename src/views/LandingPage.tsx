import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Brain, MessageSquare, ShieldCheck, BarChart3 } from 'lucide-react';

interface Props { onStart: () => void; }

export default function LandingPage({ onStart }: Props) {
  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* 1. Header/Nav */}
      <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto relative z-20">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Zap size={18} fill="white" />
          </div>
          Recruit<span className="text-indigo-500">AI</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Enterprise</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <button onClick={onStart} className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-semibold">
          Sign In
        </button>
      </nav>

      {/* 2. Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-24 pb-20 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black tracking-[0.2em] uppercase text-indigo-400">
            <Sparkles size={12} /> Powered by Llama 3.3 & Orpheus
          </div>
          
          <h1 className="text-7xl md:text-[120px] font-extralight tracking-tighter leading-[0.85] mb-4">
            Practice <br />
            <span className="font-semibold italic text-transparent bg-clip-text bg-linear-to-b from-white to-white/40">Emotionally.</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-lg text-gray-500 font-light leading-relaxed">
            Stop chatting with bots. Start talking to the world's most human AI interviewer. 
            Built for developers who want to lead.
          </p>

          <div className="pt-10">
            <button 
              onClick={onStart}
              className="group relative px-10 py-5 bg-white text-black rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,250,0.2)]"
            >
              Start Free Session <ArrowRight size={20} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </main>

      {/* 3. The "Bento Grid" Section */}
      <section className="max-w-7xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-full md:h-150">
          
          {/* Box 1: Large Performance Insight */}
          <BentoBox className="md:col-span-2 md:row-span-2 bg-indigo-600/5 border-indigo-500/20">
             <BarChart3 size={40} className="text-indigo-500 mb-6" />
             <h3 className="text-3xl font-bold mb-4">Executive Reporting</h3>
             <p className="text-gray-400 font-light">Get a detailed breakdown of your technical skills, communication clarity, and confidence scores immediately after your call.</p>
             <div className="mt-8 pt-8 border-t border-white/5 flex gap-4">
                <div className="px-3 py-1 rounded-md bg-indigo-500/20 text-indigo-400 text-xs font-bold">JSON AI Mode</div>
                <div className="px-3 py-1 rounded-md bg-white/5 text-gray-500 text-xs font-bold">Senior Grading</div>
             </div>
          </BentoBox>

          {/* Box 2: Voice Detection */}
          <BentoBox className="md:col-span-2 bg-white/2">
             <div className="flex justify-between items-start">
               <div>
                <Zap className="text-yellow-500" />
                  <h3 className="text-xl font-bold mb-2">Voice Activity Detection</h3>
                  <p className="text-gray-500 text-sm font-light">Advanced VAD stops the AI the moment you start speaking. Natural flow, zero buttons.</p>
               </div>
             </div>
          </BentoBox>

          {/* Box 3: Context Memory */}
          <BentoBox className="bg-white/2">
             <Brain size={24} className="text-purple-500 mb-4" />
             <h3 className="text-lg font-bold mb-1">Contextual</h3>
             <p className="text-gray-500 text-xs">Remembers your name and entire tech stack history.</p>
          </BentoBox>

          {/* Box 4: Speech to Text */}
          <BentoBox className="bg-white/2">
             <MessageSquare size={24} className="text-blue-500 mb-4" />
             <h3 className="text-lg font-bold mb-1">Real-time STT</h3>
             <p className="text-gray-500 text-xs">Industry leading whisper-fast transcription.</p>
          </BentoBox>

        </div>
      </section>
    </div>
  );
}

function BentoBox({ children, className }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.2)' }}
      className={`p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl transition-colors flex flex-col justify-center ${className}`}
    >
      {children}
    </motion.div>
  );
}