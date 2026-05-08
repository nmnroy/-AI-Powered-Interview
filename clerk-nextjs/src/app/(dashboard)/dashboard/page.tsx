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
  { title: "Current Streak", icon: Flame, topBorderColor: "from-cyan-500 to-cyan-400", glowColor: "0 -2px 20px rgba(0,212,255,0.1)" },
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

      {/* QUICK ACTION CARDS */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="dashboard-card group rounded-3xl p-6 shadow-[0_12px_40px_rgba(5,10,24,0.35)] transition-all duration-300 hover:-translate-y-1"
                style={{ transition: 'all 0.25s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = action.hoverGlow}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 12px 40px rgba(5,10,24,0.35)'}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/12 text-cyan-300 transition duration-300 group-hover:bg-cyan-500/20">
                  <Icon className="h-5 w-5 transition duration-300 group-hover:translate-x-1" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{action.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{action.description}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-cyan-300 opacity-0 transition duration-300 group-hover:opacity-100">
                  Get started <ArrowRight className="h-3 w-3 transition duration-300 group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* RECENT ANSWERS SECTION */}
      <section className="dashboard-card rounded-[2rem] p-6 shadow-[0_12px_40px_rgba(5,10,24,0.35)] sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Recent Answers</h2>
            <p className="mt-1 text-sm text-slate-400">Your latest five attempts and scores.</p>
          </div>
          {!loading && data?.recentAnswers.length ? (
            <Link href="/dashboard/progress" className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition">
              View All →
            </Link>
          ) : null}
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-16 rounded-2xl" />
              ))}
            </div>
          ) : data?.recentAnswers.length ? (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-400 border-b border-[#1e2d4a]">
                  <th className="pb-3 px-3">Question Preview</th>
                  <th className="pb-3 px-3">Category</th>
                  <th className="pb-3 px-3">Score</th>
                  <th className="pb-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.recentAnswers.map((answer) => (
                  <tr key={answer.id} className="border-b border-[#1e2d4a]/50 hover:bg-[#0d1526]/50 transition">
                    <td className="py-4 px-3">
                      <p className="text-sm text-slate-100 line-clamp-2">
                        {answer.question.text}
                      </p>
                    </td>
                    <td className="py-4 px-3">
                      <span className="text-xs font-medium text-slate-400">
                        {answer.question.category.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <ScoreBadge score={answer.score} />
                    </td>
                    <td className="py-4 px-3">
                      <Link href="/dashboard/progress" className="text-cyan-400 hover:text-cyan-300 transition">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#1e2d4a] p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 mx-auto text-2xl">
                📝
              </div>
              <p className="text-sm font-medium text-slate-300">No practice sessions yet</p>
              <p className="mt-2 text-xs text-slate-400">
                Start your first practice session to see your recent results here.
              </p>
              <Link href="/dashboard/practice" className="mt-4 inline-block text-xs font-semibold text-cyan-300 hover:text-cyan-200">
                Start Practicing →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}