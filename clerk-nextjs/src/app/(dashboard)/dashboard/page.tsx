"use client";

import Link from "next/link";
import { useEffect, useState, useRef, MouseEvent } from "react";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, Copy, Eye, Flame, MessageSquare, Sparkles, Target, TrendingUp, WandSparkles } from "lucide-react";
import { toast } from "sonner";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import type { DashboardDataType } from "@/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// --- Interactive Spotlight Card Component ---
function SpotlightCard({ children, className = "", glowColor = "rgba(0,212,255,0.15)", style = {} }: any) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 40%)`,
          zIndex: 0
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
// ---------------------------------------------

const DAILY_QUOTES = [
  "The only way to do great work is to love what you do. — Steve Jobs",
  "Success is the sum of small efforts repeated day in and day out. — Robert Collier",
  "Great things never come from comfort zones.",
  "Your limitation—it's only your imagination.",
  "Excellence is not a destination; it's a continuous journey.",
  "The best time to start was yesterday. The second best time is now.",
  "Your future self is watching you right now through memories.",
];

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getQuoteOfDay(): string {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
}

const statCardStyles = [
  { title: "Skill Proficiency", icon: Flame, topBorderColor: "from-cyan-500 to-cyan-400", glowColor: "0 -2px 20px rgba(0,212,255,0.1)", hoverColor: "rgba(0,212,255,0.2)" },
  { title: "Total Answers", icon: MessageSquare, topBorderColor: "from-purple-500 to-purple-400", glowColor: "0 -2px 20px rgba(124,58,237,0.1)", hoverColor: "rgba(124,58,237,0.2)" },
  { title: "Average Score", icon: Sparkles, topBorderColor: "from-emerald-500 to-emerald-400", glowColor: "0 -2px 20px rgba(16,185,129,0.1)", hoverColor: "rgba(16,185,129,0.2)" },
  { title: "Questions Left Today", icon: Target, topBorderColor: "from-blue-500 to-blue-400", glowColor: "0 -2px 20px rgba(59,130,246,0.1)", hoverColor: "rgba(59,130,246,0.2)" },
] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function DashboardHomePage() {
  const [data, setData] = useState<DashboardDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await fetch("/api/dashboard", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load dashboard data");
        }

        const json = (await response.json()) as DashboardDataType;

        if (active) {
          setData(json);
        }
      } catch {
        toast.error("Something went wrong. Try again.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const firstName = user?.firstName ?? "there";

  return (
    <div className="space-y-8">
      {/* Dashboard Header with Theme Toggle */}
      <div className="flex justify-end">
        <ThemeToggle />
      </div>

      {/* HERO SECTION WITH ANIMATED GRADIENT BORDER & SPOTLIGHT */}
      <SpotlightCard
        className="rounded-[2rem] shadow-[0_20px_80px_rgba(5,10,24,0.35)]"
        glowColor="rgba(124,58,237,0.25)"
      >
        <div className="absolute inset-0 rounded-[2rem] p-0.5 gradient-border-animated" />
        <div className="relative rounded-[2rem] p-8 sm:p-12 grid-background h-full w-full" style={{
          background: 'linear-gradient(135deg, rgba(0,212,255,0.05) 0%, rgba(124,58,237,0.05) 100%)',
          border: '1px solid rgba(0,212,255,0.2)',
          boxShadow: '0 0 40px rgba(0,212,255,0.05) inset'
        }}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between z-20 relative">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 dark:text-cyan-200 shadow-[0_0_15px_rgba(0,212,255,0.3)]">
                <Sparkles className="h-4 w-4 animate-pulse" />
                Ready for your next session
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
                {getTimeGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">{firstName.toUpperCase()}</span>!
                <br /> Ready to practice today?
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-slate-300">
                Keep momentum going with targeted practice, fast feedback, and a clear view of your progress.
              </p>
              <p className="mt-4 italic text-gray-500 dark:text-slate-400 text-sm opacity-80 border-l-2 border-purple-500/50 pl-4">
                "{getQuoteOfDay()}"
              </p>
            </div>

            <Link
              href="/dashboard/practice"
              className="dashboard-btn-gradient inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] active:scale-95"
            >
              Start Practice
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </SpotlightCard>

      {/* STREAK MOTIVATIONAL BANNER */}
      {!loading && data && (
        <section>
          {data.currentStreak === 0 ? (
            <SpotlightCard className="rounded-2xl p-4 border-l-4 border-amber-500 bg-amber-500/10 transition-all hover:scale-[1.01]" glowColor="rgba(245,158,11,0.2)">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-200 flex items-center gap-2">
                <span className="text-lg animate-bounce">🌟</span> Start your streak today! Practice one question to kick off your winning streak.
              </p>
            </SpotlightCard>
          ) : data.currentStreak >= 7 ? (
            <SpotlightCard className="rounded-2xl p-4 border-l-4 border-emerald-500 bg-gradient-to-r from-emerald-500/10 to-purple-500/10 transition-all hover:scale-[1.01]" glowColor="rgba(16,185,129,0.2)">
              <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-lg">🏆</span> {data.currentStreak} days! You're on fire! Keep up the amazing streak!
              </p>
            </SpotlightCard>
          ) : data.currentStreak >= 3 ? (
            <SpotlightCard className="rounded-2xl p-4 border-l-4 border-emerald-500 bg-emerald-500/10 transition-all hover:scale-[1.01]" glowColor="rgba(16,185,129,0.2)">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-200 flex items-center gap-2">
                <span className="text-lg">🔥</span> {data.currentStreak} day streak! Keep it going—momentum matters!
              </p>
            </SpotlightCard>
          ) : null}
        </section>
      )}

      {/* STATS CARDS WITH SPOTLIGHT */}
      {loading ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-3xl" />
          ))}
        </section>
      ) : (
        <section>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {statCardStyles.map((item, index) => {
              const Icon = item.icon;
              const statValues = [
                data?.currentStreak ?? 0,
                data?.totalAnswers ?? 0,
                data?.averageScore ?? null,
                data?.questionsLeftToday ?? 5,
              ];
              const value = statValues[index];

              return (
                <SpotlightCard
                  key={item.title}
                  className="dashboard-card rounded-3xl p-6 shadow-[0_12px_40px_rgba(5,10,24,0.35)] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative group overflow-hidden"
                  glowColor={item.hoverColor}
                  style={{ boxShadow: item.glowColor }}
                >
                  {/* Gradient top border */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.topBorderColor} opacity-70 group-hover:opacity-100 transition-opacity`} />
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-600 dark:text-slate-300 group-hover:text-white transition-colors">{item.title}</p>
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform ${
                      index === 0 && typeof value === "number" && value > 0 ? "animate-flame" : ""
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="mt-5 text-4xl font-bold tracking-tight text-gray-900 dark:text-white drop-shadow-md">
                    {typeof value === "number" ? value : value ?? "-"}
                  </p>

                  {/* Circular progress for Average Score */}
                  {index === 2 && typeof value === "number" && (
                    <div className="absolute bottom-4 right-4 group-hover:scale-110 transition-transform">
                      <svg className="w-16 h-16 transform -rotate-90 drop-shadow-lg" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(30, 45, 74, 0.5)" strokeWidth="6" />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="url(#gradientScore)"
                          strokeWidth="6"
                          strokeDasharray={`${(value / 10) * 282.7} 282.7`}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#7c3aed" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-slate-300">
                        {Math.round((value / 10) * 100)}%
                      </div>
                    </div>
                  )}
                </SpotlightCard>
              );
            })}
          </div>
        </section>
      )}

      {/* PERFORMANCE TREND & RECENT SESSIONS */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* CHART WITH SPOTLIGHT */}
        <SpotlightCard className="lg:col-span-2 dashboard-card rounded-[2rem] p-8 shadow-[0_12px_40px_rgba(5,10,24,0.35)] transition-all hover:border-cyan-400/30" glowColor="rgba(0,212,255,0.15)">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-cyan-400" /> Performance Trend
            </h2>
          </div>
          <div className="h-80 w-full relative z-10">
            {loading ? (
               <Skeleton className="h-full w-full rounded-2xl" />
            ) : data && data.recentAnswers.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.recentAnswers.slice().reverse()} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(30, 45, 74, 0.6)" vertical={false} />
                  <XAxis dataKey="createdAt" stroke="#64748b" tickFormatter={(val: any) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})} tickMargin={10} />
                  <YAxis stroke="#64748b" domain={[0, 10]} tickMargin={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #1e2d4a', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}
                    labelFormatter={(val: any) => val ? new Date(val).toLocaleString() : ''}
                  />
                  <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={4} dot={{ r: 5, fill: '#0a0f1e', stroke: '#06b6d4', strokeWidth: 2 }} activeDot={{ r: 8, fill: '#fff', stroke: '#06b6d4', strokeWidth: 2 }} fillOpacity={1} fill="url(#colorScore)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700/50">
                  Not enough data to display trend
                </div>
            )}
          </div>
        </SpotlightCard>

        {/* TIMELINE WITH SPOTLIGHT */}
        <SpotlightCard className="lg:col-span-1 dashboard-card rounded-[2rem] p-8 shadow-[0_12px_40px_rgba(5,10,24,0.35)] flex flex-col transition-all hover:border-purple-400/30" glowColor="rgba(124,58,237,0.15)">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Recent Sessions</h2>
            {!loading && data?.recentAnswers.length ? (
              <Link href="/dashboard/progress" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200 transition-colors bg-cyan-400/10 px-3 py-1.5 rounded-full">
                View All
              </Link>
            ) : null}
          </div>
          <div className="flex-1 overflow-y-auto pr-2 relative z-10 custom-scrollbar">
            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
              </div>
            ) : data?.recentAnswers.length ? (
              <div className="relative border-l-2 border-slate-700/50 pl-6 py-2 space-y-8">
                {data.recentAnswers.map((answer) => (
                  <div key={answer.id} className="relative group cursor-pointer hover:bg-white/5 p-3 -mx-3 rounded-xl transition-colors">
                    {/* Glowing timeline dot */}
                    <div className="absolute -left-[35px] top-2 h-4 w-4 rounded-full bg-cyan-400 border-4 border-[#0a0f1e] group-hover:scale-125 group-hover:shadow-[0_0_10px_#06b6d4] transition-all" />
                    
                    <p className="text-xs text-cyan-400 mb-1 font-medium">{formatDate(answer.createdAt)}</p>
                    <p className="text-base text-slate-100 font-semibold line-clamp-1">{answer.question.category.replace("_", " ")}</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-400 line-clamp-1 flex-1 italic">"{answer.question.text}"</span>
                      <div className="scale-90 origin-right">
                        <ScoreBadge score={answer.score} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-10 space-y-4">
                <div className="h-16 w-16 rounded-full bg-slate-800/50 flex items-center justify-center text-2xl">📭</div>
                <p className="text-sm text-slate-400 max-w-[200px]">No recent sessions. Start practicing to fill this up!</p>
              </div>
            )}
          </div>
        </SpotlightCard>
      </section>
    </div>
  );
}