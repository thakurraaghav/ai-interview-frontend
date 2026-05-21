import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'info';
}

export default function Modal({ isOpen, title, message, confirmLabel = "Confirm", onConfirm, onCancel, variant = 'info' }: ModalProps) {
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
            className="relative w-full max-w-sm bg-white dark:bg-[#111111] border border-neutral-200/60 dark:border-white/10 p-8 rounded-[2.5rem] shadow-2xl transition-colors duration-500"
          >
            <h3 className="text-xl font-bold tracking-tight mb-2 italic text-black dark:text-white">{title}</h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed mb-8">{message}</p>
            
            <div className="flex gap-3">
              <button 
                onClick={onCancel}
                className="flex-1 py-3 rounded-full bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all text-black dark:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                  variant === 'danger' ? 'bg-red-600 text-white' : 'bg-[#0A0A0A] dark:bg-white text-white dark:text-black'
                }`}
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