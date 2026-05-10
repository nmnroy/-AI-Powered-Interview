"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type { QuestionType } from "@/types";
import { Skeleton } from "@/components/ui/Skeleton";
import ProctoringCamera from "@/components/shared/ProctoringCamera";
import { Mic } from "lucide-react";

type Mode = "select" | "write" | "feedback";

function formatTime(s: number) {
  const mm = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

function getCategoryBadgeStyle(category: string) {
  const cat = category.toUpperCase();
  if (cat.includes("DSA")) return { color: "#6366f1", background: "rgba(99,102,241,0.12)" };
  if (cat.includes("SYSTEM_DESIGN") || cat.includes("SYSTEM DESIGN")) return { color: "#f59e0b", background: "rgba(245,158,11,0.1)" };
  if (cat.includes("BEHAVIORAL")) return { color: "#22c55e", background: "rgba(34,197,94,0.1)" };
  return { color: "#f5a623", background: "rgba(245,166,35,0.15)" };
}

function getDifficultyBadgeStyle(difficulty: string) {
  const diff = difficulty.toUpperCase();
  if (diff === "EASY") return { color: "#22c55e", background: "rgba(34,197,94,0.1)" };
  if (diff === "MEDIUM") return { color: "#f59e0b", background: "rgba(245,158,11,0.1)" };
  if (diff === "HARD") return { color: "rgba(239, 68, 68, 0.8)", background: "rgba(239, 68, 68, 0.1)" };
  return { color: "#8888a0", background: "rgba(255,255,255,0.05)" };
}

export default function PracticePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [mode, setMode] = useState<Mode>("select");
  const [category, setCategory] = useState<string>("All");
  const [difficulty, setDifficulty] = useState<string>("All");
  const [language, setLanguage] = useState("Python");
  
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [content, setContent] = useState("");
  const [timerSec, setTimerSec] = useState(0);
  const timerRef = useRef<number | null>(null);
  
  const [questionLoading, setQuestionLoading] = useState(Boolean(searchParams.get("questionId")));
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedback, setFeedback] = useState<any | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [cameraStats, setCameraStats] = useState({ noFaceWarnings: 0, multipleFaceWarnings: 0, sessionDuration: 0 });
  const [runningCode, setRunningCode] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);

  const getBoilerplate = (lang: string) => {
    switch(lang) {
      case "Python": return "# Welcome to your Python project!\n\n";
      case "Java": return 'class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World in Java");\n    }\n}\n';
      case "C++": return '// Online C++ compiler to run C++ program online\n#include <iostream>\n\nint main() {\n    // Write C++ code here\n    std::cout << "Start small. Ship something.";\n\n    return 0;\n}\n';
      case "JavaScript": return '// Online JavaScript Editor — Write, Edit and Run your code here\n// Try console.log("Hello, World!") to get started\n\nfunction greet(name) {\n  return `Hello, ${name}! Welcome to PrepAI.`;\n}\n\nconsole.log(greet("World"));\n';
      case "TypeScript": return '// Online TypeScript Editor — Write, Edit and Run your code here\n// Try console.log("Hello, World!") to get started\n\nfunction greet(name: string): string {\n  return `Hello, ${name}! Welcome to PrepAI.`;\n}\n\nconsole.log(greet("World"));\n';
      default: return "";
    }
  };

  useEffect(() => {
    if (question?.category === "DSA") {
      const isCurrentBoilerplate = content.trim() === "" || 
        ["Python", "Java", "C++", "JavaScript", "TypeScript"].some(l => content.trim() === getBoilerplate(l).trim());
      if (isCurrentBoilerplate) {
        setContent(getBoilerplate(language));
      }
    }
  }, [language, question]);

  useEffect(() => {
    const questionId = searchParams.get("questionId");
    if (!questionId) return;
    let active = true;
    void (async () => {
      try {
        const res = await fetch(`/api/questions/${questionId}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Question not found");
        const q = await res.json();
        if (!active) return;
        setQuestion(q);
        setMode("write");
      } catch (e) {
        toast.error("Failed to load question");
      } finally {
        if (active) setQuestionLoading(false);
      }
    })();
    return () => { active = false; };
  }, [searchParams]);

  useEffect(() => {
    if (mode === "write") {
      timerRef.current = window.setInterval(() => setTimerSec((s) => s + 1), 1000);
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setTabSwitchCount(prev => {
            const next = prev + 1;
            toast.warning(`Tab switch detected! ${next} warning(s)`);
            return next;
          });
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [mode]);

  useEffect(() => {
    if (feedback && feedback.score !== undefined) {
      const targetScore = feedback.score;
      let current = 0;
      const increment = targetScore / 20;
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetScore) {
          setAnimatedScore(targetScore);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.round(current));
        }
      }, 50);
      return () => clearInterval(timer);
    }
  }, [feedback]);

  async function getQuestion() {
    setQuestionLoading(true);
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("category", category === "System Design" ? "SYSTEM_DESIGN" : category);
    if (difficulty && difficulty !== "All") params.set("difficulty", difficulty.toUpperCase());
    try {
      const url = "/api/questions/random" + (params.toString() ? `?${params.toString()}` : "");
      const res = await fetch(url);
      if (!res.ok) throw new Error("No question found");
      const q = await res.json();
      setQuestion(q);
      setContent("");
      setExecutionOutput(null);
      setTimerSec(0);
      setTabSwitchCount(0);
      setCameraStats({ noFaceWarnings: 0, multipleFaceWarnings: 0, sessionDuration: 0 });
      setLanguage("Python");
      setMode("write");
    } catch (e) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setQuestionLoading(false);
    }
  }

  async function submitAnswer() {
    if (!question) return;
    if (!content.trim()) {
      toast.error("Please write an answer first.");
      return;
    }
    setSubmittingAnswer(true);
    try {
      const payload = { 
        questionId: question.id, 
        content,
        language: question.category === "DSA" ? language : undefined 
      };
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save answer");
      const saved = await res.json();
      setMode("feedback");
      setLoadingFeedback(true);
      try {
        const fbRes = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answerId: saved.id, question: question.text, answer: content }),
        });
        if (!fbRes.ok) throw new Error("Failed to generate feedback");
        const json = await fbRes.json();
        setFeedback(json);
      } catch (e) {
        setFeedback({ error: "Failed to generate feedback" });
        toast.error("Something went wrong. Try again.");
      }
    } catch (e) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoadingFeedback(false);
      setSubmittingAnswer(false);
    }
  }

  function resetToSelect() {
    setMode("select");
    setQuestion(null);
    setContent("");
    setTimerSec(0);
    setExecutionOutput(null);
    setFeedback(null);
    setAnimatedScore(0);
    router.replace("/dashboard/practice");
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: 'calc(100vh - 40px)', overflow: 'hidden' }}>
      
      {/* LEFT PANEL */}
      <div style={{ 
        width: '420px',
        minWidth: '360px',
        flexShrink: 0,
        background: 'rgba(255,255,255,0.02)', 
        borderRight: '1px solid rgba(255,255,255,0.1)', 
        padding: '32px', 
        height: '100%',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <Link 
              href="/dashboard" 
              style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#8888a0', textDecoration: 'none', transition: 'color 0.2s' }}
              className="hover:text-white"
            >
              ← Dashboard
            </Link>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#f0f0f5', margin: '8px 0 0 0', fontWeight: 700 }}>
              Practice
            </h1>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#8888a0' }}>
            {formatTime(timerSec)}
          </div>
        </div>

        {/* Filters Section (Always visible, but maybe disabled during test) */}
        <div style={{ opacity: mode === 'select' ? 1 : 0.5, pointerEvents: mode === 'select' ? 'auto' : 'none' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#44445a', letterSpacing: '2px', marginBottom: '8px' }}>CATEGORY</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {["All", "DSA", "HR", "System Design", "Behavioral"].map(c => {
                const active = category === c;
                let rgb = "245, 166, 35";
                if (c === "DSA") rgb = "59, 130, 246"; // Blue
                else if (c === "HR") rgb = "34, 197, 94"; // Green
                else if (c === "System Design") rgb = "245, 158, 11"; // Orange
                else if (c === "Behavioral") rgb = "168, 85, 247"; // Purple
                else if (c === "All") rgb = "136, 136, 160"; // Gray

                return (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: active ? `rgba(${rgb},0.15)` : 'transparent',
                      color: active ? `rgb(${rgb})` : '#8888a0',
                      border: active ? `1px solid rgba(${rgb},0.4)` : '1px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    className={!active ? "hover:border-[rgba(255,255,255,0.2)]" : ""}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#44445a', letterSpacing: '2px', marginBottom: '8px' }}>DIFFICULTY</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {["All", "Easy", "Medium", "Hard"].map(d => {
                const active = difficulty === d;
                let rgb = "245, 166, 35";
                if (d === "Easy") rgb = "34, 197, 94"; // Green
                else if (d === "Medium") rgb = "245, 158, 11"; // Orange
                else if (d === "Hard") rgb = "239, 68, 68"; // Red
                else if (d === "All") rgb = "136, 136, 160"; // Gray

                return (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: active ? `rgba(${rgb},0.15)` : 'transparent',
                      color: active ? `rgb(${rgb})` : '#8888a0',
                      border: active ? `1px solid rgba(${rgb},0.4)` : '1px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    className={!active ? "hover:border-[rgba(255,255,255,0.2)]" : ""}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            onClick={getQuestion}
            disabled={questionLoading}
            style={{
              width: '100%',
              height: '44px',
              background: '#f5a623',
              color: '#000',
              fontWeight: 600,
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'var(--font-display)',
              border: 'none',
              marginTop: '24px',
              cursor: questionLoading ? 'not-allowed' : 'pointer',
              opacity: questionLoading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {questionLoading ? (
              <>
                <div style={{ width: '16px', height: '16px', border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Fetching...
              </>
            ) : "Get Question"}
          </button>
          <div style={{ textAlign: 'center', marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#8888a0' }}>
            or press ⌘K
          </div>
          <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
        </div>

        {/* QUESTION DISPLAY */}
        {(mode === 'write' || mode === 'feedback') && question && (
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <span style={{ 
                ...getCategoryBadgeStyle(question.category),
                fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '4px 8px', borderRadius: '4px', fontWeight: 600
              }}>
                {question.category.replace('_', ' ')}
              </span>
              <span style={{ 
                ...getDifficultyBadgeStyle(question.difficulty),
                fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '4px 8px', borderRadius: '4px', fontWeight: 600
              }}>
                {question.difficulty}
              </span>
            </div>
            
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.75, color: '#f0f0f5' }}>
              {question.text}
            </div>

            {mode === 'write' && (
              <button 
                onClick={getQuestion}
                style={{
                  marginTop: '16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: '#8888a0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
                className="hover:text-white transition-colors"
              >
                Skip this →
              </button>
            )}
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div style={{ 
        flex: 1,
        minWidth: 0,
        background: 'transparent', 
        padding: '32px', 
        height: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {mode !== 'feedback' ? (
          // ANSWER STATE
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', opacity: mode === 'select' ? 0.3 : 1, pointerEvents: mode === 'select' ? 'none' : 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#44445a' }}>
                  {question?.category === "DSA" ? "YOUR CODE" : "YOUR ANSWER"}
                </div>
                {question?.category === "DSA" && (
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#f0f0f5',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="TypeScript">TypeScript</option>
                  </select>
                )}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#8888a0' }}>{content.length} / 2000</div>
            </div>
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={question?.category === "DSA" ? `Write your ${language} code here...` : "Structure your answer clearly..."}
              spellCheck={question?.category === "DSA" ? false : true}
              style={{
                width: '100%',
                minHeight: '400px',
                flex: 1,
                background: question?.category === "DSA" ? '#0a0a0f' : 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '20px',
                fontFamily: question?.category === "DSA" ? 'var(--font-mono)' : 'var(--font-body)',
                fontSize: question?.category === "DSA" ? '13px' : '15px',
                lineHeight: 1.8,
                color: question?.category === "DSA" ? '#e2e8f0' : '#f0f0f5',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s',
                whiteSpace: question?.category === "DSA" ? 'pre' : 'pre-wrap',
                overflowWrap: question?.category === "DSA" ? 'normal' : 'break-word',
                overflowX: question?.category === "DSA" ? 'auto' : 'hidden'
              }}
              onFocus={(e) => e.target.style.borderColor = '#f5a623'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              onKeyDown={(e) => {
                if (question?.category === "DSA" && e.key === 'Tab') {
                  e.preventDefault();
                  const start = e.currentTarget.selectionStart;
                  const end = e.currentTarget.selectionEnd;
                  setContent(content.substring(0, start) + "    " + content.substring(end));
                  setTimeout(() => {
                    if (e.currentTarget) {
                      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
                    }
                  }, 0);
                }
              }}
            />

            {executionOutput !== null && (
              <div style={{
                marginTop: '16px',
                background: '#0a0a0f',
                border: '1px solid #1e2d4a',
                borderRadius: '8px',
                padding: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: '#34d399',
                whiteSpace: 'pre-wrap',
                minHeight: '80px',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '4px 8px', fontSize: '10px', color: '#64748b' }}>
                  OUTPUT
                  <button onClick={() => setExecutionOutput(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginLeft: '8px' }}>✕</button>
                </div>
                {executionOutput}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <button style={{ 
                background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '40px', height: '40px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8888a0', cursor: 'pointer' 
              }}>
                <Mic size={18} />
              </button>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                {question?.category === "DSA" && (
                  <button
                    onClick={async () => {
                      setRunningCode(true);
                      setExecutionOutput("Compiling...\n");
                      try {
                        const res = await fetch("/api/execute", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ code: content, language })
                        });
                        if (!res.ok) throw new Error("Execution failed");
                        const data = await res.json();
                        setExecutionOutput(`Compiling...\nExecuting...\n\n${data.output}\n\nExecution finished.`);
                      } catch (e) {
                        setExecutionOutput("Compiling...\nExecution Error: Failed to connect to compiler.");
                      } finally {
                        setRunningCode(false);
                      }
                    }}
                    disabled={runningCode || submittingAnswer || !content.trim()}
                    style={{
                      background: '#10b981',
                      color: '#000',
                      fontWeight: 600,
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'var(--font-display)',
                      border: 'none',
                      padding: '12px 24px',
                      cursor: (runningCode || submittingAnswer || !content.trim()) ? 'not-allowed' : 'pointer',
                      opacity: (runningCode || submittingAnswer || !content.trim()) ? 0.7 : 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {runningCode ? "Running..." : "Run Code ▶"}
                  </button>
                )}
                <button
                  onClick={submitAnswer}
                  disabled={submittingAnswer || !content.trim()}
                  style={{
                    background: '#f5a623',
                    color: '#000',
                    fontWeight: 600,
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'var(--font-display)',
                    border: 'none',
                    padding: '12px 24px',
                    cursor: (submittingAnswer || !content.trim()) ? 'not-allowed' : 'pointer',
                    opacity: (submittingAnswer || !content.trim()) ? 0.7 : 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {submittingAnswer ? "Submitting..." : "Submit answer →"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          // FEEDBACK STATE
          <div style={{
            animation: 'slideUpFade 0.4s ease forwards',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes slideUpFade {
                from { opacity: 0; transform: translateY(16px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}} />
            
            {loadingFeedback || !feedback ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <Skeleton className="h-24 w-full rounded-xl bg-[rgba(255,255,255,0.05)]" />
                <Skeleton className="h-40 w-full rounded-xl bg-[rgba(255,255,255,0.05)]" />
              </div>
            ) : (
              <>
                {/* Score */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: '#f5a623', fontWeight: 700, lineHeight: 1 }}>
                      {animatedScore}
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#8888a0', fontWeight: 600 }}>
                      /10
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                    {[
                      { label: 'Clarity', value: feedback.clarity, color: '#f5a623' },
                      { label: 'Completeness', value: feedback.completeness, color: '#6366f1' },
                      { label: 'Structure', value: feedback.structure, color: '#22c55e' }
                    ].map(metric => (
                      <div key={metric.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#8888a0' }}>{metric.label}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#8888a0' }}>{metric.value}/10</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: metric.color, width: `${(metric.value / 10) * 100}%`, transition: 'width 1s ease' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />

                {/* Strengths */}
                {feedback.strengths && feedback.strengths.length > 0 && (
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#8888a0', marginBottom: '12px', letterSpacing: '1px' }}>STRENGTHS</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {feedback.strengths.map((str: string, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <span style={{ color: '#22c55e', fontSize: '14px', lineHeight: 1.5 }}>•</span>
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#f0f0f5', lineHeight: 1.5 }}>{str}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvements */}
                {feedback.improvements && feedback.improvements.length > 0 && (
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#8888a0', marginBottom: '12px', letterSpacing: '1px' }}>TO IMPROVE</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {feedback.improvements.map((imp: string, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <span style={{ color: '#f5a623', fontSize: '14px', lineHeight: 1.5 }}>→</span>
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#f0f0f5', lineHeight: 1.5 }}>{imp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary */}
                {feedback.summary && (
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderLeft: '2px solid rgba(245,166,35,0.4)',
                    padding: '16px',
                    fontStyle: 'italic',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: '#8888a0'
                  }}>
                    {feedback.summary}
                  </div>
                )}

                {/* Bottom Row */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button
                    onClick={resetToSelect}
                    style={{
                      background: '#f5a623',
                      color: '#000',
                      fontWeight: 600,
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'var(--font-display)',
                      border: 'none',
                      padding: '12px 24px',
                      cursor: 'pointer',
                    }}
                  >
                    Practice another →
                  </button>
                  <Link
                    href="/dashboard/progress"
                    style={{
                      background: 'transparent',
                      color: '#f0f0f5',
                      fontWeight: 500,
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'var(--font-body)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '12px 24px',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                    className="hover:bg-[var(--bg-surface)]"
                  >
                    View progress
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <ProctoringCamera isActive={mode === 'write'} onStatsUpdate={setCameraStats} />
    </div>
  );
}
