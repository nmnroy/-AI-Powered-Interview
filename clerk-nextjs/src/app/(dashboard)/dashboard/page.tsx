"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, Code, Terminal, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import type { DashboardDataType } from "@/types";

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getCategoryBadgeStyle(category: string) {
  const cat = category.toUpperCase();
  if (cat.includes("DSA")) return { color: "var(--indigo)", background: "var(--indigo-dim)" };
  if (cat.includes("SYSTEM_DESIGN")) return { color: "#f59e0b", background: "rgba(245,158,11,0.1)" };
  if (cat.includes("BEHAVIORAL")) return { color: "#22c55e", background: "rgba(34,197,94,0.1)" };
  // Default / HR
  return { color: "var(--accent)", background: "var(--accent-dim)" };
}

function getScoreColor(score: number) {
  if (score >= 8) return "var(--accent)";
  if (score >= 5) return "var(--text-primary)";
  return "rgba(239, 68, 68, 0.8)"; // dimmed red
}

function getAverageScoreColor(score: number) {
  if (score > 7) return "var(--accent)";
  if (score < 5) return "rgba(239, 68, 68, 0.8)";
  return "var(--text-primary)";
}

function getCategoryBadgeStyle(category: string) {
  const cat = category.toUpperCase();
  if (cat.includes("DSA")) return { color: "var(--indigo)", background: "var(--indigo-dim)" };
  if (cat.includes("SYSTEM_DESIGN")) return { color: "#f59e0b", background: "rgba(245,158,11,0.1)" };
  if (cat.includes("BEHAVIORAL")) return { color: "#22c55e", background: "rgba(34,197,94,0.1)" };
  // Default / HR
  return { color: "var(--accent)", background: "var(--accent-dim)" };
}

function getScoreColor(score: number) {
  if (score >= 8) return "var(--accent)";
  if (score >= 5) return "var(--text-primary)";
  return "rgba(239, 68, 68, 0.8)"; // dimmed red
}

function getAverageScoreColor(score: number) {
  if (score > 7) return "var(--accent)";
  if (score < 5) return "rgba(239, 68, 68, 0.8)";
  return "var(--text-primary)";
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
        if (active) setData(json);
      } catch {
        toast.error("Something went wrong. Try again.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadDashboard();
    return () => { active = false; };
  }, []);

  const firstName = user?.firstName ?? "User";
  const currentDate = new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' });

  // Quick actions array
  const quickActions = [
    { title: "DSA Practice", desc: "Algorithms & Data Structures", icon: Code, href: "/dashboard/practice?category=dsa" },
    { title: "System Design", desc: "Architecture & Scalability", icon: Terminal, href: "/dashboard/practice?category=system_design" },
    { title: "HR / Behavioral", desc: "Leadership & Culture", icon: MessageSquare, href: "/dashboard/practice?category=hr" }
  ];

  if (loading) {
    return <div style={{ padding: '40px', background: 'var(--bg-void)', minHeight: '100%', color: 'var(--text-muted)' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '40px', background: 'var(--bg-void)', minHeight: '100%' }}>
      {/* TOP ROW */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
            {getTimeGreeting()}, {firstName}.
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
            {currentDate}
          </p>
        </div>
        <Link 
          href="/dashboard/practice" 
          style={{
            background: 'var(--accent)',
            color: '#000',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '14px',
            padding: '12px 24px',
            borderRadius: 'var(--radius-sm)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background 0.2s'
          }}
          className="hover:bg-[var(--accent-bright)]"
        >
          Start Practice →
        </Link>
      </div>

      {/* METRICS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        {/* Streak */}
        <div className="hover:border-[var(--border-default)] transition-colors" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Streak</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--text-primary)', marginTop: '8px', fontWeight: 700 }}>
            {data?.currentStreak ?? 0} {data && data.currentStreak > 0 ? "🔥" : ""}
          </div>
        </div>
        {/* Total Answers */}
        <div className="hover:border-[var(--border-default)] transition-colors" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Answers</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--text-primary)', marginTop: '8px', fontWeight: 700 }}>
            {data?.totalAnswers ?? 0}
          </div>
        </div>
        {/* Average Score */}
        <div className="hover:border-[var(--border-default)] transition-colors" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Score</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: getAverageScoreColor(data?.averageScore ?? 0), marginTop: '8px', fontWeight: 700 }}>
            {data?.averageScore !== null ? data?.averageScore : "-"}
          </div>
        </div>
        {/* Questions Today (or Left) */}
        <div className="hover:border-[var(--border-default)] transition-colors" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Questions Today</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--text-primary)', marginTop: '8px', fontWeight: 700 }}>
            {data?.questionsLeftToday !== undefined ? Math.max(0, 30 - data.questionsLeftToday) : 0}
      </div>

      {/* METRICS ROW (4 items, horizontal) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {/* Current Streak */}
        <div className="hover:border-[rgba(249,115,22,0.3)] transition-colors" style={{ background: 'rgba(249, 115, 22, 0.05)', border: '1px solid rgba(249, 115, 22, 0.15)', borderRadius: '16px', padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Streak</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: '#f0f0f5', marginTop: '8px', fontWeight: 700 }}>
            {data?.currentStreak ?? 0} {data && data.currentStreak > 0 ? "🔥" : ""}
          </div>
        </div>

        {/* Total Answers */}
        <div className="hover:border-[rgba(59,130,246,0.3)] transition-colors" style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: '16px', padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Answers</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: '#f0f0f5', marginTop: '8px', fontWeight: 700 }}>
            {data?.totalAnswers ?? 0}
          </div>
        </div>

        {/* Average Score */}
        <div className="hover:border-[rgba(34,197,94,0.3)] transition-colors" style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.15)', borderRadius: '16px', padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Score</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: getAverageScoreColor(data?.averageScore ?? 0), marginTop: '8px', fontWeight: 700 }}>
            {data?.averageScore !== null ? data?.averageScore : "-"}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 16px 0', fontWeight: 400 }}>Jump back in</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {quickActions.map((action, i) => (
            <Link 
              key={i} 
              href={action.href}
              className="group hover:border-[var(--border-default)] transition-all"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ color: 'var(--text-primary)' }}><action.icon size={20} /></div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>{action.title}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{action.desc}</div>
                </div>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" className="group-hover:translate-x-1 transition-transform group-hover:text-[var(--text-primary)]" />
            </Link>
          ))}
        </div>
      </div>

      {/* RECENT ANSWERS */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 16px 0', fontWeight: 400 }}>Recent sessions</h2>
        
        {data && data.recentAnswers.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.recentAnswers.map(ans => {
              const badgeStyle = getCategoryBadgeStyle(ans.question.category);
              return (
                <div 
                  key={ans.id}
                  className="hover:bg-[var(--bg-surface)] transition-colors"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    gap: '16px'
                  }}
                >
                  <div style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ans.question.text}
                  </div>
                  <div style={{ 
                    fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px',
                    color: badgeStyle.color, background: badgeStyle.background, whiteSpace: 'nowrap'
                  }}>
                    {ans.question.category.replace('_', ' ')}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: getScoreColor(ans.score ?? 0) }}>
                    {(ans.score ?? 0).toFixed(1)}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', minWidth: '80px', textAlign: 'right' }}>
                    {formatDate(ans.createdAt)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
              .cursor-blink { animation: blink 1s step-end infinite; }
            `}} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text-muted)' }}>
              &gt; no sessions yet<span className="cursor-blink">_</span>
            </div>
            <Link 
              href="/dashboard/practice"
              style={{
                marginTop: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: 'var(--accent)',
                textDecoration: 'none'
              }}
              className="hover:underline"
            >
              practice now →
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}