import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, ChevronLeft, Loader2, FileText, CheckCircle } from 'lucide-react';

interface ResumeLabProps {
  onBack: () => void;
  selectedRole: string;
}

export default function ResumeView({ onBack, selectedRole }: ResumeLabProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('role', selectedRole);

    try {
      const response = await fetch('https://ai-interview-backend-vgj7.onrender.com/api/resume/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze resume. Make sure your backend is running.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-10 pb-20 font-sans tracking-tight"
    >
      {/* ADAPTIVE NAV BACK BUTTON */}
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-all uppercase text-[9px] font-mono font-black tracking-[0.3em] cursor-pointer"
      >
        <ChevronLeft size={14} /> Back to Dashboard
      </button>

      {!result ? (
        /* --- HIGH CONTRAST INGESTION BOX INTERFACE --- */
        <div className="p-16 md:p-24 border border-dashed border-neutral-200 dark:border-white/10 rounded-[2.5rem] bg-white dark:bg-[#111111]/30 flex flex-col items-center justify-center text-center transition-colors duration-500">
          <div className="p-5 rounded-xl bg-indigo-600/5 text-indigo-500 mb-6">
            {analyzing ? <Loader2 className="animate-spin" size={32} /> : <Upload size={32} />}
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 text-black dark:text-white">
            {analyzing ? 'Analyzing Framework Matrices...' : 'Resume Intelligence'}
          </h2>
          <p className="text-gray-400 dark:text-gray-500 max-w-sm mb-8 text-xs font-light leading-relaxed">
            Upload your PDF portfolio. Hannah will benchmark its structural density against <span className="text-indigo-600 dark:text-indigo-400 font-medium">{selectedRole}</span> standards.
          </p>
          
          <input 
            type="file" 
            id="resume-input" 
            hidden 
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={analyzing}
          />
          <label 
            htmlFor="resume-input" 
            className={`px-8 py-4 bg-[#0A0A0A] dark:bg-[#FAF9F6] text-[#FAF9F6] dark:text-[#0A0A0A] rounded-sm font-black cursor-pointer hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white transition-all text-[10px] uppercase tracking-[0.25em] ${analyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {analyzing ? 'Processing Ingestion...' : 'Select PDF Target'}
          </label>
        </div>
      ) : (
        /* --- STARK EDITORIAL RESULTS LAYOUT --- */
        <div className="grid grid-cols-12 gap-6 items-stretch">
          
          {/* Left Metrics Density Block */}
          <div className="col-span-12 lg:col-span-4 p-10 rounded-[2.5rem] bg-[#0A0A0A] dark:bg-[#111111] flex flex-col justify-between text-left shadow-xl dark:shadow-none transition-colors duration-500">
             <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em] text-gray-500">ATS Match Density</span>
             <div className="text-7xl font-bold mt-10 mb-4 tracking-tighter italic text-white">{result.score}%</div>
          </div>
          
          {/* Right Adaptive Feedback Container */}
          <div className="col-span-12 lg:col-span-8 p-10 md:p-12 rounded-[2.5rem] bg-white dark:bg-[#111111]/40 border border-neutral-200/50 dark:border-white/5 flex flex-col justify-center relative overflow-hidden transition-colors duration-500">
             <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 mb-4 block">// SYSTEM CRITIQUE METRICS</span>
             <p className="text-xl md:text-2xl font-light italic tracking-tight text-black dark:text-white leading-relaxed relative z-10">
               "{result.feedback}"
             </p>
          </div>
          
          {/* Reset Secondary Vector */}
          <button 
            onClick={() => setResult(null)}
            className="col-span-12 text-center text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-[9px] font-mono font-black uppercase tracking-[0.4em] pt-4 cursor-pointer"
          >
            [ Analyze Another Document ]
          </button>
        </div>
      )}
    </motion.div>
  );
}