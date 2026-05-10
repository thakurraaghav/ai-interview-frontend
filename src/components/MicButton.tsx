import { Mic, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
}

export const MicButton = ({ isListening, onClick }: MicButtonProps) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        {/* Pulsing Background Animation */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              key="pulsing-circle" // 💡 Important for AnimatePresence
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 bg-indigo-500 rounded-full"
            />
          )}
        </AnimatePresence>

        {/* Main Button */}
        <button
          onClick={onClick}
          className={`relative z-10 p-8 rounded-full transition-all duration-300 ${
            isListening 
            ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_20px_rgba(79,70,229,0.4)]'
          }`}
        >
          {isListening ? (
            <Square className="w-8 h-8 text-white fill-current" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>
      </div>
      
      <p className="text-sm font-medium tracking-widest uppercase text-gray-400">
        {isListening ? 'Listening...' : 'Tap to Speak'}
      </p>
    </div>
  );
};