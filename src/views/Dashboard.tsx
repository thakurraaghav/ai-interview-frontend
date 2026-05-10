import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, History, Calendar, Target, Award, ChevronRight, 
  ChevronLeft, LogOut, Trash2, Briefcase, TrendingUp,
  MessageSquare, Sparkles, AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

interface Props { onNewCall: (role: string) => void; }

// --- REUSABLE CUSTOM MODAL ---
function Modal({ isOpen, title, message, confirmLabel, onConfirm, onCancel, variant = 'info' }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-[#0A0A0A] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10"
          >
            <div className="flex items-center gap-3 mb-4">
              {variant === 'danger' && <AlertCircle className="text-red-500" size={24} />}
              <h3 className="text-xl font-bold tracking-tight italic text-white">{title}</h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">{message}</p>
            
            <div className="flex gap-3">
              <button 
                onClick={onCancel}
                className="flex-1 py-3 rounded-full bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all text-white"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  variant === 'danger' ? 'bg-red-500 text-white' : 'bg-white text-black'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function Dashboard({ onNewCall }: Props) {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState("Fullstack Developer");
  
  // Modal State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({ 
    isOpen: false, 
    id: null 
  });

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

  // Triggered when clicking Trash icon
  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, id });
  };

  // Triggered inside the Modal Confirm button
  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      const res = await fetch(`http://localhost:3000/api/interview/${deleteModal.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setUserData({ 
          ...userData, 
          interviews: userData.interviews.filter((s: any) => s.id !== deleteModal.id) 
        });
      }
    } catch (err) { console.error(err); }
    setDeleteModal({ isOpen: false, id: null });
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  const interviews = userData?.interviews || [];
  const trendData = [...interviews].reverse().map(s => ({
    date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: s.score
  })).slice(-10);

  // --- DETAIL VIEW ---
  if (selectedReport) {
    const skillsData = selectedReport.skills ? [
      { subject: 'Technical', A: selectedReport.skills.technical, fullMark: 100 },
      { subject: 'Communication', A: selectedReport.skills.communication, fullMark: 100 },
      { subject: 'Logic', A: selectedReport.skills.logic, fullMark: 100 },
      { subject: 'Confidence', A: selectedReport.skills.confidence, fullMark: 100 },
      { subject: 'Conciseness', A: selectedReport.skills.conciseness, fullMark: 100 },
    ] : null;

    return (
      <div className="min-h-screen bg-[#050505] text-white p-8 md:p-20">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => setSelectedReport(null)} className="group mb-12 flex items-center gap-2 text-gray-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-[0.3em]">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          
          <header className="mb-16">
            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
              {selectedReport.role || "General Interview"}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter italic mb-4 text-white">Session Analysis</h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 p-12 rounded-[3.5rem] bg-indigo-600">
               <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Readiness</span>
               <div className="text-8xl font-bold mt-4 tracking-tighter">{selectedReport.score}%</div>
            </div>
            
            <div className="md:col-span-2 p-12 rounded-[3.5rem] bg-white/3 border border-white/10 backdrop-blur-3xl flex items-center">
               <div className="text-2xl md:text-4xl font-bold italic tracking-tight text-indigo-400 leading-tight">
                 {selectedReport.verdict || "Analysis Pending"}
               </div>
            </div>

            {/* Radar Chart Section */}
            <div className="md:col-span-3 p-12 rounded-[3.5rem] bg-white/1 border border-white/5 flex flex-col items-center">
              <span className="w-full text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8">Skill Breakdown</span>
              {skillsData ? (
                <div className="w-full h-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                      <PolarGrid stroke="#333" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 'bold' }} />
                      <Radar name="Performance" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-600 italic">Visual metrics unavailable for this session.</p>
              )}
            </div>

            {/* Transcript Highlight Section */}
            <div className="md:col-span-3 p-12 rounded-[3.5rem] bg-white/1 border border-white/5">
              <div className="flex items-center gap-2 mb-10 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
                <MessageSquare size={14} /> Transcript & AI Insights
              </div>
              
              <div className="space-y-10">
                {(selectedReport.transcript || []).length > 0 ? (
                  selectedReport.transcript.map((entry: any, i: number) => (
                    <div key={i} className={`flex flex-col ${entry.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] p-6 rounded-4xl ${
                        entry.role === 'user' 
                          ? 'bg-indigo-600/10 border border-indigo-500/20 text-white' 
                          : 'bg-white/3 border border-white/5 text-gray-400'
                      }`}>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2 block">
                          {entry.role === 'user' ? 'You' : 'Hannah'}
                        </span>
                        <p className="text-lg font-light leading-relaxed">{entry.content}</p>
                      </div>
                      
                      {entry.critique && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          className="mt-4 mr-6 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl max-w-[70%] flex gap-3 items-start"
                        >
                          <Sparkles size={14} className="text-emerald-500 mt-1 shrink-0" />
                          <p className="text-xs text-emerald-400 italic leading-relaxed">
                            {entry.critique}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 italic text-center py-10">Transcript not recorded for this session.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-16">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter italic">Hello, <span className="text-indigo-500 font-semibold not-italic">{userData?.name || 'Developer'}</span></h1>
            <p className="text-gray-500 mt-2 font-light">Track your progress and master your interviews.</p>
          </div>
          <div className="flex flex-wrap gap-4 items-center bg-white/3 p-2 rounded-4xl border border-white/10 backdrop-blur-3xl">
            <div className="flex items-center gap-3 px-6 py-2 border-r border-white/10">
               <Briefcase size={16} className="text-indigo-500" />
               <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="bg-transparent text-[10px] font-black uppercase outline-none text-white cursor-pointer">
                 <option value="Frontend Developer" className="bg-[#050505]">Frontend Developer</option>
                 <option value="Backend Developer" className="bg-[#050505]">Backend Developer</option>
                 <option value="Fullstack Developer" className="bg-[#050505]">Fullstack Developer</option>
                 <option value="Product Manager" className="bg-[#050505]">Product Manager</option>
                 <option value="UI/UX Designer" className="bg-[#050505]">UI/UX Designer</option>
               </select>
            </div>
            <button onClick={() => onNewCall(selectedRole)} className="px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-all text-[11px] uppercase tracking-widest">New Session</button>
            <button onClick={handleLogout} className="p-4 bg-white/5 rounded-full hover:bg-red-500/20 transition-colors group"><LogOut size={18} className="text-gray-400 group-hover:text-red-500" /></button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard icon={<Target className="text-indigo-400" />} label="Avg Readiness" value={`${Math.round(interviews.reduce((acc: number, curr: any) => acc + (curr.score || 0), 0) / (interviews.length || 1))}%`} />
          <StatCard icon={<History className="text-purple-400" />} label="Total Rounds" value={interviews.length} />
          <StatCard icon={<Award className="text-emerald-400" />} label="Top Verdict" value={<span className="truncate block max-w-50">{interviews[0]?.verdict || "N/A"}</span>} />
        </div>

        {interviews.length > 1 && (
          <section className="mb-20">
            <div className="flex items-center gap-2 mb-8 px-4 text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">
              <TrendingUp size={14} /> Performance Trend
            </div>
            <div className="w-full h-75 p-8 rounded-[3rem] bg-white/1 border border-white/5">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="date" stroke="#444" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis domain={[0, 100]} stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, fill: '#6366f1' }} animationDuration={2000} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 tracking-tight"><Calendar size={20} className="text-indigo-500" /> Performance History</h3>
          {[...interviews].reverse().map((session: any, index: number) => (
            <motion.div key={session.id || index} onClick={() => setSelectedReport(session)} whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.03)" }} className="p-6 rounded-[2.5rem] bg-white/1 border border-white/5 flex items-center justify-between group cursor-pointer transition-all">
              <div className="flex items-center gap-8">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-xl border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  {session.score}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-lg leading-none">{session.verdict || "Session Analysis"}</h4>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] font-black text-gray-500 uppercase tracking-widest">{session.role}</span>
                  </div>
                  <p className="text-sm text-gray-500 italic line-clamp-1">"{session.feedback || "Feedback loading..."}"</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => handleDeleteClick(e, session.id)} // 👈 Updated this
                  className="p-3 rounded-xl hover:bg-red-500/10 text-gray-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>
                <ChevronRight className="text-gray-700 group-hover:text-indigo-500 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- DELETE MODAL --- */}
      <Modal 
        isOpen={deleteModal.isOpen}
        title="Delete Session?"
        message="This will permanently remove this session and all its analysis from your profile. This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
      />
    </div>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="p-8 rounded-[3rem] bg-white/1 border border-white/5 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-white/5">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{label}</span>
      </div>
      <div className="text-5xl font-bold tracking-tighter">{value}</div>
    </div>
  );
}