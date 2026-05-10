import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Globe } from 'lucide-react';

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
        // Store token for persistent sessions
        localStorage.setItem('token', data.token);
        // Update global app state
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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Visual Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/3 border border-white/10 backdrop-blur-3xl rounded-[3rem] p-10 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter mb-2 italic">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 text-sm font-light">
              {isLogin ? 'Enter your credentials to access your dashboard.' : 'Join the elite circle of technical masters.'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <AuthInput 
                icon={<User size={18} />} 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                required
              />
            )}
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
              className="w-full py-4 bg-white text-black rounded-2xl font-bold mt-6 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')} 
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
            <button className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-3">
              <Globe size={18}/>  Continue with GitHub
            </button>
            
            <p className="text-center text-sm text-gray-500">
              {isLogin ? "New to the platform?" : "Already have an account?"}{' '}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-400 font-bold hover:underline ml-1"
              >
                {isLogin ? 'Join now' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
        
        <button 
          onClick={onBack} 
          className="w-full mt-8 text-xs font-bold uppercase tracking-[0.2em] text-gray-600 hover:text-white transition-colors"
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}

// Reusable Input Component with that "Apple" Minimalist style
function AuthInput({ icon, ...props }: any) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors">
        {icon}
      </div>
      <input 
        {...props}
        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-600"
      />
    </div>
  );
}