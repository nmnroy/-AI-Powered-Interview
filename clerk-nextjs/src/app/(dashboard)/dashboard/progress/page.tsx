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
  LabelList,
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

const CATEGORY_CONFIG: Record<string, { color: string; glow: string; label: string; barColor: string }> = {
  DSA:           { color: "#3b82f6", glow: "rgba(59,130,246,0.25)",   label: "DSA",           barColor: "#3b82f6" },
  HR:            { color: "#22c55e", glow: "rgba(34,197,94,0.25)",    label: "HR",            barColor: "#22c55e" },
  SYSTEM_DESIGN: { color: "#f59e0b", glow: "rgba(245,158,11,0.25)",   label: "System Design", barColor: "#f59e0b" },
  BEHAVIORAL:    { color: "#a855f7", glow: "rgba(168,85,247,0.25)",   label: "Behavioral",    barColor: "#a855f7" },
};

const STAT_CONFIG = [
  { key: "total",         label: "Total Sessions", icon: "🎯", color: "#3b82f6", glow: "rgba(59,130,246,0.15)"  },
  { key: "average",       label: "Average Score",  icon: "📊", color: "#f59e0b", glow: "rgba(245,158,11,0.15)" },
  { key: "currentStreak", label: "Current Streak", icon: "🔥", color: "#f97316", glow: "rgba(249,115,22,0.15)" },
  { key: "bestScore",     label: "Best Score",     icon: "🏆", color: "#a855f7", glow: "rgba(168,85,247,0.15)" },
];

// Custom tooltip for the bar chart
function CategoryTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const cfg = CATEGORY_CONFIG[label] ?? { color: "#fff", label: label };
  const val = payload[0]?.value;
  return (
    <div style={{
      background: "rgba(10,10,20,0.95)",
      border: `1px solid ${cfg.color}40`,
      borderRadius: 10,
      padding: "10px 16px",
      boxShadow: `0 0 20px ${cfg.color}30`,
    }}>
      <div style={{ color: cfg.color, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{cfg.label}</div>
      <div style={{ color: "#f0f0f5", fontSize: 22, fontWeight: 800 }}>{val?.toFixed(1) ?? "–"}<span style={{ fontSize: 13, color: "#8888a0", marginLeft: 4 }}>/10</span></div>
    </div>
  );
}

// Custom tooltip for the line chart
function LineTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(10,10,20,0.95)",
      border: "1px solid rgba(245,166,35,0.2)",
      borderRadius: 10,
      padding: "10px 16px",
      boxShadow: "0 0 20px rgba(245,166,35,0.15)",
    }}>
      <div style={{ color: "#8888a0", fontSize: 11, marginBottom: 4 }}>{formatDateShort(label as string)}</div>
      <div style={{ color: "#f5a623", fontSize: 22, fontWeight: 800 }}>{payload[0]?.value?.toFixed(1)}<span style={{ fontSize: 13, color: "#8888a0", marginLeft: 4 }}>/10</span></div>
    </div>
  );
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
        if (!res.ok) throw new Error("Failed to load progress data");
        const json = (await res.json()) as ProgressResponse;
        if (active) setData(json);
      } catch {
        toast.error("Something went wrong. Try again.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const answers = useMemo(() => data?.answers ?? [], [data]);
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(answers.length / pageSize));
  const currentPageAnswers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return answers.slice(start, start + pageSize);
  }, [answers, page]);

  if (!loading && (!answers || answers.length === 0)) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#f0f0f5" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📈</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No practice sessions yet</h1>
        <p style={{ color: "#8888a0", marginBottom: 24 }}>Start with your first question to see your progress here.</p>
        <Link href="/dashboard/practice" style={{
          background: "linear-gradient(135deg, #f5a623, #ff6b00)",
          color: "#fff", fontWeight: 700, padding: "12px 28px",
          borderRadius: 12, textDecoration: "none", fontSize: 14,
          border: "1px solid rgba(245,166,35,0.4)",
          boxShadow: "0 0 20px rgba(245,166,35,0.25)",
        }}>Start Practicing →</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-72 w-full rounded-3xl" />
        <Skeleton className="h-72 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", background: "var(--bg-void)", minHeight: "100%" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Link href="/dashboard" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          color: "#8888a0", fontSize: 12, marginBottom: 16,
          textDecoration: "none", fontFamily: "var(--font-mono)",
          transition: "color 0.2s"
        }}>← Dashboard</Link>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "#f0f0f5", margin: 0, fontWeight: 700 }}>Progress</h1>
        <p style={{ color: "#8888a0", fontSize: 13, fontFamily: "var(--font-mono)", marginTop: 4 }}>Track your performance and trends over time.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {STAT_CONFIG.map(cfg => {
          const raw = data?.stats?.[cfg.key as keyof typeof data.stats];
          const val = cfg.key === "average"
            ? (typeof raw === "number" ? raw.toFixed(1) : "–")
            : (raw ?? "–");
          return (
            <div key={cfg.key} style={{
              background: cfg.glow,
              border: `1px solid ${cfg.color}30`,
              borderRadius: 16, padding: "20px 24px",
              transition: "all 0.2s"
            }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{cfg.icon}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: cfg.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{cfg.label}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "#f0f0f5", fontWeight: 700 }}>{val as string}</div>
            </div>
          );
        })}
      </div>

      {/* Score Over Time */}
      <div style={{
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16, padding: "24px", marginBottom: 24
      }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#f0f0f5", margin: "0 0 20px 0", fontWeight: 700 }}>Score Over Time</h3>
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.chartData ?? []} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f5a623" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f5a623" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tickFormatter={(d) => formatDateShort(d)} stroke="#44445a" tick={{ fill: "#8888a0", fontSize: 11 }} />
              <YAxis domain={[0, 10]} stroke="#44445a" tick={{ fill: "#8888a0", fontSize: 11 }} />
              <Tooltip content={<LineTooltip />} />
              <Line type="monotone" dataKey="score" stroke="#f5a623" dot={{ r: 4, fill: "#f5a623", strokeWidth: 0 }} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance by Category */}
      <div style={{
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16, padding: "24px", marginBottom: 24
      }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#f0f0f5", margin: "0 0 24px 0", fontWeight: 700 }}>Performance by Category</h3>

        {/* Bar chart */}
        <div style={{ height: 200, marginBottom: 24 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.categoryData ?? []} margin={{ top: 16, right: 8, bottom: 0, left: -10 }} barSize={52}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="category" tickFormatter={(c) => CATEGORY_CONFIG[c]?.label ?? c} stroke="#44445a" tick={{ fill: "#8888a0", fontSize: 11 }} />
              <YAxis domain={[0, 10]} stroke="#44445a" tick={{ fill: "#8888a0", fontSize: 11 }} />
              <Tooltip content={<CategoryTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="avgScore" radius={[6, 6, 0, 0]}>
                <LabelList dataKey="avgScore" position="top" formatter={(v: number) => v?.toFixed(1)} style={{ fill: "#f0f0f5", fontSize: 11, fontWeight: 700 }} />
                {(data?.categoryData ?? []).map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={CATEGORY_CONFIG[entry.category]?.barColor ?? "#888"} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Progress bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {(data?.categoryData ?? []).map((cat) => {
            const cfg = CATEGORY_CONFIG[cat.category];
            const pct = cat.avgScore ? Math.min(100, (cat.avgScore / 10) * 100) : 0;
            return (
              <div key={cat.category}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: cfg?.color ?? "#888", fontWeight: 600 }}>{cfg?.label ?? cat.category}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#8888a0" }}>
                    {cat.avgScore?.toFixed(1) ?? "–"}/10 · {cat.count} answers
                  </span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{
                    width: `${pct}%`, height: "100%", borderRadius: 99,
                    background: cfg?.color ?? "#888",
                    boxShadow: `0 0 8px ${cfg?.glow ?? "transparent"}`,
                    transition: "width 0.6s ease"
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Answer History */}
      <div style={{
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16, padding: "24px"
      }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#f0f0f5", margin: "0 0 20px 0", fontWeight: 700 }}>Answer History</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ color: "#8888a0", fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                <th style={{ padding: "0 0 12px 0", textAlign: "left", fontWeight: 500 }}>Question</th>
                <th style={{ padding: "0 0 12px 12px", textAlign: "left", fontWeight: 500 }}>Category</th>
                <th style={{ padding: "0 0 12px 12px", textAlign: "left", fontWeight: 500 }}>Score</th>
                <th style={{ padding: "0 0 12px 12px", textAlign: "left", fontWeight: 500 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {currentPageAnswers.map((a) => {
                const cfg = CATEGORY_CONFIG[a.question.category];
                return (
                  <Fragment key={a.id}>
                    <tr
                      onClick={() => setExpanded(s => s === a.id ? null : a.id)}
                      style={{ cursor: "pointer", borderTop: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }}
                      className="hover:bg-[rgba(255,255,255,0.03)]"
                    >
                      <td style={{ padding: "12px 0", color: "#f0f0f5", maxWidth: 340, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.question.text}</td>
                      <td style={{ padding: "12px 0 12px 12px" }}>
                        <span style={{
                          fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600,
                          color: cfg?.color ?? "#888", background: `${cfg?.color ?? "#888"}15`,
                          border: `1px solid ${cfg?.color ?? "#888"}30`,
                          padding: "3px 8px", borderRadius: 4
                        }}>{cfg?.label ?? a.question.category}</span>
                      </td>
                      <td style={{ padding: "12px 0 12px 12px" }}>
                        <ScoreBadge score={a.score ?? null} />
                      </td>
                      <td style={{ padding: "12px 0 12px 12px", color: "#8888a0", fontFamily: "var(--font-mono)", fontSize: 11, whiteSpace: "nowrap" }}>
                        {new Date(a.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                    </tr>
                    {expanded === a.id && (
                      <tr>
                        <td colSpan={4} style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <div>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8888a0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Your Answer</div>
                              <p style={{ color: "#e0e0f0", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{a.content}</p>
                            </div>
                            {a.feedback && (
                              <div>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8888a0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Feedback</div>
                                <pre style={{ color: "#e0e0f0", fontSize: 12, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
                                  {(() => { try { const p = JSON.parse(a.feedback); return p.summary ?? JSON.stringify(p, null, 2); } catch { return a.feedback; } })()}
                                </pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#8888a0" }}>Page {page} of {pageCount}</span>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ label: "← Prev", fn: () => setPage(p => Math.max(1, p - 1)) }, { label: "Next →", fn: () => setPage(p => Math.min(pageCount, p + 1)) }].map(b => (
              <button key={b.label} onClick={b.fn} style={{
                fontFamily: "var(--font-mono)", fontSize: 11, color: "#8888a0",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: "6px 14px", cursor: "pointer", transition: "all 0.2s"
              }}>{b.label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
