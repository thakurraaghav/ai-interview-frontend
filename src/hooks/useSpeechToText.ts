import { useState, useEffect, useRef, useCallback } from 'react';

interface Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export const useSpeechToText = (onFinal: (text: string) => void) => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // 💡 Keep mic open
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      // Clear the silence timer because the user is still talking
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      
      setTranscript(currentTranscript);

      // 💡 THE AUTO-DETECTION MAGIC
      // If the user stops talking for 1.5 seconds, auto-send to AI
      timeoutRef.current = setTimeout(() => {
        if (currentTranscript.trim().length > 2) {
          onFinal(currentTranscript);
          setTranscript(""); // Clear UI for next turn
          // Note: We don't stop the mic, it's "Always On"
        }
      }, 1500); 
    };

    recognition.onend = () => {
      // If it stops unexpectedly (browser timeout), restart it if we are in "Call Mode"
      if (isListening) recognition.start();
    };

    recognitionRef.current = recognition;
  }, [onFinal, isListening]);

  const startListening = () => {
    setIsListening(true);
    recognitionRef.current?.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current?.stop();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return { transcript, setTranscript, isListening, startListening, stopListening };
};