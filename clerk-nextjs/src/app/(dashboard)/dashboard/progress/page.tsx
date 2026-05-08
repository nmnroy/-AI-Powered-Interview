"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { toast } from "sonner";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { Skeleton } from "@/components/ui/Skeleton";

type ProgressAnswer = {
  id: string;
  content: string;
  score: number | null;
  feedback: string | null;
  createdAt: string;
  question: {
    id: string;
    text: string;
    category: "DSA" | "HR" | "SYSTEM_DESIGN" | "BEHAVIORAL";
    difficulty: "EASY" | "MEDIUM" | "HARD";
    tags: string[];
  };
};

type ProgressResponse = {
  stats: {
    total: number;
    average: number | null;
    currentStreak: number;
    longestStreak: number;
    bestScore: number | null;
  };
  chartData: Array<{ date: string; score: number }>;
  categoryData: Array<{ category: string; avgScore: number | null; count: number }>;
  answers: ProgressAnswer[];
};

function formatDateShort(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function ProgressPage() {
  const [data, setData] = useState<ProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const res = await fetch("/api/progress", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to load progress data");
        }
        const json = (await res.json()) as ProgressResponse;
        if (active) setData(json);
      } catch {
        toast.error("Something went wrong. Try again.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const answers = useMemo(() => data?.answers ?? [], [data]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(answers.length / pageSize));

  const currentPageAnswers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return answers.slice(start, start + pageSize);
  }, [answers, page]);

  // Calculate % change vs last week
  const lastWeekChange = useMemo(() => {
    if (!data?.chartData || data.chartData.length < 7) return null;
    const thisWeek = data.chartData.slice(-7);
    const lastWeek = data.chartData.slice(-14, -7);
    if (lastWeek.length === 0) return null;
    const thisWeekAvg = thisWeek.reduce((sum, d) => sum + d.score, 0) / thisWeek.length;
    const lastWeekAvg = lastWeek.reduce((sum, d) => sum + d.score, 0) / lastWeek.length;
    if (lastWeekAvg === 0) return null;
    return {
      percent: ((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100,
      isPositive: thisWeekAvg > lastWeekAvg,
    };
  }, [data?.chartData]);

  if (!loading && (!answers || answers.length === 0)) {
    return (
      <div className="dashboard-card mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center rounded-[2rem] p-8 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/10 text-4xl">
          📈
        </div>
        <h1 className="text-2xl font-semibold text-white">No practice sessions yet</h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
          Start with your first question to see your progress here.
        </p>
        <Link href="/dashboard/practice" className="dashboard-btn-gradient mt-6 rounded-full px-6 py-3">
          Start Practicing
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-3xl" />
        <Skeleton className="h-72 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <Link href="/dashboard" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: '#64748b',
          fontSize: 13,
          marginBottom: 16,
          textDecoration: 'none',
          padding: '6px 12px',
          borderRadius: 8,
          border: '1px solid #1e2d4a',
          background: 'transparent',
          transition: 'all 0.2s',
        }}>
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-semibold text-white">Progress</h1>
        <p className="text-sm text-slate-400">Track your performance and trends over time.</p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard title="Total Sessions" value={data?.stats?.total ?? 0} />
        <StatCard title="Average Score" value={data?.stats?.average?.toFixed(1) ?? "-"} />
        <StatCard title="Current Streak" value={data?.stats?.currentStreak ?? 0} />
        <StatCard
          title="Best Score Ever"
          value={data?.stats?.bestScore ?? "-"}
        />
      </section>

      <section>
        <div className="dashboard-card rounded-xl p-4">
          <h3 className="mb-4 text-lg font-semibold text-white">Score Over Time</h3>
          <div className="overflow-x-auto">
            <div className="min-w-[640px]" style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.chartData ?? []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(d) => formatDateShort(d)} />
                  <YAxis domain={[0, 10]} />
                  <Tooltip labelFormatter={(l) => formatDateShort(l as string)} />
                  <Line type="monotone" dataKey="score" stroke="#0ea5e9" dot={{ r: 4 }} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="dashboard-card rounded-xl p-4">
          <h3 className="mb-4 text-lg font-semibold text-white">Performance by Category</h3>
          <div className="overflow-x-auto">
            <div className="min-w-[640px]" style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.categoryData ?? []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="avgScore">
                    {(data?.categoryData ?? []).map((entry, index: number) => (
                      <Cell key={`cell-${index}`} fill={["#0ea5e9", "#34d399", "#f59e0b", "#f97316"][index % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
        <section>
          <div className="dashboard-card rounded-xl p-4">
            <h3 className="mb-4 text-lg font-semibold text-white">Score Over Time</h3>
            <div className="overflow-x-auto">
              <div className="min-w-[640px]" style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.chartData ?? []}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
                    <XAxis dataKey="date" tickFormatter={(d) => formatDateShort(d)} stroke="#64748b" />
                    <YAxis domain={[0, 10]} stroke="#64748b" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0d1526", border: "1px solid #1e2d4a" }}
                      labelFormatter={(l) => formatDateShort(l as string)}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#06b6d4"
                      fill="url(#colorScore)"
                      dot={{ r: 4 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="dashboard-card rounded-xl p-6">
            <h3 className="mb-6 text-lg font-semibold text-white">Performance by Category</h3>
            <div className="space-y-4">
              {(data?.categoryData ?? []).map((category, index) => {
                const colors = [
                  { bar: "from-cyan-500 to-cyan-400", label: "text-cyan-300" },
                  { bar: "from-purple-500 to-purple-400", label: "text-purple-300" },
                  { bar: "from-orange-500 to-orange-400", label: "text-orange-300" },
                  { bar: "from-emerald-500 to-emerald-400", label: "text-emerald-300" },
                ];
                const color = colors[index % 4];
                const percent = category.avgScore ? Math.min(100, (category.avgScore / 10) * 100) : 0;
                return (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold ${color.label}`}>
                        {category.category.replace("_", " ")}
                      </p>
                      <span className="text-xs text-slate-400">
                        {category.avgScore?.toFixed(1) ?? "-"}/10 ({category.count} answers)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#1e2d4a] overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className={`h-2 rounded-full bg-gradient-to-r ${color.bar} transition-all duration-500`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      <section>
        <div className="dashboard-card rounded-xl p-4">
          <h3 className="mb-4 text-lg font-semibold text-white">Full Answer History</h3>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-slate-400">
                  <th className="py-2">Question</th>
                  <th>Category</th>
                  <th>Score</th>
                  <th>Date</th>
                  <th>Feedback Preview</th>
                </tr>
              </thead>
              <tbody>
                {currentPageAnswers.map((a) => (
                  <Fragment key={a.id}>
                    <tr
                      className="cursor-pointer text-slate-200 hover:bg-[#111b31]"
                      onClick={() => setExpanded((s) => (s === a.id ? null : a.id))}
                    >
                      <td className="py-3">{a.question.text}</td>
                      <td>{a.question.category.replace("_", " ")}</td>
                      <td>
                        <ScoreBadge score={a.score ?? null} />
                      </td>
                      <td>{new Date(a.createdAt).toLocaleString()}</td>
                      <td>
                        {a.feedback
                          ? (() => {
                              try {
                                const p = JSON.parse(a.feedback);
                                return p.summary ?? JSON.stringify(p).slice(0, 80) + "...";
                              } catch {
                                return String(a.feedback).slice(0, 80) + "...";
                              }
                            })()
                          : (a.content || "").slice(0, 80) + "..."}
                      </td>
                    </tr>

                    {expanded === a.id && (
                      <tr>
                        <td colSpan={5} className="bg-[#111b31] p-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-white">Question</h4>
                              <p className="text-slate-200">{a.question.text}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">Your Answer</h4>
                              <p className="whitespace-pre-wrap text-slate-200">{a.content}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">Feedback</h4>
                              <pre className="whitespace-pre-wrap text-sm text-slate-200">{a.feedback ?? "No feedback yet"}</pre>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-400">Page {page} of {pageCount}</div>
            <div className="flex gap-2">
              <button className="rounded-md border border-[#1e2d4a] px-3 py-1 text-slate-200" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Prev
              </button>
              <button className="rounded-md border border-[#1e2d4a] px-3 py-1 text-slate-200" onClick={() => setPage((p) => Math.min(pageCount, p + 1))}>
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number | null }) {
  return (
    <div className="dashboard-card rounded-xl p-4">
      <p className="text-sm text-slate-300">{title}</p>
      <div className="mt-2 text-2xl font-semibold text-white">{value ?? "-"}</div>
    </div>
  );
}
