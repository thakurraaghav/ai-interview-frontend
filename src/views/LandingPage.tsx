import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { 
   Zap, ChevronRight, Sun, Moon, LayoutDashboard,
   Mic, FileCheck, Target, BarChart3, Building2, Cpu,
   Sparkles, Award, Terminal, CheckCircle2, Upload, MessageSquare, ArrowRight, ChevronDown
} from 'lucide-react';

import ScrollStack, { ScrollStackItem } from '../components/ScrollStack';
import GlowingGrid from '../components/GlowingGrid';

interface Props { 
  onStart: () => void; 
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}

function RollingCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    const controls = animate(count, value, { duration, ease: "easeOut" });
    return controls.stop;
  }, [value, duration]);

  return <motion.span>{rounded}</motion.span>;
}

export default function LandingPage({ onStart, isDark, setIsDark }: Props) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  const topCompanies = [
    { name: "Google", logo: "/logos/google.svg" },
    { name: "Amazon", logo: "/logos/amazon.svg" },
    { name: "Microsoft", logo: "/logos/microsoft.svg" },
    { name: "Meta", logo: "/logos/meta.svg" },
    { name: "Apple", logo: "/logos/apple.svg" },
    { name: "Netflix", logo: "/logos/netflix.svg" },
    { name: "OpenAI", logo: "/logos/openai.svg" },
    { name: "NVIDIA", logo: "/logos/nvidia.svg" },
    { name: "Uber", logo: "/logos/uber.png" },
    { name: "Stripe", logo: "/logos/stripe.svg" },
  ];
  
  const faqs = [
    {
      question: "How does the live audio simulation track my voice?",
      answer: "RecruitAI uses native browser Web Audio API frequency analyzers directly inside your browser window. It automatically pauses or halts the AI streaming audio pipeline the exact millisecond you begin speaking, eliminating the need for manual button toggles or push-to-talk keybinds."
    },
    {
      question: "Can I target specific framework architectures or company processes?",
      answer: "Yes. Through the Company Preparation matrix, you can align the simulator to test specific company tech stacks, system constraints, or lifecycle stages (like high concurrency, load balancing, or data structure depth) to match real panel filters."
    },
    {
      question: "How detailed is the feedback report post-session?",
      answer: "The moment a workspace sequence closes, you receive an executive diagnostics breakdown. This includes score timelines mapping your core engineering skills, precise sentence critique blocks analyzing conceptual accuracy, and answer-by-answer logical summaries."
    },
    {
      question: "What format requirements apply to resume document parsing?",
      answer: "The ingestion core reads standard text layouts and structured PDF files directly. It automatically extracts technology metrics, projects, and work experience criteria to grade them against chosen role baselines."
    }
  ];

  const featureShowcase = [
    {
      tag: "01 / CENTRAL COMMAND",
      title: "Candidate Workspace Dashboard",
      description: "Track your technical readiness analytics over time through a persistent dashboard window. Monitor career progress bars across technical depth, vocal pacing, and logical milestones mapped dynamically from active runs.",
      light: '/dashboard_light.png',
      dark: '/dashboard_dark.png',
      icon: <LayoutDashboard className="text-indigo-500" size={18} />,
      glowClass: "group-hover:shadow-[0_0_50px_rgba(99,102,241,0.12)]"
    },
    {
      tag: "02 / VOICE STREAMING",
      title: "Live Audio Interview Simulation",
      description: "Connect safely with Hannah, your AI panelist, in a latency-critical environment. Built-in frequency indicators sample audio loops on air, tracking vocal velocity matrices without requiring keys or buttons.",
      light: '/callview_light.png',
      dark: '/callview_dark.png',
      icon: <Mic className="text-emerald-500" size={18} />,
      glowClass: "group-hover:shadow-[0_0_50px_rgba(52,211,153,0.12)]"
    },
    {
      tag: "03 / PERFORMANCE DIAGNOSTICS",
      title: "Comprehensive Summary Matrix",
      description: "Receive immediate executive scoring feedback logs the exact millisecond your session disconnects. Deep text critiques grade conceptual logic bounds and allocate dynamic performance hiring tiers.",
      light: '/report_light.png',
      dark: '/report_dark.png',
      icon: <Target className="text-purple-500" size={18} />,
      glowClass: "group-hover:shadow-[0_0_50px_rgba(168,85,247,0.12)]"
    },
    {
      tag: "04 / ATS ASSESSMENT",
      title: "Portfolio Compliance Audit",
      description: "Upload PDF assets directly into the ingestion matrix. The matching engine benchmarks text density layouts against chosen roles to yield precision compatibility ratings and identify critical structure gaps.",
      light: '/resume_light.png',
      dark: '/resume_dark.png',
      icon: <FileCheck className="text-amber-500" size={18} />,
      glowClass: "group-hover:shadow-[0_0_50px_rgba(245,158,11,0.12)]"
    }
  ];

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#FAF9F6] min-h-screen overflow-x-hidden selection:bg-indigo-500/10 font-sans tracking-tight transition-colors duration-500 scroll-smooth relative">
      
      {/* 🌌 UPDATED: GLOWING GRID BACKGROUND */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <GlowingGrid />
        {/* Balanced vignettes: Stronger on bottom/top to keep text highly legible while letting center burst out */}
        <div className="absolute inset-0 bg-linear-to-t from-[#FAF9F6] via-transparent to-[#FAF9F6] dark:from-[#0A0A0A] dark:via-transparent dark:to-[#0A0A0A] opacity-90" />
        <div className="absolute inset-0 bg-linear-to-r from-[#FAF9F6] via-transparent to-[#FAF9F6] dark:from-[#0A0A0A] dark:via-transparent dark:to-[#0A0A0A] opacity-40" />
      </div>

      {/* CORE LAYER CONTENT */}
      <div className="relative z-10 w-full bg-transparent">
        {/* 1. ARCHITECTURAL HEADER / NAV */}
        <nav className="fixed top-0 w-full z-50 bg-[#FAF9F6]/40 dark:bg-[#0A0A0A]/40 backdrop-blur-xl border-b border-[#0A0A0A]/5 dark:border-white/5 transition-colors duration-500">
          <div className="flex justify-between items-center p-6 md:p-8 max-w-7xl mx-auto">
            <div className="text-lg font-black uppercase tracking-[0.25em] flex items-center gap-2.5 font-mono text-[#0A0A0A] dark:text-[#FAF9F6]">
              <Zap size={15} fill="currentColor" className="text-indigo-600" />
              Recruit<span className="font-light text-gray-400 dark:text-gray-600">.AI</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-12 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 dark:text-gray-500">
              <a href="#methodology" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">// Methodology</a>
              <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">// Workflow</a>
              <a href="#demo" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">// Live Demo</a>
              <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">// FAQ</a>
            </div>

            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsDark(!isDark)}
                className="p-2.5 rounded-sm bg-[#0A0A0A]/5 dark:bg-white/5 text-gray-500 hover:text-[#0A0A0A] dark:hover:text-white transition-all active:scale-90 cursor-pointer"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isDark ? 'dark' : 'light'}
                    initial={{ y: -10, opacity: 0, rotate: -20 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 10, opacity: 0, rotate: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
                  </motion.div>
                </AnimatePresence>
              </button>

              <button 
                onClick={onStart} 
                className="px-6 py-2.5 rounded-sm bg-[#0A0A0A] dark:bg-[#FAF9F6] text-[#FAF9F6] dark:text-[#0A0A0A] text-[10px] font-black uppercase tracking-[0.25em] hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white transition-all active:scale-95 shadow-xs"
              >
                Sign In
              </button>
            </div>
          </div>
        </nav>

        {/* 2. HERO BLOCK */}
        <header className="max-w-7xl mx-auto px-6 md:px-8 pt-48 md:pt-45 pb-12 relative text-left">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 text-[9px] font-black tracking-[0.35em] uppercase text-indigo-600 font-mono">
              // Real-time interview intelligence pipeline
            </div>
            <h1 className="text-5xl md:text-8xl lg:text-[95px] font-black tracking-tighter leading-[0.9] text-[#0A0A0A] dark:text-[#FAF9F6] transition-colors duration-500">
              Practice talking to <span className="font-light italic text-indigo-400 dark:text-indigo-500">artificial talent.</span>
            </h1>
            <p className="text-base md:text-xl text-gray-500 dark:text-gray-400 font-normal leading-relaxed max-w-2xl pt-2">
              An advanced, vocally driven evaluation simulator that critiques your backend design patterns, structural algorithms, and communication pacing in real time.
            </p>
            <div className="pt-6">
              <button 
                onClick={onStart}
                className="group px-8 py-5 bg-[#0A0A0A] dark:bg-[#FAF9F6] text-[#FAF9F6] dark:text-[#0A0A0A] rounded-sm font-black uppercase text-[10px] tracking-[0.2em] transition-all hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white active:scale-98 flex items-center justify-center gap-3 shadow-xs"
              >
                Get Started Instantly <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* 3. DYNAMIC STATS TICKER */}
          <div className="w-full h-px bg-[#0A0A0A]/10 dark:bg-white/10 mt-28" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 text-left">
            <div>
              <div className="text-3xl md:text-4xl font-bold tracking-tighter text-indigo-600 dark:text-indigo-400">
                <RollingCounter value={48250} />+
              </div>
              <div className="text-[9px] font-mono font-black uppercase tracking-widest text-gray-400 mt-1">// OPERATIONAL SESSIONS LOGGED</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold tracking-tighter text-black dark:text-white">
                <RollingCounter value={94} />.<RollingCounter value={2} />%
              </div>
              <div className="text-[9px] font-mono font-black uppercase tracking-widest text-gray-400 mt-1">// ATS INGESTION ACCURACY</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold tracking-tighter text-emerald-600 dark:text-emerald-400">
                &lt; <RollingCounter value={120} />ms
              </div>
              <div className="text-[9px] font-mono font-black uppercase tracking-widest text-gray-400 mt-1">// SPEECH RECOGNITION VELOCITY</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold tracking-tighter text-black dark:text-white">
                <RollingCounter value={16} />+
              </div>
              <div className="text-[9px] font-mono font-black uppercase tracking-widest text-gray-400 mt-1">// EVALUATION METRICS DESIGNED</div>
            </div>
          </div>
          <div className="w-full h-px bg-[#0A0A0A]/10 dark:bg-white/10" />

          {/* COMPANIES MARQUEE LOOP LAYER */}
          <div className="relative py-8 overflow-hidden">
            <div className="mb-5 text-[9px] font-mono font-black tracking-[0.35em] uppercase text-gray-400">
              // CANDIDATES FROM TOP COMPANIES
            </div>
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-linear-to-r from-[#FAF9F6] to-transparent dark:from-[#0A0A0A]" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-linear-to-l from-[#FAF9F6] to-transparent dark:from-[#0A0A0A]" />

            <motion.div
              className="flex items-center gap-16 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              {[...topCompanies, ...topCompanies].map((company, index) => (
                <div key={`${company.name}-${index}`} className="shrink-0">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-8 md:h-10 w-auto opacity-90 hover:scale-105 transition-all duration-300 dark:brightness-0 dark:invert"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          <div className="w-full h-px bg-[#0A0A0A]/10 dark:bg-white/10" />
        </header>

        {/* 4. METHODOLOGY BENTO GRID SUITE */}
        <section id="methodology" className="max-w-7xl mx-auto px-6 md:px-8 py-20 text-center">
          <div className="space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] dark:text-[#FAF9F6]">
              What Is AI Interview Preparation?
            </h2>
            <p className="text-base md:text-lg text-gray-400 dark:text-gray-500 font-light max-w-xl mx-auto">
              Practice that actually mirrors what happens in real interview rooms.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left items-stretch">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="p-6 sm:p-8 md:p-10 rounded-4xl bg-white/40 dark:bg-[#0E0E0E]/40 backdrop-blur-md border border-neutral-200/40 dark:border-white/10 flex flex-col gap-4 relative overflow-hidden group shadow-xs dark:shadow-none transition-all duration-300 hover:border-indigo-500/20">
                <div className="absolute -inset-px rounded-4xl bg-indigo-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-3 w-max rounded-xl bg-indigo-500/5 text-indigo-500"><Sparkles size={18} /></div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-black dark:text-white">Personalized to You</h3>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-light leading-relaxed max-w-2xl">
                  Questions tailored to your resume, target role, and industry — evaluated in real time across communication clarity, content depth, confidence, and answer structure.
                </p>
              </div>

              <div className="p-6 sm:p-8 md:p-10 rounded-[2rem] bg-white/40 dark:bg-[#0E0E0E]/40 backdrop-blur-md border border-neutral-200/40 dark:border-white/10 flex flex-col gap-6 relative overflow-hidden group shadow-xs dark:shadow-none transition-all duration-300 hover:border-indigo-500/20">
                <div className="absolute -inset-px rounded-[2rem] bg-indigo-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="space-y-2">
                  <div className="p-3 w-max rounded-xl bg-indigo-500/5 text-indigo-500"><Award size={18} /></div>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-black dark:text-white">Proven Results</h3>
                  <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-light leading-relaxed max-w-2xl">
                    Thousands of candidates have used RecruitAI to land offers at top companies — with measurable improvements in confidence and answer quality after just a few sessions.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-100 dark:border-white/5">
                  <div>
                    <div className="text-2xl md:text-4xl font-black text-indigo-600 dark:text-indigo-400">4,000+</div>
                    <div className="text-[10px] font-mono uppercase text-gray-400 tracking-wider mt-1">Offers landed</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-4xl font-black text-black dark:text-white">52K+</div>
                    <div className="text-[10px] font-mono uppercase text-gray-400 tracking-wider mt-1">Candidates practiced</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-4xl font-black text-black dark:text-white">4.8★</div>
                    <div className="text-[10px] font-mono uppercase text-gray-400 tracking-wider mt-1">Average rating</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 md:p-10 rounded-[2rem] bg-[#0E0E0E]/70 text-white backdrop-blur-md border border-white/5 flex flex-col justify-between relative overflow-hidden group shadow-2xl">
              <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-b from-indigo-500/5 to-transparent opacity-50" />
              <div className="space-y-4 relative z-10">
                <div className="p-3 w-max rounded-xl bg-white/5 text-gray-400"><Terminal size={18} /></div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">Adaptive Follow-Ups</h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed">
                  Unlike static question banks, the AI adapts follow-up questions based on each answer — mimicking the dynamic pressure of real interview panels.
                </p>
              </div>

              <div className="pt-8 border-t border-white/5 relative z-10 mt-8 space-y-4">
                <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-gray-500 block">INTERVIEW FORMATS</span>
                <ul className="space-y-3 text-xs md:text-sm text-gray-300 font-medium tracking-wide">
                  {["STAR Behavioral", "Live Coding", "System Design", "Case Studies", "Situational"].map((format, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 hover:text-white transition-colors">
                      <CheckCircle2 size={14} className="text-indigo-500 shrink-0" /> {format}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="w-full h-px bg-[#0A0A0A]/10 dark:bg-white/10 mt-20" />
        </section>

        {/* 5. HOW IT WORKS STEP MATRIX LAYER */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-6 md:px-8 py-10 text-center">
          <div className="space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] dark:text-[#FAF9F6]">
              How It Works
            </h2>
            <p className="text-base md:text-lg text-gray-400 dark:text-gray-500 font-light max-w-xl mx-auto">
              Get interview-ready in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch relative">
            <div className="p-6 sm:p-8 md:p-10 rounded-[2rem] bg-white/40 dark:bg-[#0E0E0E]/40 backdrop-blur-md border border-neutral-200/40 dark:border-white/10 flex flex-col justify-between text-left relative overflow-hidden group shadow-xs dark:shadow-none transition-all duration-300 hover:border-indigo-500/20">
              <div className="absolute right-6 top-2 font-mono text-[7rem] md:text-[8rem] font-black tracking-tighter text-[#0A0A0A]/3 dark:text-white/[0.01] select-none pointer-events-none">01</div>
              <div className="space-y-4 relative z-10 pt-4">
                <div className="p-3.5 w-max rounded-xl bg-indigo-600/5 text-indigo-600 dark:text-indigo-400"><Upload size={18} /></div>
                <h3 className="text-lg md:text-xl font-bold tracking-tight text-black dark:text-white">Upload Your Resume</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                  Upload your resume and let our AI analyze your background to create personalized interview questions.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 md:p-10 rounded-[2rem] bg-white/40 dark:bg-[#0E0E0E]/40 backdrop-blur-md border border-neutral-200/40 dark:border-white/10 flex flex-col justify-between text-left relative overflow-hidden group shadow-xs dark:shadow-none transition-all duration-300 hover:border-indigo-500/20">
              <div className="absolute right-6 top-2 font-mono text-[7rem] md:text-[8rem] font-black tracking-tighter text-[#0A0A0A]/3 dark:text-white/[0.01] select-none pointer-events-none">02</div>
              <div className="space-y-4 relative z-10 pt-4">
                <div className="p-3.5 w-max rounded-xl bg-indigo-600/5 text-indigo-600 dark:text-indigo-400"><MessageSquare size={18} /></div>
                <h3 className="text-lg md:text-xl font-bold tracking-tight text-black dark:text-white">Practice Interviews</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                  Choose from text or audio interviews. Practice with AI-powered questions tailored to your role.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 md:p-10 rounded-[2rem] bg-white/40 dark:bg-[#0E0E0E]/40 backdrop-blur-md border border-neutral-200/40 dark:border-white/10 flex flex-col justify-between text-left relative overflow-hidden group shadow-xs dark:shadow-none transition-all duration-300 hover:border-indigo-500/20">
              <div className="absolute right-6 top-2 font-mono text-[7rem] md:text-[8rem] font-black tracking-tighter text-[#0A0A0A]/3 dark:text-white/[0.01] select-none pointer-events-none">03</div>
              <div className="space-y-4 relative z-10 pt-4">
                <div className="p-3.5 w-max rounded-xl bg-indigo-600/5 text-indigo-600 dark:text-indigo-400"><BarChart3 size={18} /></div>
                <h3 className="text-lg md:text-xl font-bold tracking-tight text-black dark:text-white">Get Feedback & Improve</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                  Receive detailed feedback on your responses and track your progress over time.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14 w-full flex justify-center">
            <button 
              onClick={onStart}
              className="inline-flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors cursor-pointer group"
            >
              Start your first practice session <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
          <div className="w-full h-px bg-[#0A0A0A]/10 dark:bg-white/10 mt-16" />
        </section>

        {/* 6. IMMERSIVE SCROLLSTACK SUITE COMPONENT THEATER */}
        <section id="demo" className="max-w-5xl mx-auto px-6 md:px-8 py-24 relative overflow-visible">
          <div className="space-y-4 mb-20 text-left">
            <span className="text-[9px] font-black tracking-[0.4em] text-indigo-600 uppercase font-mono">01 / STACK INTERFACE PREVIEWS</span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#0A0A0A] dark:text-[#FAF9F6]">Operational Workspaces</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl font-light">Scroll down continuously to watch platform snapshots seamlessly cascade and layer over each other using precision Lenis logic.</p>
          </div>

          <ScrollStack 
            useWindowScroll={true} 
            itemDistance={90} 
            itemStackDistance={25} 
            baseScale={0.90}
            itemScale={0.02}
            blurAmount={2}
            rotationAmount={-0.5}
          >
            {featureShowcase.map((item, index) => (
              <ScrollStackItem 
                key={index} 
                itemClassName="bg-white/80 dark:bg-[#0E0E0E]/80 backdrop-blur-md border border-neutral-200/60 dark:border-white/10 overflow-hidden group transition-colors duration-500"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center h-full w-full">
                  <div className="md:col-span-5 space-y-4 text-left relative z-10">
                    <div className="inline-flex items-center gap-2 text-[9px] font-mono font-black tracking-widest text-indigo-600 bg-indigo-600/5 px-3 py-1 rounded-sm border border-indigo-500/10">
                      {item.icon} {item.tag}
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="md:col-span-7 relative w-full h-full flex items-center justify-center">
                    <div className={`absolute -inset-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 blur-xl transition-all duration-700 pointer-events-none ${item.glowClass}`} />
                    <div className="w-full aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-neutral-200/40 dark:border-white/5 shadow-2xl dark:shadow-none relative bg-neutral-50 dark:bg-black/40">
                      <img 
                        src={isDark ? item.dark : item.light} 
                        alt={item.title} 
                        className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-[1.005] transition-transform duration-500 ease-out"
                      />
                    </div>
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </section>

        {/* 7. ASYMMETRIC PLATFORM BLUEPRINT INDEX */}
        <section id="features" className="max-w-7xl mx-auto px-6 md:px-8 pb-40 pt-24 relative z-20 bg-transparent transition-colors duration-500">
          <div className="w-full h-px bg-[#0A0A0A]/10 dark:bg-white/10 mb-20" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 sticky top-32 space-y-4 text-left">
              <span className="text-[9px] font-black tracking-[0.4em] text-indigo-600 uppercase font-mono">03 / Platform Blueprint</span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-[#0A0A0A] dark:text-[#FAF9F6]">Operational Vectors</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs leading-relaxed">A specialized diagnostic framework engineered to analyze system depth, structural complexities, and career readiness variables cleanly.</p>
            </div>

            <div className="lg:col-span-8 border-l border-[#0A0A0A]/10 dark:border-white/10 pl-6 md:pl-12 space-y-24 text-left">
              <div className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-4 text-xs font-mono font-black text-gray-300 dark:text-neutral-800 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-widest pt-1">// 01.01 CORE METRICS</div>
                <div className="md:col-span-8 space-y-3">
                  <div className="flex items-center gap-3 text-gray-400 dark:text-gray-600"><BarChart3 size={16} /> <h3 className="text-lg font-bold tracking-tight text-[#0A0A0A] dark:text-[#FAF9F6]">Executive Analytics Summary</h3></div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-light leading-relaxed">Generates deep numerical gradients scoring communication velocity and logical pacing patterns instantly upon loop close cycles.</p>
                </div>
              </div>

              <div className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-4 text-xs font-mono font-black text-gray-300 dark:text-neutral-800 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-widest pt-1">// 01.02 AUDIO CAPTURE</div>
                <div className="md:col-span-8 space-y-3">
                  <div className="flex items-center gap-3 text-gray-400 dark:text-gray-600"><Mic size={16} /> <h3 className="text-lg font-bold tracking-tight text-[#0A0A0A] dark:text-[#FAF9F6]">Dynamic Vocal Streaming</h3></div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-light leading-relaxed">Integrated browser-level frequency monitors accurately segment speech entries, triggering silent playback intervals without button dependencies.</p>
                </div>
              </div>

              <div className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-4 text-xs font-mono font-black text-gray-300 dark:text-neutral-800 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-widest pt-1">// 01.03 RECONNAISSANCE</div>
                <div className="md:col-span-8 space-y-3">
                  <div className="flex items-center gap-3 text-gray-400 dark:text-gray-600"><Building2 size={16} /> <h3 className="text-lg font-bold tracking-tight text-[#0A0A0A] dark:text-[#FAF9F6]">Enterprise Intelligence Hub</h3></div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-light leading-relaxed">Compiles target placement configurations, architectural tech expectations, and stage focus indices mapped directly to corporate profiles.</p>
                </div>
              </div>

              <div className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-4 text-xs font-mono font-black text-gray-300 dark:text-neutral-800 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-widest pt-1">// 01.04 COMPLIANCE</div>
                <div className="md:col-span-8 space-y-3">
                  <div className="flex items-center gap-3 text-gray-400 dark:text-gray-600"><Cpu size={16} /> <h3 className="text-lg font-bold tracking-tight text-[#0A0A0A] dark:text-[#FAF9F6]">Portfolio Density Audit</h3></div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-light leading-relaxed">Cross-checks document parameters and resume structures against targeted technical requirements to yield precise feedback ratings.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 📝 8. INTERACTIVE ACCORDION FAQ SECTION --- */}
        <section id="faq" className="max-w-4xl mx-auto px-6 md:px-8 pb-32 text-center relative z-20">
          <div className="space-y-4 mb-14">
            <span className="text-[9px] font-black tracking-[0.4em] text-indigo-600 uppercase font-mono">04 / KNOWLEDGE MATRIX</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] dark:text-[#FAF9F6]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4 text-left">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="border border-neutral-200/40 dark:border-white/5 rounded-2xl bg-white/40 dark:bg-[#0E0E0E]/40 backdrop-blur-md overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-6 flex justify-between items-center text-left font-bold text-sm md:text-base text-black dark:text-white cursor-pointer select-none gap-4 group"
                  >
                    <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="text-gray-400 dark:text-gray-600 shrink-0"
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-1 text-xs md:text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed border-t border-neutral-100/50 dark:border-white/[0.02]">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* 9. PLATFORM FOOTER */}
        <footer className="py-16 text-center bg-[#0A0A0A]/90 dark:bg-[#FAF9F6]/90 backdrop-blur-sm text-[#FAF9F6] dark:text-[#0A0A0A] transition-colors duration-500 relative z-30">
          <div className="text-[9px] font-mono font-bold uppercase tracking-[0.4em] opacity-40 dark:opacity-60">
            RecruitAI © 2026 / Technical Simulation Sandboxes For Engineering Teams
          </div>
        </footer>
      </div>
    </div>
  );
}