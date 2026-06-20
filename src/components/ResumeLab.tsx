import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Upload, ChevronLeft, CheckCircle } from 'lucide-react';
import { apiFetch } from '../lib/api';

export default function ResumeLab({ onBack, selectedRole, fetchProfile }: { onBack: () => void; selectedRole: string, fetchProfile: () => Promise<void> }) {
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
      const response = await apiFetch('/api/resume/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setResult(data);

      await fetchProfile();

    } catch (error) {
      console.error(error);
      alert("Failed to connect to backend. Ensure the server is running on port 3000.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-all uppercase text-[10px] font-black tracking-widest">
        <ChevronLeft size={16} /> Back to Dashboard
      </button>

      {!result ? (
        <div className="p-20 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[3.5rem] bg-gray-50 dark:bg-white/2 flex flex-col items-center justify-center text-center">
          <div className="p-6 rounded-3xl bg-indigo-600/10 text-indigo-500 mb-6">
            {analyzing ? <Loader2 className="animate-spin" size={40} /> : <Upload size={40} />}
          </div>
          <h2 className="text-3xl font-bold italic mb-2 tracking-tighter text-black dark:text-white">
            {analyzing ? 'Hannah is Analyzing...' : 'Resume Intelligence'}
          </h2>
          <p className="text-gray-500 max-w-sm mb-8 text-sm font-light leading-relaxed">
            Upload your PDF. Hannah will benchmark it against <span className="text-black dark:text-white font-medium">{selectedRole}</span> standards.
          </p>
          <input type="file" id="resume-input" hidden accept=".pdf" onChange={handleFileUpload} disabled={analyzing} />
          <label htmlFor="resume-input" className={`px-10 py-4 bg-indigo-600 text-white rounded-full font-bold cursor-pointer hover:scale-105 transition-all text-[11px] uppercase tracking-[0.2em] ${analyzing ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {analyzing ? 'Processing...' : 'Select PDF'}
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4 p-12 rounded-[3.5rem] bg-indigo-600 shadow-2xl shadow-indigo-500/20">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">ATS Match Score</span>
            <div className="text-8xl font-bold mt-4 tracking-tighter italic text-white">{result.score}%</div>
          </div>
          <div className="col-span-12 lg:col-span-8 p-12 rounded-[3.5rem] bg-gray-100 dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 flex flex-col justify-center relative overflow-hidden">
            <CheckCircle className="absolute -right-6 -bottom-6 w-48 h-48 text-black/2 dark:text-white/2 -rotate-12" />
            <p className="text-2xl md:text-3xl font-bold italic tracking-tight text-black dark:text-white leading-tight relative z-10">
              "{result.feedback}"
            </p>
          </div>
          <button onClick={() => setResult(null)} className="col-span-12 text-center text-gray-400 hover:text-black dark:hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.4em]">
            Analyze another resume
          </button>
        </div>
      )}
    </motion.div>
  );
}
