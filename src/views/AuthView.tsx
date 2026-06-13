import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Globe, ChevronLeft, ShieldCheck } from 'lucide-react';

interface Props { 
  onAuthSuccess: (user: any) => void; 
  onBack: () => void; 
}

export default function AuthView({ onAuthSuccess, onBack }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        onAuthSuccess(data.user);
      } else {
        alert(data.message || "Something went wrong. Please check your details.");
      }
    } catch (error) {
      console.error("Auth Connection Error:", error);
      alert("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#FAF9F6] flex items-center justify-center p-6 relative overflow-hidden font-sans tracking-tight transition-colors duration-500">
      
      {/* ARCHITECTURAL STRUCTURAL LINES */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-[#0A0A0A]/3 dark:bg-white/2 pointer-events-none" />
      <div className="absolute top-0 left-3/4 w-px h-full bg-[#0A0A0A]/3 dark:bg-white/2 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-112.5 relative z-10"
      >
        {/* --- DYNAMIC APALING THEMED CARD CONTAINER --- */}
        <div className="bg-white dark:bg-[#111111]/60 border border-[#0A0A0A]/5 dark:border-white/5 rounded-[2.5rem] p-10 md:p-14 shadow-xl dark:shadow-none backdrop-blur-xl transition-colors duration-500">
          
          {/* HEADER LAYER */}
          <div className="mb-10 text-left">
            <button 
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-mono text-[9px] font-bold uppercase tracking-[0.25em] mb-8 transition-colors cursor-pointer"
            >
              <ChevronLeft size={12} /> Back to main
            </button>
            
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#0A0A0A] dark:text-[#FAF9F6]">
              {isLogin ? 'Welcome Back.' : 'Get Started.'}
            </h2>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-2 font-normal leading-relaxed">
              {isLogin 
                ? 'Sign in to jump straight back into your interview workspace.' 
                : 'Create an account to begin engineering your preparation loops.'}
            </p>
          </div>

          {/* INPUT FORM */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <AuthInput 
                    icon={<User size={15} />} 
                    type="text" 
                    placeholder="Your Full Name" 
                    value={name}
                    onChange={(e: any) => setName(e.target.value)}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AuthInput 
              icon={<Mail size={15} />} 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
            />
            
            <AuthInput 
              icon={<Lock size={15} />} 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
            />
            
            <button 
              disabled={loading}
              className="group w-full py-4.5 bg-[#0A0A0A] dark:bg-[#FAF9F6] text-[#FAF9F6] dark:text-[#0A0A0A] rounded-sm font-black uppercase text-[10px] tracking-[0.25em] mt-6 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-98 cursor-pointer shadow-xs"
            >
              {loading ? 'Verifying...' : (isLogin ? 'Continue' : 'Create Account')} 
              {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* DIVIDER HAIRLINE */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#0A0A0A]/5 dark:border-white/5"></span>
            </div>
            <div className="relative flex justify-center text-[8px] font-mono font-bold uppercase tracking-[0.3em]">
              <span className="bg-white dark:bg-[#111111] px-4 text-gray-400 dark:text-gray-500 transition-colors duration-500">Verification</span>
            </div>
          </div>

          {/* ACCESS PLATFORMS */}
          <div className="space-y-6">
            <button className="w-full py-4 rounded-sm bg-[#0A0A0A]/5 dark:bg-white/5 border border-transparent text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#0A0A0A] dark:hover:bg-[#FAF9F6] hover:text-[#FAF9F6] dark:hover:text-[#0A0A0A] transition-all flex items-center justify-center gap-3 text-gray-500 dark:text-gray-400 cursor-pointer">
              <Globe size={14}/> Sync Github Profile
            </button>
            
            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              {isLogin ? "New to RecruitAI?" : "Have an account?"}{' '}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-black tracking-normal transition-colors ml-1 uppercase cursor-pointer"
              >
                {isLogin ? 'Register Here' : 'Log In Instead'}
              </button>
            </p>
          </div>
        </div>
        
        {/* INTERFACE PROTOCOL FOOTER */}
        <div className="w-full mt-8 text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-gray-500 dark:text-gray-600 flex items-center justify-center gap-2 pointer-events-none">
          <ShieldCheck size={13} /> Security standard verification
        </div>
      </motion.div>
    </div>
  );
}

// --- DYNAMIC CONTROLLED HOVER INPUT FIELD ---
function AuthInput({ icon, ...props }: any) {
  return (
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-300 pointer-events-none">
        {icon}
      </div>
      <input 
        {...props}
        className="w-full bg-[#0A0A0A]/5 dark:bg-white/5 border border-transparent rounded-sm py-4.5 pl-13 pr-6 text-xs text-[#0A0A0A] dark:text-[#FAF9F6] focus:outline-none focus:border-indigo-600/30 focus:bg-white dark:focus:bg-[#0A0A0A] transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 placeholder:font-medium tracking-tight"
      />
    </div>
  );
}