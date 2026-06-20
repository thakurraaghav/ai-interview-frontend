import { useState, useRef, useEffect, useCallback } from 'react';
import { apiFetch } from '../lib/api';

export function useAudioSession() {
  const [status, setStatus] = useState<"idle" | "thinking" | "speaking">("idle");
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    audioRef.current = new Audio();
    return () => {
      isMounted.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const initAudio = () => {
    if (audioRef.current) {
      audioRef.current.src = "data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
      audioRef.current.play().catch(() => {});
    }
  };

  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const processResponse = useCallback(async (text: string, onAudioComplete: () => void) => {
    const updatedHistory = [...history, { role: "user", content: text }];
    setHistory(updatedHistory);
    setStatus("thinking");

    try {
      const response = await apiFetch('/api/interview/chat', {
        method: 'POST',
        body: JSON.stringify({ userMessage: text, history: updatedHistory }),
      });

      if (!isMounted.current) return;

      if (!response.ok) {
        setHistory(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting right now." }]);
        setStatus("idle");
        onAudioComplete();
        return;
      }

      const data = await response.json();
      setHistory(prev => [...prev, { role: "assistant", content: data.text }]);

      if (audioRef.current) {
        audioRef.current.src = `data:audio/wav;base64,${data.audioBase64}`;
        setStatus("speaking");
        try {
          await audioRef.current.play();
          audioRef.current.onended = () => {
            if (isMounted.current) setStatus("idle");
            onAudioComplete();
          };
        } catch (playErr) {
          if (isMounted.current) setStatus("idle");
          onAudioComplete();
        }
      } else {
        if (isMounted.current) setStatus("idle");
        onAudioComplete();
      }
    } catch (error) {
      if (isMounted.current) setStatus("idle");
      onAudioComplete();
    }
  }, [history]);

  return {
    status,
    history,
    initAudio,
    cleanupAudio,
    processResponse,
    isHannahSpeaking: status === "speaking",
  };
}
