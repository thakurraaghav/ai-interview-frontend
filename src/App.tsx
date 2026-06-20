import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';
import { apiFetch } from './lib/api';

import LandingPage from './views/LandingPage';
const CallView = lazy(() => import('./views/CallView'));
const ReportView = lazy(() => import('./views/ReportView'));
const Dashboard = lazy(() => import('./views/Dashboard'));
const AuthView = lazy(() => import('./views/AuthView'));

function App() {
  const { isDark, setTheme } = useThemeStore();
  const { isAuthenticated, setUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Sync state modifications with HTML system root class tokens
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    // 💡 Wake up the Render backend in the background immediately
    apiFetch('/').catch(() => {});
    
    // Check for cookie-based session by hitting a /me or /auth/status endpoint
    // If we're using HTTP-only cookies, we can check a protected endpoint.
    // For now, if isAuthenticated is false but we might have a cookie, let's try calling backend.
    if (!isAuthenticated) {
      apiFetch('/api/auth/status')
        .then(res => {
          if (res.ok) {
            res.json().then(data => {
              setUser(data);
              // if on landing, optionally go to dashboard
            });
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleStartCall = (role?: string) => {
    // Role could be passed in State
    navigate('/call', { state: { role: role || 'Software Engineer' } });
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white font-sans selection:bg-indigo-500/30 transition-colors duration-500">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <LandingPage 
                onStart={() => navigate(isAuthenticated ? '/dashboard' : '/auth')} 
                isDark={isDark} 
                setIsDark={(val) => typeof val === 'function' ? setTheme(val(isDark)) : setTheme(val)} 
              />
            </motion.div>
          } />

          <Route path="/auth" element={
            !isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Suspense fallback={<LoaderFallback />}>
                  <AuthView 
                    onAuthSuccess={(userData: any) => {
                      setUser(userData);
                      navigate('/dashboard');
                    }} 
                    onBack={() => navigate('/')} 
                  />
                </Suspense>
              </motion.div>
            ) : <Navigate to="/dashboard" replace />
          } />

          <Route path="/dashboard" element={
            isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="min-h-screen h-full flex flex-col"
              >
                <Suspense fallback={<LoaderFallback />}>
                  <Dashboard 
                    onNewCall={handleStartCall}
                    isDark={isDark} 
                    setIsDark={(val) => typeof val === 'function' ? setTheme(val(isDark)) : setTheme(val)} 
                  />
                </Suspense>
              </motion.div>
            ) : <Navigate to="/auth" replace />
          } />

          <Route path="/call" element={
            isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Suspense fallback={<LoaderFallback />}>
                  <CallView 
                    onEnd={(data) => navigate('/report', { state: { reportData: data } })} 
                    onBack={() => navigate('/dashboard')} 
                  />
                </Suspense>
              </motion.div>
            ) : <Navigate to="/auth" replace />
          } />

          <Route path="/report" element={
            isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Suspense fallback={<LoaderFallback />}>
                  <ReportWrapper />
                </Suspense>
              </motion.div>
            ) : <Navigate to="/auth" replace />
          } />

        </Routes>
      </AnimatePresence>
    </div>
  );
}

// Wrapper to pass route state to ReportView
function ReportWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  return <ReportView data={location.state?.reportData} onDashboard={() => navigate('/dashboard')} />;
}

function LoaderFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white">
      <Loader2 className="animate-spin w-8 h-8" />
    </div>
  );
}

export default App;