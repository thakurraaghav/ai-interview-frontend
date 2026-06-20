import { useState, useEffect, useRef, useCallback } from 'react';

// Minimal interfaces for Web Speech API to avoid 'any' types
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      }
    }
  };
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export const useSpeechToText = (onFinal: (text: string) => void) => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use a Ref for the callback to prevent the useEffect from re-running 
  // every time the parent component re-renders.
  const onFinalRef = useRef(onFinal);
  useEffect(() => {
    onFinalRef.current = onFinal;
  }, [onFinal]);

  useEffect(() => {
    const SpeechRecognitionClass = (window as unknown as { SpeechRecognition: any }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition: any }).webkitSpeechRecognition;
    if (!SpeechRecognitionClass || recognitionRef.current) return;

    const recognition: SpeechRecognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      
      setTranscript(currentTranscript);

      timeoutRef.current = setTimeout(() => {
        if (currentTranscript.trim().length > 2) {
          // Use the Ref here so we don't need onFinal in the dependency array
          onFinalRef.current(currentTranscript);
          setTranscript(""); 
        }
      }, 1500); 
    };

    recognition.onend = () => {
      // 💡 Only restart if the USER didn't manually stop it
      // This prevents the "mic turning off automatically" bug
      if (recognitionRef.current && isListening) {
        try {
          recognition.start();
        } catch (e) {
          console.error("Speech recognition restart failed:", e);
        }
      }
    };

    recognitionRef.current = recognition;

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      recognition.stop();
    };
  }, [isListening]); // 💡 Only depend on isListening

  const startListening = useCallback(() => {
    setIsListening(true);
    try {
      recognitionRef.current?.start();
    } catch (e) {
      console.warn("Recognition already started");
    }
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    recognitionRef.current?.stop();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return { transcript, setTranscript, isListening, startListening, stopListening };
};