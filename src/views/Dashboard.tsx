import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
   History,   Award, ChevronRight, 
ChevronLeft, LogOut, Trash2, Mic, Building2, Calendar,TrendingUp,
MessageSquare, Sparkles, FileCheck, AlertCircle, File, LayoutDashboard,
Zap, Search, Bell, Settings
} from 'lucide-react';
import { 
  ResponsiveContainer,    
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

interface Props { onNewCall: (role: string) => void; }

export default function Dashboard({ onNewCall }: Props) {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState("Fullstack Developer");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setUserData(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.removeItem('token'); window.location.reload(); };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      const res = await fetch(`http://localhost:3000/api/interview/${deleteModal.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setUserData({ ...userData, interviews: userData.interviews.filter((s: any) => s.id !== deleteModal.id) });
      }
    } catch (err) { console.error(err); }
    setDeleteModal({ isOpen: false, id: null });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const interviews = userData?.interviews || [];

  const trendData = [...interviews].reverse().map(s => ({
    date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: s.score
  })).slice(-10);

// --- DETAIL VIEW ---
if (selectedReport) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-[#050505] text-white p-6 md:p-12 overflow-y-auto custom-scrollbar"
    >
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Navigation & Session Metadata */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <button 
            onClick={() => setSelectedReport(null)} // 💡 This returns you to the Dashboard grid
            className="group flex items-center gap-2 text-gray-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-[0.3em]"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-4 px-5 py-2 rounded-2xl bg-white/3 border border-white/5">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {new Date(selectedReport.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{selectedReport.role}</span>
          </div>
        </div>

        {/* Hero Metrics Section */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Readiness Score - High Impact */}
          <div className="col-span-12 lg:col-span-4 relative group overflow-hidden p-10 rounded-[3rem] bg-indigo-600 shadow-2xl shadow-indigo-500/10 transition-all hover:scale-[1.01]">
             <div className="relative z-10">
               <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Performance Grade</span>
               <div className="text-8xl font-bold mt-4 tracking-tighter italic drop-shadow-2xl">
                 {selectedReport.score}<span className="text-3xl not-italic opacity-40">%</span>
               </div>
               <p className="mt-6 text-white/70 text-xs font-medium leading-relaxed">
                 Aggregate readiness based on technical accuracy, logic, and delivery.
               </p>
             </div>
             {/* Subtle Decorative Icon */}
             <Zap className="absolute -right-6 -bottom-6 w-40 h-40 text-white/5 -rotate-12 pointer-events-none" />
          </div>
          
          {/* AI Verdict - Cinematic Style */}
          <div className="col-span-12 lg:col-span-8 p-10 rounded-[3rem] bg-[#0A0A0A] border border-white/10 backdrop-blur-3xl flex flex-col justify-center relative">
             <div className="absolute top-8 right-8">
                <Sparkles size={24} className="text-indigo-500/30" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-4 block">Executive Summary</span>
             <h3 className="text-2xl md:text-4xl font-bold italic tracking-tight text-white leading-[1.15]">
               "{selectedReport.verdict || "Analysis suggests strong technical alignment with high communication clarity."}"
             </h3>
          </div>

          {/* Transcript - Clean Conversation Flow */}
          <div className="col-span-12 p-8 md:p-14 rounded-[3.5rem] bg-[#0A0A0A] border border-white/5">
            <div className="flex items-center gap-3 mb-16 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
              <MessageSquare size={16} className="text-indigo-500" /> Intelligence Transcript
            </div>

            <div className="space-y-12 max-w-4xl mx-auto">
              {(selectedReport.transcript || []).length > 0 ? (
                selectedReport.transcript.map((entry: any, i: number) => (
                  <div key={i} className={`flex flex-col ${entry.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`group relative max-w-[90%] md:max-w-[80%] p-6 md:p-8 rounded-4xl transition-all duration-500 ${
                      entry.role === 'user' 
                        ? 'bg-indigo-500/5 border border-indigo-500/10 text-white' 
                        : 'bg-white/2 border border-white/5 text-gray-400'
                    }`}>
                      <span className={`text-[8px] font-black uppercase tracking-widest opacity-30 mb-4 block ${
                        entry.role === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        {entry.role === 'user' ? 'Candidate response' : 'Hannah System'}
                      </span>
                      <p className="text-sm md:text-lg font-light leading-relaxed tracking-wide">
                        {entry.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-gray-700 italic text-sm tracking-widest uppercase">
                  No transcript logs for this session
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Identifier */}
        <div className="py-12 text-center opacity-20">
           <div className="text-[9px] font-black uppercase tracking-[0.6em] text-white">
             RecruitAI / Deep Analysis Report / 2026
           </div>
        </div>
      </div>
    </motion.div>
  );
}

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* 1. STATIC SIDEBAR */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 lg:flex shrink-0">
        <div className="mb-10 px-2 flex items-center gap-2 text-indigo-500 font-black tracking-tighter text-2xl italic">
          <Zap size={24} fill="text-indigo-500" /> RecruitAI
        </div>
        
        <nav className="space-y-2 flex-1">
          <SidebarLink icon={<LayoutDashboard size={18}/>} label="Dashboard" active/>
          <SidebarLink icon={<History size={18}/>} label="History" />
          <SidebarLink icon={<File size={18}/>} label="Resume assessment" />
          <SidebarLink icon={<Building2 size={18}/>} label="Company Preparation" />
          <SidebarLink icon={<Settings size={18}/>} label="Settings" />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full text-gray-500 hover:text-red-400 transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* TOP SEARCH/USER BAR */}
          <header className="flex justify-between items-center mb-4">
            <div className="relative group w-full max-w-md hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search sessions..." 
                className="w-full bg-[#111] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <div className="p-2 bg-[#111] rounded-lg border border-white/5 text-gray-400 cursor-pointer hover:text-white transition-colors relative">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full border-2 border-black" />
              </div>
              <div className="flex items-center gap-3 pl-4 border-l border-white/5">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold">{userData?.name || 'Developer'}</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest">Free Plan</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                  {userData?.name?.charAt(0) || 'U'}
                </div>
              </div>
            </div>
          </header>

          {/* HERO WELCOME SECTION */}
          <section className="relative p-8 md:p-12 rounded-[2.5rem] bg-linear-to-br from-indigo-900/20 via-transparent to-transparent border border-white/10 overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tighter italic">
                  Welcome back, {userData?.name?.split(' ')[0]}
                </h2>
                <p className="text-gray-400 max-w-md text-sm font-light leading-relaxed">
                  Your readiness score is looking sharp. You are well-positioned for <span className="text-white font-medium">{selectedRole}</span> roles.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/5 flex items-center gap-4">
                   <select 
                     value={selectedRole} 
                     onChange={(e) => setSelectedRole(e.target.value)} 
                     className="bg-transparent text-[10px] font-black uppercase outline-none text-white cursor-pointer px-4"
                   >
                     <option value="Frontend Developer" className="bg-[#111]">Frontend Developer</option>
                     <option value="Backend Developer" className="bg-[#111]">Backend Developer</option>
                     <option value="Fullstack Developer" className="bg-[#111]">Fullstack Developer</option>
                     <option value="UI/UX Designer" className="bg-[#111]">UI/UX Designer</option>
                   </select>
                   <button 
                    onClick={() => onNewCall(selectedRole)}
                    className="px-8 py-4 bg-indigo-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 whitespace-nowrap inline-flex items-center gap-2"
                  >
                    <span>Start Session</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>
            {/* Background Atmosphere */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-indigo-500/5 to-transparent pointer-events-none" />
          </section>

          {/* QUICK ACTIONS SECTION */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <QuickActionCard 
    icon={<Mic className="text-indigo-400" />}
    title="Start Interview"
    description="Live audio simulation"
    onClick={() => onNewCall(selectedRole)}
    highlight
  />
  <QuickActionCard 
    icon={<FileCheck className="text-purple-400" />}
    title="Resume Prep"
    description="Assessment & Grade"
    onClick={() => {}} // Add your assessment logic here
  />
  <QuickActionCard 
    icon={<Building2 className="text-purple-400" />}
    title="Company Prep"
    description="AI Candidate Evaluation"
    onClick={() => {}} // Add your assessment logic here
  />
</section>

          {/* BENTO GRID */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* LEFT: TREND GRAPH */}
            <div className="col-span-12 lg:col-span-8 bg-[#111] border border-white/5 rounded-[2.5rem] p-8">
              <div className="flex justify-between items-center mb-8">
                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
                  <TrendingUp size={14} className="text-indigo-500" /> Recent Performance
                </h4>
              </div>
              <div className="h-62.5 w-full min-h-0">
                <ResponsiveContainer width="100%" aspect={3}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="date" stroke="#333" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RIGHT: QUICK STATS */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8">
                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">
                  <Sparkles size={14} className="text-indigo-400" /> Career Readiness
                </h4>
                <div className="space-y-6">
                  <ProgressStat label="Technical Depth" value={78} />
                  <ProgressStat label="Communication" value={92} />
                  <ProgressStat label="Logical Reasoning" value={64} />
                </div>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-indigo-600 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-white/60 mb-1">Total Rounds</div>
                  <div className="text-4xl font-bold italic tracking-tighter">{interviews.length}</div>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl text-white">
                  <Award size={24} />
                </div>
              </div>
            </div>

            {/* BOTTOM: SESSION HISTORY LIST */}
            <div className="col-span-12 space-y-4">
              <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 px-4">
                <History size={14} /> Session Log
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...interviews].reverse().map((session: any, index: number) => (
                  <motion.div 
                    key={session.id || index} 
                    onClick={() => setSelectedReport(session)}
                    whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.03)" }}
                    className="p-5 rounded-4xl bg-[#111] border border-white/5 flex items-center justify-between group cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold italic group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        {session.score}
                      </div>
                      <div>
                        <h5 className="font-bold text-sm tracking-tight">{session.verdict || "Practice Round"}</h5>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{session.role}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => handleDeleteClick(e, session.id)} className="p-3 text-gray-700 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                      <ChevronRight size={18} className="text-gray-700 group-hover:text-indigo-500" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* REUSABLE DELETE MODAL */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteModal({ isOpen: false, id: null })} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative bg-[#111] border border-white/10 p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl">
              <AlertCircle size={40} className="mx-auto text-red-500 mb-6" />
              <h3 className="text-xl font-bold mb-2">Delete Session?</h3>
              <p className="text-gray-500 text-sm mb-8">This action is permanent and will remove all performance data.</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteModal({ isOpen: false, id: null })} className="flex-1 py-3 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl bg-red-600 text-[10px] font-black uppercase tracking-widest">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- HELPER UI COMPONENTS ---

function QuickActionCard({ icon, title, description, onClick, highlight = false }: any) {
  return (
    <motion.div 
      whileHover={{ y: -4, backgroundColor: "rgba(255,255,255,0.04)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cursor-pointer p-6 rounded-4xl border transition-all flex items-center gap-5 ${
        highlight ? 'bg-indigo-600/5 border-indigo-500/20' : 'bg-[#111] border-white/5'
      }`}
    >
      <div className="p-4 rounded-2xl bg-white/5">
        {icon}
      </div>
      <div>
        <h5 className="font-bold text-sm text-white">{title}</h5>
        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">{description}</p>
      </div>
      <ChevronRight size={16} className="ml-auto text-gray-700" />
    </motion.div>
  );
}

function SidebarLink({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
      {icon}
      <span className="text-[11px] font-bold tracking-tight">{label}</span>
    </div>
  );
}

function ProgressStat({ label, value }: { label: string, value: number }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-gray-400 tracking-tight">{label}</span>
        <span className="text-[10px] font-black text-indigo-400">{value}%</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className="h-full bg-indigo-500" />
      </div>
    </div>
  );
}