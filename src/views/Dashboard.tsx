import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
   History, ChevronRight, 
   ChevronLeft, LogOut, Mic, Building2, 
   Sparkles, FileCheck, AlertCircle, File, LayoutDashboard,
   Zap, Search, Bell, Settings, Upload, Loader2, CheckCircle,
   Trash2, FileText, Sun, Moon
} from 'lucide-react';
import { 
  ResponsiveContainer,    
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

import ReportView from './ReportView';
import CompanyPrep from '../components/CompanyPrep';

// --- THEME TOGGLE COMPONENT ---
interface ThemeToggleProps {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}

function ThemeToggle({ isDark, setIsDark }: ThemeToggleProps) {
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button 
      onClick={() => setIsDark(!isDark)}
      className="p-2 bg-gray-100 dark:bg-[#111] rounded-lg border border-gray-200 dark:border-white/5 text-gray-500 hover:text-indigo-500 transition-all cursor-pointer flex items-center justify-center"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

// --- SUB-COMPONENT: RESUME LAB ---
function ResumeLab({ onBack, selectedRole, fetchProfile }: { onBack: () => void; selectedRole: string, fetchProfile: () => Promise<void> }) {
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
      const response = await fetch('http://localhost:3000/api/resume/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
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

// --- MAIN DASHBOARD ---
interface DashboardProps { 
  onNewCall: (role: string) => void; 
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Dashboard({ onNewCall, isDark, setIsDark }: DashboardProps) {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState("Fullstack Developer");
  const [activeTab, setActiveTab] = useState<'dashboard' | 'resume' | 'history' | 'company'>('dashboard');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null; type?: 'interview' | 'resume' }>({ isOpen: false, id: null });
  const [selectedResume, setSelectedResume] = useState<any>(null);

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

  const handleDeleteClick = (e: React.MouseEvent, id: string, type: 'interview' | 'resume') => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, id, type });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    const endpoint = deleteModal.type === 'interview' 
      ? `http://localhost:3000/api/interview/${deleteModal.id}`
      : `http://localhost:3000/api/resume/${deleteModal.id}`;

    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        if (deleteModal.type === 'interview') {
          setUserData({ ...userData, interviews: userData.interviews.filter((s: any) => (s.id || s._id) !== deleteModal.id) });
        } else {
          setUserData({ ...userData, resumes: userData.resumes.filter((s: any) => (s.id || s._id) !== deleteModal.id) });
        }
      }
    } catch (err) { console.error(err); }
    setDeleteModal({ isOpen: false, id: null });
  };

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const interviews = userData?.interviews || [];
  const resumes = userData?.resumes || [];
  
  const trendData = [...interviews].reverse().map(s => ({
    date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: s.score
  })).slice(-10);

  if (selectedReport) {
    return (
      <ReportView 
        data={selectedReport} 
        onDashboard={() => setSelectedReport(null)} 
      />
    );
  }

  if (selectedResume) {
    return (
      <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white p-6 md:p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <button onClick={() => setSelectedResume(null)} className="group flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white transition-all uppercase text-[10px] font-black tracking-[0.3em]">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to History
            </button>
            <div className="flex items-center gap-4 px-5 py-2 rounded-2xl bg-gray-50 dark:bg-white/3 border border-gray-200 dark:border-white/5">
              <FileText size={14} className="text-purple-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">{selectedResume.fileName}</span>
              <div className="w-px h-3 bg-gray-200 dark:bg-white/10" />
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-500">{selectedResume.role}</span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-4 p-12 rounded-[3.5rem] bg-purple-600 shadow-2xl shadow-purple-500/20">
               <span className="text-[10px] font-black uppercase tracking-widest text-white/60">ATS Compatibility</span>
               <div className="text-8xl font-bold mt-4 tracking-tighter italic text-white">{selectedResume.score}%</div>
            </div>
            
            <div className="col-span-12 lg:col-span-8 p-12 rounded-[3.5rem] bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 flex flex-col justify-center relative overflow-hidden">
               <CheckCircle className="absolute -right-6 -bottom-6 w-48 h-48 text-black/2 dark:text-white/2 -rotate-12" />
               <span className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-4 block">AI Feedback</span>
               <p className="text-2xl md:text-3xl font-bold italic tracking-tight text-black dark:text-white leading-tight relative z-10">
                 "{selectedResume.feedback}"
               </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-[#050505] text-black dark:text-white overflow-hidden font-sans selection:bg-indigo-500/30 transition-colors duration-300">
      <aside className="w-64 border-r border-gray-100 dark:border-white/5 flex flex-col p-6 lg:flex shrink-0">
        <div className="mb-10 px-2 flex items-center gap-2 text-indigo-500 font-black tracking-tighter text-2xl italic">
          <Zap size={24} fill="currentColor" /> RecruitAI
        </div>
        <nav className="space-y-2 flex-1">
          <SidebarLink icon={<LayoutDashboard size={18}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarLink icon={<History size={18}/>} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')}/>
          <SidebarLink icon={<File size={18}/>} label="Resume assessment" active={activeTab === 'resume'} onClick={() => setActiveTab('resume')} />
          <SidebarLink icon={<Building2 size={18}/>} label="Company Preparation" active={activeTab === 'company'} onClick={() => setActiveTab('company')}/>
          <SidebarLink icon={<Settings size={18}/>} label="Settings" />
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5 space-y-4">
          <ThemeToggle isDark={isDark} setIsDark={setIsDark}/>
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full text-gray-400 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex justify-between items-center mb-4">
            <div className="relative group w-full max-w-md hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors" size={16} />
              <input type="text" placeholder="Search sessions..." className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-indigo-500/50 transition-all text-black dark:text-white" />
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <div className="p-2 bg-gray-50 dark:bg-[#111] rounded-lg border border-gray-200 dark:border-white/5 text-gray-400 cursor-pointer hover:text-black dark:hover:text-white transition-colors relative"><Bell size={18} /><span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full border-2 border-white dark:border-black" /></div>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-100 dark:border-white/5">
                <div className="text-right hidden sm:block"><div className="text-xs font-bold text-black dark:text-white">{userData?.name || 'Developer'}</div><div className="text-[9px] text-gray-500 uppercase tracking-widest">Free Plan</div></div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">{userData?.name?.charAt(0) || 'U'}</div>
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' ? (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <section className="relative p-8 md:p-12 rounded-[2.5rem] bg-indigo-600/5 dark:bg-linear-to-br dark:from-indigo-900/20 dark:via-transparent dark:to-transparent border border-indigo-100 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-2xl">
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                      <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-white mb-3 tracking-tighter italic">Welcome back, {userData?.name?.split(' ')[0]}</h2>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md text-sm font-light leading-relaxed">Your readiness score is looking sharp for <span className="text-black dark:text-white font-medium">{selectedRole}</span> roles.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                      <div className="bg-white/80 dark:bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-gray-200 dark:border-white/5 flex items-center gap-4">
                         <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="bg-transparent text-[10px] font-black uppercase outline-none text-black dark:text-white cursor-pointer px-4">
                           <option value="Frontend Developer" className="bg-white dark:bg-[#111]">Frontend Developer</option>
                           <option value="Backend Developer" className="bg-white dark:bg-[#111]">Backend Developer</option>
                           <option value="Software Engineer" className="bg-white dark:bg-[#111]">Software Engineer</option>
                           <option value="Fullstack Developer" className="bg-white dark:bg-[#111]">Fullstack Developer</option>
                           <option value="Cloud Engineer" className="bg-white dark:bg-[#111]">Cloud Engineer</option>
                           <option value="Site Reliability Engineer" className="bg-white dark:bg-[#111]">Site Reliability Engineer</option>
                           <option value="Security Engineer" className="bg-white dark:bg-[#111]">Security Engineer</option>
                           <option value="Mobile App Developer" className="bg-white dark:bg-[#111]">Mobile App Developer</option>
                           <option value="DevOps Engineer" className="bg-white dark:bg-[#111]">DevOps Engineer</option>
                           <option value="Game Developer" className="bg-white dark:bg-[#111]">Game Developer</option>
                           <option value="AI/ML Engineer" className="bg-white dark:bg-[#111]">AI/ML Engineer</option>
                           <option value="Data Scientists" className="bg-white dark:bg-[#111]">Data Scientists</option>
                           <option value="Product Manager" className="bg-white dark:bg-[#111]">Product Manager</option>
                           <option value="Project Designer" className="bg-white dark:bg-[#111]">Project Designer</option>
                           <option value="Business Analyst" className="bg-white dark:bg-[#111]">Business Analyst</option>
                           <option value="Technical Recruiter" className="bg-white dark:bg-[#111]">Technical Recruiter</option>
                         </select>
                         <button onClick={() => onNewCall(selectedRole)} className="px-8 py-4 bg-indigo-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-xl hover:bg-indigo-500 transition-all shadow-lg flex items-center gap-2">Start Session <ChevronRight size={15} /></button>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <QuickActionCard icon={<Mic className="text-indigo-500 dark:text-indigo-400" />} title="Start Interview" description="Live audio simulation" onClick={() => onNewCall(selectedRole)} highlight />
                  <QuickActionCard icon={<FileCheck className="text-purple-500 dark:text-purple-400" />} title="Resume Prep" description="Assessment & Grade" onClick={() => setActiveTab('resume')} />
                  <QuickActionCard icon={<Building2 className="text-purple-500 dark:text-purple-400" />} title="Company Prep" description="AI Candidate Evaluation" onClick={() => setActiveTab('company')} />
                </section>

                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 lg:col-span-8 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8">
                    <div className="h-62.5 w-full min-h-0"><ResponsiveContainer width="100%" aspect={3}><LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} /><XAxis dataKey="date" stroke="#999" fontSize={10} tickLine={false} axisLine={false} /><YAxis domain={[0, 100]} hide /><Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px', color: '#fff' }} /><Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} /></LineChart></ResponsiveContainer></div>
                  </div>
                  <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8"><h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-6"><Sparkles size={14} className="text-indigo-500 dark:text-indigo-400" /> Career Readiness</h4><div className="space-y-6"><ProgressStat label="Technical Depth" value={78} /><ProgressStat label="Communication" value={92} /><ProgressStat label="Logical Reasoning" value={64} /></div></div>
                  </div>
                </div>

                <div className="col-span-12 space-y-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500 px-4"><History size={14} /> Session Log</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...interviews].reverse().slice(0, 4).map((session: any, index: number) => (
                      <HistoryItem 
                        key={session.id || session._id || index} 
                        data={session} 
                        type="interview" 
                        onClick={() => setSelectedReport(session)}
                        onDelete={(e: React.MouseEvent) => handleDeleteClick(e, session.id || session._id, 'interview')}
                      />
                    ))}
                  </div>
                  {interviews.length > 4 && (
                    <button onClick={() => setActiveTab('history')} className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors border border-dashed border-gray-200 dark:border-white/10 rounded-2xl">View All Sessions</button>
                  )}
                </div>
              </motion.div>
            ) : activeTab === 'resume' ? (
              <ResumeLab key="resume" onBack={() => setActiveTab('dashboard')} selectedRole={selectedRole} fetchProfile={fetchProfile}/>
            ) : activeTab === 'company' ? (
              <CompanyPrep key="company" selectedRole={selectedRole} />
            ) : (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-12 pb-20">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold italic tracking-tighter text-black dark:text-white">Your Archives</h2>
                <button onClick={() => setActiveTab('dashboard')} className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white">Close History</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 px-4"><Mic size={14} /> Interview Sessions</h4>
                    <div className="space-y-4">
                      {interviews.length > 0 ? [...interviews].reverse().map((s) => (
                        <HistoryItem key={s.id || s._id} data={s} type="interview" onClick={() => setSelectedReport(s)} onDelete={(e: React.MouseEvent) => handleDeleteClick(e, s.id || s._id, 'interview')} />
                      )) : <p className="text-gray-400 dark:text-gray-600 italic text-sm px-4">No interviews yet.</p>}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-purple-500 px-4"><FileText size={14} /> Resume Assessments</h4>
                    <div className="space-y-4">
                      {resumes.length > 0 ? [...resumes].reverse().map((r) => (
                        <HistoryItem key={r.id || r._id} data={r} type="resume" onClick={() => setSelectedResume(r)} onDelete={(e: React.MouseEvent) => handleDeleteClick(e, r.id || r._id, 'resume')} />
                      )) : <p className="text-gray-400 dark:text-gray-600 italic text-sm px-4">No resumes yet.</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>{deleteModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteModal({ isOpen: false, id: null })} className="absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-md" /><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl"><AlertCircle size={40} className="mx-auto text-red-500 mb-6" /><h3 className="text-xl font-bold mb-2 text-black dark:text-white">Delete {deleteModal.type === 'interview' ? 'Session' : 'Resume'}?</h3><div className="flex gap-4 mt-6"><button onClick={() => setDeleteModal({ isOpen: false, id: null })} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-[10px] font-black uppercase text-black dark:text-white">Cancel</button><button onClick={confirmDelete} className="flex-1 py-3 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase">Delete</button></div></motion.div></div>
      )}</AnimatePresence>
    </div>
  );
}

// --- HELPER COMPONENTS (💡 TRANSITION HOVER FIX COMPLETED HERE) ---
function HistoryItem({ data, onClick, onDelete, type }: any) {
  const isInterview = type === 'interview';
  return (
    <motion.div 
      onClick={onClick} 
      whileHover={{ x: 4 }} 
      className="p-5 rounded-4xl bg-gray-50 dark:bg-[#111] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-center justify-between group cursor-pointer transition-colors duration-300"
    >
      <div className="flex items-center gap-5">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold italic transition-all ${isInterview ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white' : 'bg-purple-500/10 border border-purple-500/20 text-purple-500 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white'}`}>
          {data.score}%
        </div>
        <div>
          <h5 className="font-bold text-sm tracking-tight text-black dark:text-white">{isInterview ? (data.verdict || "Session") : (data.fileName || "Resume")}</h5>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest italic">{data.role}</span>
            <span className="text-[12px] text-gray-200 dark:text-gray-800">/</span>
            <span className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">{new Date(data.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onDelete} className="p-3 text-gray-300 dark:text-gray-700 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
        <ChevronRight size={16} className="text-gray-300 dark:text-gray-800 group-hover:text-black dark:group-hover:text-white transition-colors" />
      </div>
    </motion.div>
  );
}

function QuickActionCard({ icon, title, description, onClick, highlight = false }: any) {
  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} onClick={onClick} className={`cursor-pointer p-6 rounded-4xl border transition-all hover:bg-black/[0.01] dark:hover:bg-white/[0.01] flex items-center gap-5 ${highlight ? 'bg-indigo-600/5 border-indigo-500/10 dark:border-indigo-500/20 shadow-sm' : 'bg-gray-50 dark:bg-[#111] border-gray-100 dark:border-white/5'}`}><div className="p-4 rounded-2xl bg-white dark:bg-white/5 shadow-sm dark:shadow-none">{icon}</div><div><h5 className="font-bold text-sm text-black dark:text-white">{title}</h5><p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase">{description}</p></div><ChevronRight size={16} className="ml-auto text-gray-300 dark:text-gray-700" /></motion.div>
  );
}

function SidebarLink({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10' : 'text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'}`}>{icon}<span className="text-[11px] font-bold tracking-tight">{label}</span></div>
  );
}

function ProgressStat({ label, value }: { label: string, value: number }) {
  return (
    <div><div className="flex justify-between items-center mb-2"><span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-tight">{label}</span><span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400">{value}%</span></div><div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className="h-full bg-indigo-600 dark:bg-indigo-500" /></div></div>
  );
}