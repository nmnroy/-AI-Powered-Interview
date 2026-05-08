"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, Copy, Eye, Flame, MessageSquare, Sparkles, Target, TrendingUp, WandSparkles } from "lucide-react";
import { toast } from "sonner";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import type { DashboardDataType } from "@/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
  { title: "Skill Proficiency", icon: Flame, topBorderColor: "from-cyan-500 to-cyan-400", glowColor: "0 -2px 20px rgba(0,212,255,0.1)" },
  { title: "Total Answers", icon: MessageSquare, topBorderColor: "from-purple-500 to-purple-400", glowColor: "0 -2px 20px rgba(124,58,237,0.1)" },
  { title: "Average Score", icon: Sparkles, topBorderColor: "from-emerald-500 to-emerald-400", glowColor: "0 -2px 20px rgba(16,185,129,0.1)" },
  { title: "Questions Left Today", icon: Target, topBorderColor: "from-blue-500 to-blue-400", glowColor: "0 -2px 20px rgba(59,130,246,0.1)" },
] as const;

const quickActions = [
  {
    title: "Start Practice Session",
    description: "Jump into a focused round of interview questions.",
    href: "/dashboard/practice",
    icon: Target,
    hoverGlow: "0 0 25px rgba(0,212,255,0.1)",
  },
  {
    title: "Generate from Job Description",
    description: "Paste a role description and get tailored practice.",
    href: "/dashboard/generate",
    icon: WandSparkles,
    hoverGlow: "0 0 25px rgba(124,58,237,0.1)",
  },
  {
    title: "View My Progress",
    description: "Review streaks, scores, and answer trends.",
    href: "/dashboard/progress",
    icon: TrendingUp,
    hoverGlow: "0 0 25px rgba(59,130,246,0.1)",
  },
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
      {/* HERO SECTION WITH ANIMATED GRADIENT BORDER */}
      <section className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_80px_rgba(5,10,24,0.35)]">
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-[2rem] p-0.5 gradient-border-animated" />
        
        {/* Grid background */}
        <div className="relative rounded-[2rem] p-6 sm:p-8 grid-background" style={{
          background: 'linear-gradient(135deg, rgba(0,212,255,0.05) 0%, rgba(124,58,237,0.05) 100%)',
          border: '1px solid rgba(0,212,255,0.2)',
          boxShadow: '0 0 40px rgba(0,212,255,0.05) inset'
        }}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 dark:text-cyan-200">
                <Sparkles className="h-4 w-4" />
                Ready for your next session
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                {getTimeGreeting()}, {firstName}! Ready to practice today?
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 dark:text-slate-300">
                Keep momentum going with targeted practice, fast feedback, and a clear view of your progress.
              </p>
              <p className="mt-3 italic text-gray-500 dark:text-slate-400 text-sm">
                "{getQuoteOfDay()}"
              </p>
            </div>

            <Link
              href="/dashboard/practice"
              className="dashboard-btn-gradient inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 active:translate-y-0 animate-pulse"
            >
              Start Practice
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* STREAK MOTIVATIONAL BANNER */}
      {!loading && data && (
        <section>
          {data.currentStreak === 0 ? (
            <div className="dashboard-card rounded-2xl p-4 border-l-4 border-amber-500 bg-amber-500/10">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-200">
                🌟 Start your streak today! Practice one question to kick off your winning streak.
              </p>
            </div>
          ) : data.currentStreak >= 7 ? (
            <div className="dashboard-card rounded-2xl p-4 border-l-4 border-transparent bg-gradient-to-r from-emerald-500/10 to-purple-500/10">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                🏆 {data.currentStreak} days! You're on fire! Keep up the amazing streak!
              </p>
            </div>
          ) : data.currentStreak >= 3 ? (
            <div className="dashboard-card rounded-2xl p-4 border-l-4 border-emerald-500 bg-emerald-500/10">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                🔥 {data.currentStreak} day streak! Keep it going—momentum matters!
              </p>
            </div>
          ) : null}
        </section>
      )}

      {/* STATS CARDS */}
      {loading ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-3xl" />
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
                <article
                  key={item.title}
                  className="dashboard-card rounded-3xl p-5 shadow-[0_12px_40px_rgba(5,10,24,0.35)] transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 relative group overflow-hidden"
                  style={{ boxShadow: item.glowColor }}
                >
                  {/* Gradient top border */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.topBorderColor}`} />
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-600 dark:text-slate-300">{item.title}</p>
                    <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-cyan-300 ${
                      index === 0 && typeof value === "number" && value > 0 ? "animate-flame" : ""
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {typeof value === "number" ? value : value ?? "-"}
                  </p>

                  {/* Circular progress for Average Score */}
                  {index === 2 && typeof value === "number" && (
                    <div className="mt-4">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#1e2d4a" strokeWidth="4" />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="url(#gradientScore)"
                          strokeWidth="4"
                          strokeDasharray={`${(value / 10) * 282.7} 282.7`}
                          strokeLinecap="round"
                          className="transition-all duration-500"
                        />
                        <defs>
                          <linearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#7c3aed" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute bottom-4 right-4 text-xs text-gray-500 dark:text-slate-400">
                        {Math.round((value / 10) * 100)}%
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* PERFORMANCE TREND & RECENT SESSIONS */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* CHART */}
        <div className="lg:col-span-2 dashboard-card rounded-[2rem] p-6 shadow-[0_12px_40px_rgba(5,10,24,0.35)]">
          <h2 className="mb-6 text-xl font-semibold text-white">Performance Trend</h2>
          <div className="h-72 w-full">
            {loading ? (
               <Skeleton className="h-full w-full rounded-2xl" />
            ) : data && data.recentAnswers.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.recentAnswers.slice().reverse()} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" vertical={false} />
                  <XAxis dataKey="createdAt" stroke="#64748b" tickFormatter={(val: any) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})} />
                  <YAxis stroke="#64748b" domain={[0, 10]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e2d4a', borderRadius: '1rem' }}
                    labelFormatter={(val: any) => val ? new Date(val).toLocaleString() : ''}
                  />
                  <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#fff', stroke: '#06b6d4' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  Not enough data to display trend
                </div>
            )}
          </div>
        </div>

        {/* TIMELINE */}
        <div className="lg:col-span-1 dashboard-card rounded-[2rem] p-6 shadow-[0_12px_40px_rgba(5,10,24,0.35)] flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Sessions</h2>
            {!loading && data?.recentAnswers.length ? (
              <Link href="/dashboard/progress" className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition">
                View All →
              </Link>
            ) : null}
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
              </div>
            ) : data?.recentAnswers.length ? (
              <div className="relative border-l border-slate-700/50 pl-4 py-2 space-y-6">
                {data.recentAnswers.map((answer) => (
                  <div key={answer.id} className="relative">
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-cyan-400 border-2 border-[#090e1a]" />
                    <p className="text-xs text-slate-400 mb-1">{formatDate(answer.createdAt)}</p>
                    <p className="text-sm text-slate-200 font-medium line-clamp-1">{answer.question.category.replace("_", " ")}</p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-500 line-clamp-1 flex-1">{answer.question.text}</span>
                      <ScoreBadge score={answer.score} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-sm text-slate-400">No recent sessions yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}