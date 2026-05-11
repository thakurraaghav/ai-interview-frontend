import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Globe, Zap, ShieldCheck } from 'lucide-react';

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
        alert(data.message || "Authentication failed. Please try again.");
      }
    } catch (error) {
      console.error("Auth Connection Error:", error);
      alert("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* 1. RESPONSIVE BACKGROUND LIGHTING */}
      <div className="absolute top-[-5%] left-[-5%] w-[60%] sm:w-[40%] h-[40%] bg-indigo-600/10 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[50%] sm:w-[30%] h-[30%] bg-indigo-900/10 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="bg-[#0A0A0A] border border-white/5 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-12 shadow-2xl">
          
          {/* HEADER - Adjusted for mobile */}
          <div className="text-center mb-8 sm:mb-10">
            <motion.div 
              className="inline-flex p-3 rounded-2xl bg-indigo-600/10 text-indigo-500 mb-5 sm:mb-6 border border-indigo-500/20 shadow-lg shadow-indigo-500/5"
            >
              <Zap size={24} fill="currentColor" className="sm:w-7 sm:h-7" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-2 italic">
              {isLogin ? 'Access Portal' : 'Create Identity'}
            </h2>
            <p className="text-gray-500 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
              {isLogin ? 'Initialize Session' : 'Register Credentials'}
            </p>
          </div>

          {/* FORM */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AuthInput 
                    icon={<User size={18} />} 
                    type="text" 
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e: any) => setName(e.target.value)}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AuthInput 
              icon={<Mail size={18} />} 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
            />
            
            <AuthInput 
              icon={<Lock size={18} />} 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
            />
            
            <button 
              disabled={loading}
              className="group w-full py-4 sm:py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] sm:text-[11px] tracking-[0.3em] mt-6 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 shadow-lg"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Join Now')} 
              {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="relative my-8 sm:my-10">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
              <span className="bg-[#0A0A0A] px-4 text-gray-600">Secure Protocol</span>
            </div>
          </div>

          {/* SECONDARY ACTIONS */}
          <div className="space-y-4 sm:space-y-6">
            <button className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-gray-400 hover:text-white">
              <Globe size={16}/> GitHub Sync
            </button>
            
            <p className="text-center text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-gray-600">
              {isLogin ? "No account?" : "Existing user?"}{' '}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-400 hover:text-indigo-300 transition-colors ml-1"
              >
                {isLogin ? 'Initialize' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
        
        {/* FOOTER */}
        <button 
          onClick={onBack} 
          className="w-full mt-8 sm:mt-10 text-[10px] font-black uppercase tracking-[0.4em] text-gray-700 hover:text-indigo-400 transition-colors flex items-center justify-center gap-2"
        >
          <ShieldCheck size={14} /> Back to Home
        </button>
      </motion.div>
    </div>
  );
}

function AuthInput({ icon, ...props }: any) {
  return (
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors duration-300">
        {icon}
      </div>
      <input 
        {...props}
        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 sm:py-5 pl-14 pr-6 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] transition-all placeholder:text-gray-700 placeholder:font-medium tracking-tight"
      />
    </div>
  );
}