import { useState, useCallback, useRef } from 'react';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { Loader2, PhoneOff, Mic, ChevronLeft } from 'lucide-react';

interface Props { onEnd: (data: any) => void; onBack: () => void; }

export default function CallView({ onEnd, onBack }: Props) {
  const [status, setStatus] = useState<"idle" | "thinking" | "speaking">("idle");
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

      const aiText = decodeURIComponent(response.headers.get('X-AI-Text') || "");
      setHistory(prev => [...prev, { role: "assistant", content: aiText }]);

      const audioBlob = await response.blob();
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audioRef.current = audio;
      setStatus("speaking");
      audio.play();
      audio.onended = () => setStatus("idle");
    } catch (error) {
      setStatus("idle");
    }
  }, [history]);

  const { transcript, isListening, startListening, stopListening } = useSpeechToText(handleFinalTranscript);

  const triggerEndSession = async () => {
    stopListening();
    setStatus("thinking");
    const response = await fetch('http://localhost:3000/api/interview/report', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ history }),
    });
    const data = await response.json();
    onEnd(data);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-between p-12">
      {/* Navigation & Live Session Status */}
      <div className="w-full flex justify-between items-center">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          <ChevronLeft size={16} /> Exit
        </button>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">Live Session</span>
        </div>
      </div>

      {/* Visualizer */}
      <div className="relative flex items-center justify-center">
        <div className={`absolute w-96 h-96 rounded-full blur-[100px] transition-all duration-1000 ${status === 'speaking' ? 'bg-indigo-600/20' : 'bg-white/5'}`} />
        <div className="relative w-48 h-48 rounded-full border border-white/10 backdrop-blur-3xl flex items-center justify-center">
          {status === 'thinking' ? <Loader2 className="animate-spin text-indigo-400" /> : <div className={`rounded-full bg-white transition-all ${isListening ? 'w-6 h-6' : 'w-2 h-2'}`} />}
        </div>
      </div>

      {/* Transcript & Main Button */}
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
    </div>
  );
}