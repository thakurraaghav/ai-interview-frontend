import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './views/LandingPage';
import CallView from './views/CallView';
import ReportView from './views/ReportView';
import Dashboard from './views/Dashboard';
import AuthView from './views/AuthView';

// 1. Defining all possible "Screens" in our app
export type ViewState = "landing" | "auth" | "call" | "report" | "dashboard";

function App() {
  const [view, setView] = useState<ViewState>("landing");
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    // In a production app, you'd verify the token with the backend here.
    // For now, we'll assume if the token exists, the user is valid.
    setUser({ name: "User" }); // You can later fetch real user profile data
    setView("dashboard");
  }
}, []);

  // Transition from Interview -> Report
  const handleFinishInterview = (data: any) => {
    setReportData(data);
    setView("report");
  };

  // Logic for the Hero Button
  const handleGetStarted = () => {
    if (user) {
      setView("call");
    } else {
      setView("auth");
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-indigo-500/30">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {view === "landing" && (
            <LandingPage onStart={handleGetStarted} />
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
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;