import { useState, useCallback, useRef, useEffect } from 'react';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { Loader2, PhoneOff, Mic, ChevronLeft, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props { onEnd: (data: any) => void; onBack: () => void; }

// --- REUSABLE CUSTOM MODAL ---
function Modal({ isOpen, title, message, confirmLabel, onConfirm, onCancel }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
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
              <AlertCircle className="text-indigo-500" size={24} />
              <h3 className="text-xl font-bold tracking-tight italic text-white">{title}</h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">{message}</p>
            
            <div className="flex gap-3">
              <button 
                onClick={onCancel}
                className="flex-1 py-3 rounded-full bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all text-white"
              >
                Stay
              </button>
              <button 
                onClick={onConfirm}
                className="flex-1 py-3 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest transition-all hover:bg-gray-200"
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

export default function CallView({ onEnd, onBack }: Props) {
  const [status, setStatus] = useState<"idle" | "thinking" | "speaking">("idle");
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const [showShortModal, setShowShortModal] = useState(false); // Modal state
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

    // 1. Minimum Conversation Check - TRIGGER MODAL INSTEAD OF ALERT
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
      console.error("Report Error:", error);
      onBack();
    }
  };

  const handleExit = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onBack();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-between p-12">
      <div className="w-full flex justify-between items-center">
        <button onClick={handleExit} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          <ChevronLeft size={16} /> Exit
        </button>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">Live Session</span>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div className={`absolute w-96 h-96 rounded-full blur-[100px] transition-all duration-1000 ${status === 'speaking' ? 'bg-indigo-600/20' : 'bg-white/5'}`} />
        <div className="relative w-48 h-48 rounded-full border border-white/10 backdrop-blur-3xl flex items-center justify-center">
          {status === 'thinking' ? <Loader2 className="animate-spin text-indigo-400" /> : <div className={`rounded-full bg-white transition-all ${isListening ? 'w-6 h-6' : 'w-2 h-2'}`} />}
        </div>
      </div>

      <div className="w-full max-w-lg text-center space-y-10">
        <div className="min-h-20">
          <p className="text-gray-400 text-lg font-light italic">{transcript || "Ready to start?"}</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          {!isListening && status === 'idle' ? (
            <button onClick={startListening} className="group flex flex-col items-center gap-4">
              <div className="p-8 rounded-full bg-white text-black hover:scale-105 transition-all">
                <Mic size={24} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40">Start Interview</span>
            </button>
          ) : (
            <button onClick={triggerEndSession} className="group flex flex-col items-center gap-4">
              <div className="p-8 rounded-full bg-red-500/10 border border-red-500/20 hover:bg-red-500 transition-all">
                <PhoneOff size={24} className="text-red-500 group-hover:text-white" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-red-500/60">End Session</span>
            </button>
          )}
        </div>
      </div>

      {/* --- SHORT SESSION MODAL --- */}
      <Modal 
        isOpen={showShortModal}
        title="Session too short"
        message="Hannah needs at least one full answer to generate your performance report. Do you want to stay or exit anyway?"
        confirmLabel="Exit Anyway"
        onConfirm={onBack}
        onCancel={() => setShowShortModal(false)}
      />
    </div>
  );
}