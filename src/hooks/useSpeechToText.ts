import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeechToText = (onFinal: (text: string) => void) => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use a Ref for the callback to prevent the useEffect from re-running 
  // every time the parent component re-renders.
  const onFinalRef = useRef(onFinal);
  useEffect(() => {
    onFinalRef.current = onFinal;
  }, [onFinal]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition || recognitionRef.current) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
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