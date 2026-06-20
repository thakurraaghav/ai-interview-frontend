import { motion } from 'framer-motion';
import { Trash2, ChevronRight } from 'lucide-react';
import type { InterviewSession, ResumeSession } from '../types';

export interface HistoryItemProps {
  data: InterviewSession | ResumeSession;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  type: 'interview' | 'resume';
}

export default function HistoryItem({ data, onClick, onDelete, type }: HistoryItemProps) {
  const isInterview = type === 'interview';
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ x: 4 }}
      className="p-5 rounded-4xl bg-white dark:bg-[#151b2d]/80 backdrop-blur-xl hover:bg-gray-50 dark:hover:bg-[#151b2d] border border-gray-100 dark:border-white/10 flex items-center justify-between group cursor-pointer transition-colors duration-300 shadow-sm dark:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center gap-5">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold italic transition-all ${isInterview ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white' : 'bg-purple-500/10 border border-purple-500/20 text-purple-500 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white'}`}>
          {data.score}%
        </div>
        <div>
          <h5 className="font-bold text-sm tracking-tight text-black dark:text-white">{isInterview ? ((data as InterviewSession).verdict || "Session") : ((data as ResumeSession).fileName || "Resume")}</h5>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest italic">{data.role}</span>
            <span className="text-[12px] text-gray-200 dark:text-gray-800">/</span>
            <span className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">{new Date(data.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onDelete} className="p-3 text-gray-300 dark:text-gray-700 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
        <ChevronRight size={16} className="text-gray-300 dark:text-gray-800 group-hover:text-black dark:group-hover:text-white transition-colors" />
      </div>
    </motion.div>
  );
}
