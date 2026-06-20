import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History, ChevronRight,
  ChevronLeft, LogOut, Mic, Building2,
  Sparkles, FileCheck, AlertCircle, File, LayoutDashboard,
  Zap, Search, Bell, Settings, Loader2, CheckCircle,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

import ReportView from './ReportView';
import CompanyPrep from '../components/CompanyPrep';
import ThemeToggle from '../components/ThemeToggle';
import ResumeLab from '../components/ResumeLab';
import HistoryItem from '../components/HistoryItem';
import { apiFetch } from '../lib/api';
import type { UserProfile, InterviewSession, ResumeSession } from '../types';

// --- MAIN DASHBOARD ---
interface DashboardProps {
  onNewCall: (role: string) => void;
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Dashboard({ onNewCall, isDark, setIsDark }: DashboardProps) {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [slowLoading, setSlowLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<InterviewSession | null>(null);
  const [selectedRole, setSelectedRole] = useState("Fullstack Developer");
  const [activeTab, setActiveTab] = useState<'dashboard' | 'resume' | 'history' | 'company'>('dashboard');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null; type?: 'interview' | 'resume' }>({ isOpen: false, id: null });
  const [selectedResume, setSelectedResume] = useState<ResumeSession | null>(null);

  useEffect(() => { fetchProfile(); }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => setSlowLoading(true), 3000);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const fetchProfile = async () => {
    try {
      const response = await apiFetch('/api/auth/profile');
      const data = await response.json();
      setUserData(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.removeItem('token'); window.location.reload(); };

  const handleDeleteClick = (e: React.MouseEvent, id: string | undefined, type: 'interview' | 'resume') => {
    e.stopPropagation();
    if (id) setDeleteModal({ isOpen: true, id, type });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    const endpoint = deleteModal.type === 'interview'
      ? `/api/interview/${deleteModal.id}`
      : `/api/resume/${deleteModal.id}`;

    try {
      const res = await apiFetch(endpoint, {
        method: 'DELETE'
      });
      if (res.ok && userData) {
        if (deleteModal.type === 'interview') {
          setUserData({ ...userData, interviews: userData.interviews.filter((s) => (s.id || s._id) !== deleteModal.id) });
        } else {
          setUserData({ ...userData, resumes: userData.resumes.filter((s) => (s.id || s._id) !== deleteModal.id) });
        }
      }
    } catch (err) { console.error(err); }
    setDeleteModal({ isOpen: false, id: null });
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-white dark:bg-black text-black dark:text-white">
      <Loader2 className="animate-spin w-8 h-8 text-indigo-500" />
      <AnimatePresence>
        {slowLoading && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-gray-500 max-w-xs text-center"
          >
            Waking up the server, this may take up to 50 seconds on the free tier...
          </motion.p>
        )}
      </AnimatePresence>
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
    <div className="flex h-screen bg-[#FAF9F6] dark:bg-[#0c1324] text-black dark:text-[#dce1fb] overflow-hidden font-sans selection:bg-indigo-500/30 transition-colors duration-300 relative">
      {/* 🌌 Dashboard Background Grid (visible in dark mode) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-0 dark:opacity-20 transition-opacity duration-500">
        <svg className="w-full h-full" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern height="40" id="dash-grid" patternUnits="userSpaceOnUse" width="40">
              <path className="text-[#464555]" d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
            </pattern>
          </defs>
          <rect fill="url(#dash-grid)" height="100%" width="100%"></rect>
        </svg>
      </div>
      <aside className="w-64 border-r border-gray-100 dark:border-white/5 bg-white dark:bg-[#151b2d] flex flex-col p-6 lg:flex shrink-0 relative z-10 transition-colors duration-500 shadow-xl">
        <div className="mb-10 px-2 flex items-center gap-2 text-indigo-500 dark:text-[#c3c0ff] font-black tracking-tighter text-2xl italic">
          <Zap size={24} fill="currentColor" className="text-indigo-500 dark:text-[#4edea3]" /> Recruit AI
        </div>
        <nav className="space-y-2 flex-1">
          <SidebarLink icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarLink icon={<History size={18} />} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          <SidebarLink icon={<File size={18} />} label="Resume assessment" active={activeTab === 'resume'} onClick={() => setActiveTab('resume')} />
          <SidebarLink icon={<Building2 size={18} />} label="Company Preparation" active={activeTab === 'company'} onClick={() => setActiveTab('company')} />
          <SidebarLink icon={<Settings size={18} />} label="Settings" />
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5 space-y-4">
          <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
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
              <input type="text" placeholder="Search sessions..." className="w-full bg-gray-50 dark:bg-[#151b2d]/50 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-indigo-500/50 transition-all text-black dark:text-white backdrop-blur-md" />
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
                <section className="relative p-8 md:p-12 rounded-[2.5rem] bg-indigo-600/5 dark:bg-[#151b2d]/80 backdrop-blur-2xl border border-indigo-100 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-colors duration-500">
                  <div className="absolute top-[-50%] right-[-10%] w-[100%] h-[200%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 dark:from-[#c3c0ff]/10 to-transparent opacity-50 blur-[80px] pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                      <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-[#c3c0ff] mb-3 tracking-tighter italic">Welcome back, {userData?.name?.split(' ')[0]}</h2>
                      <p className="text-gray-500 dark:text-[#c7c4d8] max-w-md text-sm font-light leading-relaxed">Your readiness score is looking sharp for <span className="text-black dark:text-white font-medium">{selectedRole}</span> roles.</p>
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

                <div className="grid grid-cols-12 gap-6 relative z-10">
                  <div className="col-span-12 lg:col-span-8 bg-white dark:bg-[#151b2d]/80 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm dark:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)] transition-colors duration-500">
                    <div className="h-62.5 w-full min-h-0"><ResponsiveContainer width="100%" aspect={3}><LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} /><XAxis dataKey="date" stroke="#999" fontSize={10} tickLine={false} axisLine={false} /><YAxis domain={[0, 100]} hide /><Tooltip contentStyle={{ backgroundColor: '#151b2d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#dce1fb' }} /><Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} /></LineChart></ResponsiveContainer></div>
                  </div>
                  <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-[#151b2d]/80 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm dark:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)] transition-colors duration-500"><h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-[#c7c4d8] mb-6"><Sparkles size={14} className="text-indigo-500 dark:text-[#4edea3]" /> Career Readiness</h4><div className="space-y-6"><ProgressStat label="Technical Depth" value={78} /><ProgressStat label="Communication" value={92} /><ProgressStat label="Logical Reasoning" value={64} /></div></div>
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
              <ResumeLab key="resume" onBack={() => setActiveTab('dashboard')} selectedRole={selectedRole} fetchProfile={fetchProfile} />
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
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteModal({ isOpen: false, id: null })} className="absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-md" /><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl"><AlertCircle size={40} className="mx-auto text-red-500 mb-6" /><h3 className="text-xl font-bold mb-2 text-black dark:text-white">Delete {deleteModal.type === 'interview' ? 'Session' : 'Resume'}?</h3><div className="flex gap-4 mt-6"><button onClick={() => setDeleteModal({ isOpen: false, id: null })} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-[10px] font-black uppercase text-black dark:text-white">Cancel</button><button onClick={confirmDelete} className="flex-1 py-3 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase">Delete</button></div></motion.div></div>
      )}</AnimatePresence>
    </div>
  );
}

// --- HELPER COMPONENTS (💡 TRANSITION HOVER FIX COMPLETED HERE) ---

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  highlight?: boolean;
}

function QuickActionCard({ icon, title, description, onClick, highlight = false }: QuickActionCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} onClick={onClick} className={`cursor-pointer p-6 rounded-4xl border transition-all duration-300 flex items-center gap-5 ${highlight ? 'bg-indigo-600/5 dark:bg-[#4f46e5]/10 border-indigo-500/10 dark:border-[#4f46e5]/20 shadow-sm dark:shadow-[0_10px_20px_-10px_rgba(79,70,229,0.3)]' : 'bg-white dark:bg-[#151b2d]/80 backdrop-blur-xl hover:bg-gray-50 dark:hover:bg-[#151b2d] border-gray-100 dark:border-white/10 shadow-sm dark:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)]'}`}><div className={`p-4 rounded-2xl shadow-sm dark:shadow-none ${highlight ? 'bg-indigo-500/10 dark:bg-[#4f46e5]/20' : 'bg-gray-50 dark:bg-white/5'}`}>{icon}</div><div><h5 className="font-bold text-sm text-black dark:text-[#dce1fb]">{title}</h5><p className="text-[10px] text-gray-400 dark:text-[#918fa1] font-medium uppercase">{description}</p></div><ChevronRight size={16} className="ml-auto text-gray-300 dark:text-[#464555]" /></motion.div>
  );
}

function SidebarLink({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors duration-200 border ${active
          ? 'bg-indigo-600/10 text-indigo-600 dark:bg-white/5 dark:text-[#c3c0ff] border-indigo-500/10 dark:border-white/5 shadow-sm'
          : 'text-gray-400 dark:text-[#918fa1] hover:text-black dark:hover:text-[#dce1fb] hover:bg-gray-50 dark:hover:bg-white/5 border-transparent'
        }`}
    >
      {icon}
      <span className="text-[11px] font-bold tracking-tight">{label}</span>
    </div>
  );
}

function ProgressStat({ label, value }: { label: string, value: number }) {
  return (
    <div><div className="flex justify-between items-center mb-2"><span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-tight">{label}</span><span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400">{value}%</span></div><div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className="h-full bg-indigo-600 dark:bg-indigo-500" /></div></div>
  );
}