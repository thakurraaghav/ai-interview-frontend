import { motion } from 'framer-motion';
import { Award, LayoutDashboard } from 'lucide-react';

export default function ReportView({ data, onDashboard }: any) {
  // Mock data if 'data' is null for testing
  const report = data || {
    score: 84,
    technical: 88,
    communication: 72,
    feedback: "You demonstrated a strong grasp of React state management, but your explanation of CSS specificity could be more precise."
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Score Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-2 p-12 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl flex flex-col items-center justify-center text-center"
        >
          <div className="relative mb-8">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
              <motion.circle 
                cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                strokeDasharray={553}
                initial={{ strokeDashoffset: 553 }}
                animate={{ strokeDashoffset: 553 - (553 * report.score) / 100 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="text-indigo-500" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-bold">{report.score}</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Overall</span>
            </div>
          </div>
          <h2 className="text-3xl font-light italic text-gray-300">"Strong Hire"</h2>
        </motion.div>

        {/* Small Metrics */}
        <div className="space-y-8">
          <MetricCard title="Technical" value={report.technical} color="text-blue-400" />
          <MetricCard title="Communication" value={report.communication} color="text-purple-400" />
          <button 
            onClick={onDashboard}
            className="w-full p-8 rounded-[2.5rem] bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 font-bold"
          >
            <LayoutDashboard size={20} /> View Dashboard
          </button>
        </div>

        {/* Detailed Feedback */}
        <div className="md:col-span-3 p-12 rounded-[3rem] bg-white/5 border border-white/10">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Award className="text-indigo-400" /> Executive Feedback
          </h3>
          <p className="text-gray-400 text-lg leading-relaxed font-light">
            {report.feedback}
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, color }: any) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{title}</span>
        <span className={`text-2xl font-bold ${color}`}>{value}%</span>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full bg-current ${color}`}
        />
      </div>
    </div>
  );
}