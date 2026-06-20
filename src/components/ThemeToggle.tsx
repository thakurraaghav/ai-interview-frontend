import { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export interface ThemeToggleProps {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ThemeToggle({ isDark, setIsDark }: ThemeToggleProps) {
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 bg-gray-100 dark:bg-[#111] rounded-lg border border-gray-200 dark:border-white/5 text-gray-500 hover:text-indigo-500 transition-all cursor-pointer flex items-center justify-center"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
