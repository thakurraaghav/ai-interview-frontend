import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './views/LandingPage';
import CallView from './views/CallView';
import ReportView from './views/ReportView';
import Dashboard from './views/Dashboard';
import AuthView from './views/AuthView';

export type ViewState = "landing" | "auth" | "call" | "report" | "dashboard";

function App() {
  const [view, setView] = useState<ViewState>("landing");
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  
  // 💡 GLOBAL PERSISTENT THEME STATE
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true; // Defaulting to dark mode
  });

  // Sync state modifications with HTML system root class tokens
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ name: "User" });
      setView("dashboard");
    }
  }, []);

  const handleFinishInterview = (data: any) => {
    setReportData(data);
    setView("report");
  };

  const handleGetStarted = () => {
    if (user) {
      setView("call");
    } else {
      setView("auth");
    }
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white font-sans selection:bg-indigo-500/30 transition-colors duration-500">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {view === "landing" && (
            <LandingPage 
              onStart={handleGetStarted} 
              isDark={isDark} 
              setIsDark={setIsDark} 
            />
          )}

          {view === "auth" && (
            <AuthView 
              onAuthSuccess={(userData: any) => {
                setUser(userData);
                setView("dashboard");
              }} 
              onBack={() => setView("landing")} 
            />
          )}

          {view === "call" && (
            <CallView 
              onEnd={handleFinishInterview} 
              onBack={() => setView(user ? "dashboard" : "landing")} 
            />
          )}

          {view === "report" && (
            <ReportView 
              data={reportData} 
              onDashboard={() => setView("dashboard")} 
            />
          )}

          {view === "dashboard" && (
            <Dashboard 
              onNewCall={() => setView("call")}
              isDark={isDark} 
              setIsDark={setIsDark} 
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;