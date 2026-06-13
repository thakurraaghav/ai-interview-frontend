import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Search, Loader2, Target, Users, BookOpen, Sparkles } from 'lucide-react';

interface CompanyPrepProps {
  selectedRole: string;
}

export default function CompanyPrep({ selectedRole }: CompanyPrepProps) {
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [intel, setIntel] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    console.log(`📡 Sending request to backend for Company: ${companyName}, Role: ${selectedRole}`);

    try {
      const response = await fetch('https://ai-interview-backend-vgj7.onrender.com/api/company/prep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ companyName, role: selectedRole })
      });

      console.log(`🎛️ Backend HTTP Status Response: ${response.status}`);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}. Make sure backend routes are registered.`);
      }

      const data = await response.json();
      console.log("✅ Intel successfully received from backend:", data);
      setIntel(data);

    } catch (error: any) {
      console.warn("⚠️ Backend route not found or server offline. Engaging local sandbox mode fallback rules.");
      console.error(error);
      
      setErrorMessage("Showing sandbox simulation data.");

      // Clean local structural fallback parsing mechanics
      setIntel({
        company: companyName,
        role: selectedRole,
        overview: `${companyName} prioritizes high-concurrency architecture patterns, algorithmic scale parameters, and extreme culture match matrices. Expectations for a ${selectedRole} lean toward clean execution speed and decoupled designs.`,
        rounds: [
          { name: "Initial Technical Screening", focus: "Data Structures, Algorithm Pacing, Space-Time Complexities" },
          { name: "Core Architecture Panel", focus: "Distributed Storage, High Concurrency Pipelines, Data Isolation" },
          { name: "Cultural Fit Session", focus: "Behavioral Alignment, STAR Conflict Resolution matrices" }
        ],
        values: ["Velocity & Action Bias", "Radical Extreme Ownership", "Obsessive Customer Care"],
        focalPoints: ["State Caching Engines", "Load Balancing Layers", "System Fault Boundaries"]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20 selection:bg-indigo-500/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold italic tracking-tighter text-black dark:text-white">Company Intel Hub</h2>
          <p className="text-gray-400 dark:text-gray-500 text-xs font-medium uppercase tracking-widest mt-1">
            Targeted Placement Diagnostics for <span className="text-indigo-500 font-bold">{selectedRole}</span>
          </p>
        </div>
        
        {errorMessage && (
          <div className="self-start sm:self-auto px-4 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono text-[9px] tracking-tight uppercase animate-pulse">
            {errorMessage}
          </div>
        )}
      </div>

      {/* --- SEARCH BAR GATEWAY --- */}
      <form onSubmit={handleSearch} className="w-full max-w-xl">
        <div className="bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/5 p-2 rounded-2xl flex items-center gap-3 shadow-xs dark:shadow-none">
          <div className="pl-3 text-gray-400"><Building2 size={18} /></div>
          <input 
            type="text" 
            placeholder="Enter target company (e.g., Google, Stripe, Netflix)..."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="flex-1 bg-transparent text-xs text-black dark:text-white outline-none font-medium py-2 placeholder-gray-400"
          />
          <button 
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />} Get Intel
          </button>
        </div>
      </form>

      {/* --- INTEL LAYOUT DISPLAY --- */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-64 flex flex-col items-center justify-center text-center gap-3"
          >
            <Loader2 className="animate-spin text-indigo-500" size={32} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Mining Corporate signals & Network registries...</p>
          </motion.div>
        ) : intel ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-12 gap-6"
          >
            {/* Executive Overview */}
            <div className="col-span-12 p-8 md:p-10 rounded-[2.5rem] bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/5 relative overflow-hidden flex flex-col justify-center shadow-xs dark:shadow-none">
              <Sparkles className="absolute -right-6 -bottom-6 w-36 h-36 text-indigo-500/[0.03] -rotate-12 pointer-events-none" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-2 block">Strategic Overview</span>
              <h3 className="text-xl md:text-2xl font-bold italic tracking-tight text-black dark:text-white max-w-4xl leading-relaxed">
                "{intel.overview}"
              </h3>
            </div>

            {/* Expected Interview Loops */}
            <div className="col-span-12 lg:col-span-7 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-xs dark:shadow-none">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 flex items-center gap-2">
                <Target size={14} className="text-indigo-500" /> Anticipated Loop Structure
              </h4>
              <div className="space-y-4">
                {intel.rounds && intel.rounds.map((round: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold tracking-tight text-black dark:text-white">{round.name}</h5>
                      <p className="text-xs text-gray-400 mt-1 leading-normal font-light">{round.focus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cultural Alignment Metrics & Core Tech Focus */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
              {/* Values Block */}
              <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/5 flex-1 space-y-4 shadow-xs dark:shadow-none">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <Users size={14} className="text-purple-500" /> Culture Flags
                </h4>
                <div className="flex flex-wrap gap-2 pt-2">
                  {intel.values && intel.values.map((val: string, i: number) => (
                    <span key={i} className="px-3.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-bold text-[10px] uppercase tracking-wider">
                      {val}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technical Hotspots */}
              <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/5 flex-1 space-y-4 shadow-xs dark:shadow-none">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <BookOpen size={14} className="text-cyan-500" /> High Priority Topics
                </h4>
                <div className="flex flex-wrap gap-2 pt-2">
                  {intel.focalPoints && intel.focalPoints.map((point: string, i: number) => (
                    <span key={i} className="px-3.5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold text-[10px] uppercase tracking-wider">
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Empty Base State */
          <div className="py-20 border border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-6 bg-gray-50/30 dark:bg-white/[0.01]">
            <Building2 className="text-gray-300 dark:text-neutral-800 mb-4" size={40} />
            <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 tracking-tight">No Target Company Selected</h4>
            <p className="text-xs text-gray-400 dark:text-gray-600 max-w-xs mt-1 font-light leading-relaxed">Input your targeted enterprise destination above to compile custom technical and cultural loop specifications.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}