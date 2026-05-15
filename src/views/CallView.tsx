import { useState, useCallback, useRef, useEffect } from 'react';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { Loader2, PhoneOff, Mic, ChevronLeft, AlertCircle, Zap, Activity, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props { onEnd: (data: any) => void; onBack: () => void; }

// --- REUSABLE CUSTOM MODAL (Polished for Production) ---
function Modal({ isOpen, title, message, confirmLabel, onConfirm, onCancel }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-[#111] border border-white/10 p-10 rounded-[3rem] shadow-2xl shadow-indigo-500/10"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white mb-3">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-10">{message}</p>
              
              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={onConfirm}
                  className="w-full py-4 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest transition-all hover:bg-gray-200 active:scale-95"
                >
                  {confirmLabel}
                </button>
                <button 
                  onClick={onCancel}
                  className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all text-white active:scale-95"
                >
                  Stay in Session
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function CallView({ onEnd, onBack }: Props) {
  const [status, setStatus] = useState<"idle" | "thinking" | "speaking">("idle");
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const [showShortModal, setShowShortModal] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleFinalTranscript = useCallback(async (text: string) => {
    const updatedHistory = [...history, { role: "user", content: text }];
    setHistory(updatedHistory);
    setStatus("thinking");

    try {
      const response = await fetch('http://localhost:3000/api/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: text, history: updatedHistory }),
      });

      if (!isMounted.current) return;

      const aiText = decodeURIComponent(response.headers.get('X-AI-Text') || "");
      setHistory(prev => [...prev, { role: "assistant", content: aiText }]);

      const audioBlob = await response.blob();
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audioRef.current = audio;
      
      setStatus("speaking");
      audio.play();
      audio.onended = () => {
        if (isMounted.current) setStatus("idle");
        startListening();
      };
    } catch (error) {
      if (isMounted.current) setStatus("idle");
    }
  }, [history]);

  const { transcript, isListening, startListening, stopListening } = useSpeechToText(handleFinalTranscript);

  const triggerEndSession = async () => {
    stopListening();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (history.length < 3) {
      setShowShortModal(true);
      return;
    }
    setStatus("thinking");
    try {
      const response = await fetch('http://localhost:3000/api/interview/report', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ history }),
      });
      if (!isMounted.current) return;
      const data = await response.json();
      onEnd(data);
    } catch (error) {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden">
      
      {/* 1. TOP NAV (HUD Style) */}
      <nav className="w-full flex justify-between items-center p-6 md:p-10 relative z-50 backdrop-blur-md">
        <button 
          onClick={onBack} 
          className="group flex items-center gap-3 text-gray-500 hover:text-red-400 transition-all text-[10px] font-black uppercase tracking-[0.3em]"
        >
          <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
            <ChevronLeft size={16} />
          </div>
          Exit Session
        </button>

        <div className="flex items-center gap-4 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest uppercase text-gray-300">Live Connection</span>
          </div> 
        </div>
      </nav>

      {/* 2. CENTRAL INTERACTION AREA */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6">
        
        {/* Cinematic Backdrop Glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full blur-[120px] transition-all duration-1000 pointer-events-none opacity-20 ${
          status === 'speaking' ? 'bg-indigo-500' : status === 'thinking' ? 'bg-amber-500' : 'bg-cyan-500'
        }`} />

        <div className="relative z-10 flex flex-col items-center">
          {/* THE ORB */}
          <motion.div 
            animate={status === 'speaking' ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`relative w-48 h-48 md:w-64 md:h-64 rounded-full border border-white/10 backdrop-blur-3xl flex items-center justify-center shadow-2xl transition-all duration-700 ${
              isListening ? 'ring-8 ring-indigo-500/20' : ''
            }`}
          >
            <AnimatePresence mode="wait">
              {status === 'thinking' ? (
                <motion.div 
                  key="thinking"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Loader2 className="animate-spin text-indigo-400" size={40} />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400/60">Analyzing</span>
                </motion.div>
              ) : (
                <motion.div 
                  key="vocal"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                   {/* Waveform Animation Placeholder */}
                   <div className="flex gap-1 h-8 items-center">
                      {[1,2,3,4,5].map((i) => (
                        <motion.div
                          key={i}
                          animate={status === 'speaking' || isListening ? { height: [8, 32, 8] } : { height: 4 }}
                          transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                          className="w-1 bg-indigo-500 rounded-full"
                        />
                      ))}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* TRANSCRIPT AREA */}
          <div className="mt-16 max-w-2xl text-center">
             <AnimatePresence mode="wait">
                <motion.p 
                  key={transcript || 'empty'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white text-xl md:text-3xl font-light italic leading-tight tracking-tight px-4"
                >
                  {transcript || (status === 'speaking' ? "Hannah is speaking..." : "Tap on mic below to start")}
                </motion.p>
             </AnimatePresence>
          </div>
        </div>
      </main>

      {/* 3. CONTROL BAR */}
      <footer className="w-full p-10 flex flex-col items-center gap-8 relative z-50">
        
        {/* Status Indicators */}
        <div className="flex gap-12 text-gray-600">
           <StatusIcon icon={<Zap size={14}/>} label="Zero Latency" />
           <StatusIcon icon={<Activity size={14}/>} label="Neural Audio" />
           <StatusIcon icon={<MessageSquare size={14}/>} label="Context Aware" />
        </div>

        <div className="relative group">
          <AnimatePresence mode="wait">
            {!isListening && status === 'idle' ? (
              <motion.button 
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                onClick={startListening} 
                className="relative z-10 p-8 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
              >
                <Mic size={28} />
              </motion.button>
            ) : (
              <motion.button 
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                onClick={triggerEndSession} 
                className="relative z-10 p-8 rounded-full bg-red-500 text-white hover:scale-105 active:scale-95 transition-all shadow-xl shadow-red-500/20"
              >
                <PhoneOff size={28} />
              </motion.button>
            )}
          </AnimatePresence>
          
          {/* Animated Background Pulse for Mic */}
          {isListening && (
            <motion.div 
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 bg-indigo-500 rounded-full z-0"
            />
          )}
        </div>

        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">
          {isListening ? 'Streaming Audio' : 'Awaiting Input'}
        </span>
      </footer>

      <Modal 
        isOpen={showShortModal}
        title="Insufficient Data"
        message="Hannah requires more dialogue to build a precise performance report. Ending now will discard the session analysis."
        confirmLabel="Exit Anyway"
        onConfirm={onBack}
        onCancel={() => { setShowShortModal(false); startListening(); }}
      />
    </div>
  );
}

function StatusIcon({ icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity cursor-default">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}