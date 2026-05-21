import { useState, useCallback, useRef, useEffect } from 'react';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { Loader2, Phone, PhoneOff, Mic, ChevronLeft, AlertCircle, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props { onEnd: (data: any) => void; onBack: () => void; }

// --- REUSABLE CUSTOM MODAL ---
function Modal({ isOpen, title, message, confirmLabel, onConfirm, onCancel }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-md" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-white dark:bg-[#111] border border-neutral-200 dark:border-white/10 p-10 rounded-[3rem] shadow-2xl shadow-indigo-500/5"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-black dark:text-white mb-3">{title}</h3>
              <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed mb-10">{message}</p>
              
              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={onConfirm}
                  className="w-full py-4 rounded-2xl bg-[#0A0A0A] dark:bg-white text-[#FAF9F6] dark:text-black text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 cursor-pointer"
                >
                  {confirmLabel}
                </button>
                <button 
                  onClick={onCancel}
                  className="w-full py-4 rounded-2xl bg-neutral-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest transition-all text-black dark:text-white active:scale-95 cursor-pointer"
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

// --- 🎙️ INTERACTIVE CANVAS WAVEFORM VISUALIZER ---
function AudioWaveVisualizer({ isListening }: { isListening: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isListening) {
      cleanupAudio();
      return;
    }

    async function initAudioContext() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64; 
        source.connect(analyser);
        analyserRef.current = analyser;

        drawWave();
      } catch (err) {
        console.error("Microphone wave stream access denied", err);
      }
    }

    function drawWave() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const analyser = analyserRef.current;
      if (!ctx || !analyser) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const renderLoop = () => {
        animationRef.current = requestAnimationFrame(renderLoop);
        analyser.getByteFrequencyData(dataArray);

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
          canvas.width = rect.width * dpr;
          canvas.height = rect.height * dpr;
          ctx.scale(dpr, dpr);
        }

        const width = rect.width;
        const height = rect.height;
        ctx.clearRect(0, 0, width, height);

        const barWidth = 4;
        const barGap = 6;
        const totalBars = Math.min(bufferLength, Math.floor(width / (barWidth + barGap)));
        const startX = (width - (totalBars * (barWidth + barGap) - barGap)) / 2;

        const isDarkModeActive = document.documentElement.classList.contains('dark');

        for (let i = 0; i < totalBars; i++) {
          const value = dataArray[i] / 255;
          const amplitude = Math.max(4, value * height * 0.85); 
          const x = startX + i * (barWidth + barGap);
          const y = (height - amplitude) / 2;

          const gradient = ctx.createLinearGradient(x, y, x, y + amplitude);
          gradient.addColorStop(0, '#34d399'); 
          gradient.addColorStop(0.5, '#6366f1'); 
          gradient.addColorStop(1, isDarkModeActive ? '#a855f7' : '#e0e7ff'); 

          ctx.fillStyle = gradient;
          
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, amplitude, 2);
          ctx.fill();
        }
      };

      renderLoop();
    }

    initAudioContext();

    return () => cleanupAudio();
  }, [isListening]);

  const cleanupAudio = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="w-full h-16 max-w-xs mx-auto relative mt-4">
      <canvas ref={canvasRef} className="w-full h-full block opacity-80" />
      {!isListening && (
        <div className="absolute inset-0 flex items-center justify-center gap-1.5 pointer-events-none">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-1 h-1 bg-neutral-300 dark:bg-neutral-800 rounded-full" />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CallView({ onEnd, onBack }: Props) {
  const [callState, setCallState] = useState<"incoming" | "active">("incoming");
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

  const startActualCall = () => {
    setCallState("active");
    startListening();
  };

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

  const isHannahSpeaking = status === "speaking";
  const isUserSpeaking = isListening && transcript.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#050505] text-black dark:text-white flex flex-col font-sans overflow-hidden select-none relative transition-colors duration-500">
      
      {/* 1. TOP NAV */}
      <nav className="w-full flex justify-between items-center p-6 md:p-10 relative z-50">
        <button 
          onClick={onBack} 
          className="group flex items-center gap-3 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-all text-[10px] font-black uppercase tracking-[0.3em] cursor-pointer"
        >
          <div className="p-2 rounded-lg bg-neutral-100 dark:bg-white/5 border border-neutral-200/40 dark:border-transparent group-hover:bg-neutral-200 transition-colors">
            <ChevronLeft size={16} />
          </div>
          Exit
        </button>

        {callState === "active" && (
          <div className="flex items-center gap-4 px-5 py-2 rounded-full bg-white dark:bg-white/5 border border-neutral-200/60 dark:border-white/10 shadow-xs backdrop-blur-md transition-colors duration-500">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black tracking-widest uppercase text-gray-400 dark:text-gray-300">Secure Live Stream</span>
            </div> 
          </div>
        )}
      </nav>

      {/* 2. DYNAMIC MAIN CONTAINER */}
      <AnimatePresence mode="wait">
        {callState === "incoming" ? (
          /* --- PRE-CALL LOBBY VIEW --- */
          <motion.main 
            key="lobby"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
            className="flex-1 flex flex-col items-center justify-center relative z-10 p-6 text-center max-w-md mx-auto"
          >
            <div className="w-24 h-24 rounded-full bg-indigo-600/5 dark:bg-indigo-600/10 border border-neutral-200/50 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-8 shadow-xs">
              <Volume2 size={36} />
            </div>
            <h2 className="text-3xl font-bold tracking-tighter italic text-black dark:text-white mb-2">Ready to Connect?</h2>
            <p className="text-gray-400 dark:text-gray-500 text-sm font-light leading-relaxed mb-10">
              Hannah is prepared to initialize your technical evaluation workspace. Ensure your workspace is silent.
            </p>
            <button 
              onClick={startActualCall}
              className="px-12 py-5 bg-[#0A0A0A] dark:bg-white text-[#FAF9F6] dark:text-black hover:bg-indigo-600 dark:hover:bg-gray-200 hover:text-white active:scale-98 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center gap-3 shadow-md transition-all cursor-pointer"
            >
              <Phone size={16} fill="currentColor" /> Start Interview Meeting
            </button>
          </motion.main>
        ) : (
          /* --- ACTIVE CONFERENCE PANEL VIEW --- */
          <motion.main 
            key="grid"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-12 pt-0 pb-32 items-center max-w-7xl mx-auto w-full h-full relative z-10"
          >
            {/* PANEL A: AI INTERVIEWER */}
            <motion.div 
              animate={{ scale: isHannahSpeaking ? 1.01 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`h-full min-h-[350px] w-full rounded-[2.5rem] bg-white dark:bg-[#0E0E0E] border transition-all duration-500 relative flex flex-col items-center justify-center overflow-hidden ${
                isHannahSpeaking 
                  ? 'border-emerald-500/40 shadow-xl ring-4 ring-emerald-500/5' 
                  : 'border-neutral-200/50 dark:border-white/5'
              }`}
            >
              <div className="relative flex flex-col items-center justify-center z-10">
                <div className="relative mb-6">
                  <motion.div 
                    animate={isHannahSpeaking ? { scale: [1, 1.15, 1], opacity: [0.2, 0, 0.2] } : {}}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border-2 border-emerald-500 pointer-events-none w-32 h-32 -left-2 -top-2"
                  />
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-black italic shadow-xl">
                    H
                  </div>
                </div>
                
                <h3 className="text-xl font-bold tracking-tight italic mb-1 text-black dark:text-white">Hannah</h3>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-black">
                  {status === 'thinking' ? (
                    <span className="text-amber-500 flex items-center gap-1.5">
                      <Loader2 size={12} className="animate-spin" /> Compiling
                    </span>
                  ) : isHannahSpeaking ? (
                    <span className="text-emerald-500 dark:text-emerald-400">Speaking</span>
                  ) : (
                    'Listening'
                  )}
                </p>
              </div>
              <span className="absolute bottom-6 left-6 text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-white/20 bg-neutral-100 dark:bg-black/40 px-3 py-1.5 rounded-lg border border-neutral-200/40 dark:border-white/5 transition-colors duration-500">
                AI Panelist
              </span>
            </motion.div>

            {/* PANEL B: CANDIDATE GRID */}
            <motion.div 
              animate={{ scale: isUserSpeaking ? 1.01 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`h-full min-h-[350px] w-full rounded-[2.5rem] bg-white dark:bg-[#0E0E0E] border transition-all duration-500 relative flex flex-col items-center justify-center overflow-hidden ${
                isUserSpeaking 
                  ? 'border-indigo-500/40 shadow-xl ring-4 ring-indigo-500/5' 
                  : 'border-neutral-200/50 dark:border-white/5'
              }`}
            >
              <div className="text-center space-y-4 z-10 w-full relative">
                <div className="w-24 h-24 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200/40 dark:border-white/10 flex items-center justify-center text-gray-400 text-2xl font-bold mx-auto transition-colors duration-500">
                  U
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight text-black dark:text-white/70">You (Candidate)</h4>
                </div>

                <AudioWaveVisualizer isListening={isListening} />
              </div>

              {/* Subtitles Overlay Bar */}
              <div className="absolute bottom-6 left-6 right-6 px-5 py-4 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200/60 dark:border-white/5 backdrop-blur-md min-h-[50px] flex items-center justify-between transition-colors duration-500">
                <p className="text-xs font-light tracking-tight text-gray-600 dark:text-gray-300 italic max-w-[85%] truncate">
                  {transcript || (status === 'speaking' ? "Hannah is conveying context..." : "Stream open, voice your answers...")}
                </p>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 dark:text-white/20">
                  {isListening ? 'On Air' : 'Standby'}
                </span>
              </div>
            </motion.div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* 3. DOCK CONTROLS HUD */}
      {callState === "active" && (
        <footer className="w-full p-10 flex justify-center items-center absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/80 dark:from-black dark:via-black/80 to-transparent transition-all duration-500">
          <div className="bg-white dark:bg-neutral-900/60 backdrop-blur-2xl border border-neutral-200 dark:border-white/5 px-6 py-3.5 rounded-3xl flex items-center gap-4 shadow-xl transition-colors duration-500">
            
            <div className={`p-4 rounded-xl border transition-all ${
              isListening 
                ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                : 'bg-neutral-100 dark:bg-white/5 border-transparent text-gray-400'
            }`}>
              <Mic size={18} />
            </div>

            <div className="w-px h-6 bg-neutral-200 dark:bg-white/10" />

            <button 
              onClick={triggerEndSession} 
              className="p-4 rounded-xl bg-red-600 border border-red-500/30 text-white hover:bg-red-500 hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
            >
              <PhoneOff size={18} />
            </button>
          </div>
        </footer>
      )}

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