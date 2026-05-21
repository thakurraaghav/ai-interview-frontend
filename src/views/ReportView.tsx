import { motion } from 'framer-motion';
import { Award, LayoutDashboard, Target, MessageSquare } from 'lucide-react';

interface ReportData {
  score?: number;
  technical?: number;
  communication?: number;
  feedback?: string;
  verdict?: string;
}

interface ReportViewProps {
  data: ReportData | null;
  onDashboard: () => void;
}

export default function ReportView({ data, onDashboard }: ReportViewProps) {
  // Extract data from the live backend response object with strict fallbacks
  const score = data?.score ?? 0;
  const technical = data?.technical ?? data?.score ?? 0; // Fallback to overall score if specific key is omitted
  const communication = data?.communication ?? data?.score ?? 0;
  const feedback = data?.feedback || data?.verdict || "No additional session summary text returned by the evaluation engine.";

  // Dynamic hiring evaluation tier matrix based on performance metrics
  const getVerdict = (finalScore: number) => {
    if (finalScore >= 90) return { text: "Elite Hire", color: "text-emerald-600 dark:text-emerald-500" };
    if (finalScore >= 75) return { text: "Strong Hire", color: "text-indigo-600 dark:text-indigo-500" };
    if (finalScore >= 60) return { text: "Needs Practice", color: "text-amber-600 dark:text-amber-500" };
    return { text: "Critical Review Required", color: "text-red-600 dark:text-red-500" };
  };

  const verdict = getVerdict(score);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-500 selection:bg-indigo-500/10 font-sans tracking-tight">
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-16 md:py-24 space-y-8">
        
        {/* --- BACK NAVIGATION HEADER --- */}
        <div className="flex w-full justify-between items-center mb-4">
          <button 
            onClick={onDashboard} 
            className="group flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-all uppercase text-[10px] font-black tracking-[0.3em] cursor-pointer"
          >
            ← Close Report
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl bg-neutral-100/60 dark:bg-white/5 border border-neutral-200/40 dark:border-white/5 text-gray-400 dark:text-gray-500">
            Performance Summary Matrix
          </span>
        </div>

        {/* --- GRID SYSTEM PLATFORM --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Main Ring Score Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 p-10 md:p-14 rounded-[3rem] bg-neutral-100/50 dark:bg-white/5 border border-neutral-200/30 dark:border-white/10 backdrop-blur-3xl flex flex-col items-center justify-center text-center shadow-xs dark:shadow-none transition-colors duration-500"
          >
            <div className="relative mb-8">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-neutral-200/50 dark:text-white/5" />
                <motion.circle 
                  cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="10" fill="transparent" 
                  strokeDasharray={528}
                  initial={{ strokeDashoffset: 528 }}
                  animate={{ strokeDashoffset: 528 - (528 * score) / 100 }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                  className="text-indigo-600 dark:text-indigo-500" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-bold tracking-tighter">{score}%</span>
                <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Final Score</span>
              </div>
            </div>
            <h2 className={`text-3xl font-black italic tracking-tight ${verdict.color}`}>
              "{verdict.text}"
            </h2>
          </motion.div>
          
          {/* Right Metrics & Actions Column */}
          <div className="flex flex-col gap-6 h-full justify-between">
            <MetricCard 
              title="Technical Depth" 
              value={technical} 
              color="text-indigo-600 dark:text-indigo-400" 
              barBg="bg-indigo-600 dark:bg-indigo-500"
              icon={<Target size={14} />} 
            />
            
            <MetricCard 
              title="Communication" 
              value={communication} 
              color="text-purple-600 dark:text-purple-400" 
              barBg="bg-purple-600 dark:bg-purple-500"
              icon={<MessageSquare size={14} />} 
            />

            <button 
              onClick={onDashboard}
              className="w-full p-6 py-7 rounded-3xl bg-[#0A0A0A] dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white transition-all flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/5 dark:shadow-indigo-600/10 hover:scale-[1.02] active:scale-98 cursor-pointer border border-transparent dark:border-white/5"
            >
              <LayoutDashboard size={16} /> Return To Dashboard
            </button>
          </div>

          {/* Bottom Module: Detailed Text Feedback */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-3 p-10 md:p-12 rounded-[3rem] bg-neutral-100/50 dark:bg-white/5 border border-neutral-200/30 dark:border-white/10 shadow-xs dark:shadow-none transition-colors duration-500"
          >
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-6 flex items-center gap-2">
              <Award size={16} className="text-indigo-600 dark:text-indigo-400" /> Comprehensive Evaluation
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-light italic">
              "{feedback}"
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

// --- SECURE SUB-COMPONENT HELPER ---
interface MetricCardProps {
  title: string;
  value: number;
  color: string;
  barBg: string;
  icon: React.ReactNode;
}

function MetricCard({ title, value, color, barBg, icon }: MetricCardProps) {
  return (
    <div className="p-6 rounded-3xl bg-neutral-100/50 dark:bg-white/5 border border-neutral-200/30 dark:border-white/10 w-full shadow-xs dark:shadow-none flex flex-col justify-center flex-1 transition-colors duration-500">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
          {icon} {title}
        </span>
        <span className={`text-xl font-black italic tracking-tight ${color}`}>{value}%</span>
      </div>
      <div className="w-full h-1.5 bg-neutral-200/60 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={`h-full ${barBg}`}
        />
      </div>
    </div>
  );
}