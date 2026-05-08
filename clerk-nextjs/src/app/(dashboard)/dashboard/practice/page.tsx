"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type { QuestionType } from "@/types";
import { Skeleton } from "@/components/ui/Skeleton";

type Mode = "select" | "write" | "feedback";

export default function PracticePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("select");
  const [category, setCategory] = useState<string>("All");
  const [difficulty, setDifficulty] = useState<string>("All");
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [content, setContent] = useState("");
  const [timerSec, setTimerSec] = useState(0);
  const timerRef = useRef<number | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(Boolean(searchParams.get("questionId")));
  const [feedback, setFeedback] = useState<any | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    // Fetch current streak
    const fetchStreak = async () => {
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setCurrentStreak(data.currentStreak || 0);
        }
      } catch (e) {
        // Ignore streak fetch errors
      }
    };
    fetchStreak();

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

    return () => {
      active = false;
    };
  }, [searchParams]);

  useEffect(() => {
    if (mode === "write") {
      timerRef.current = window.setInterval(() => setTimerSec((s) => s + 1), 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [mode]);

  useEffect(() => {
    if (feedback && feedback.score) {
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

  function formatTime(s: number) {
    const mm = Math.floor(s / 60).toString().padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  }

  async function getQuestion() {
    setQuestionLoading(true);
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("category", category === "SYSTEM_DESIGN" ? "SYSTEM_DESIGN" : category);
    if (difficulty && difficulty !== "All") params.set("difficulty", difficulty.toUpperCase());
    try {
      const url = "/api/questions/random" + (params.toString() ? `?${params.toString()}` : "");
      const res = await fetch(url);
      if (!res.ok) throw new Error("No question found");
      const q = await res.json();
      setQuestion(q);
      setContent("");
      setTimerSec(0);
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
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id, content }),
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
    setFeedback(null);
    setAnimatedScore(0);
    router.replace("/dashboard/practice");
  }

  function getCategoryColor(cat: string) {
    switch (cat) {
      case "DSA": return "bg-cyan-500/10 text-cyan-300 border-cyan-500/20";
      case "HR": return "bg-purple-500/10 text-purple-300 border-purple-500/20";
      case "SYSTEM_DESIGN": return "bg-orange-500/10 text-orange-300 border-orange-500/20";
      case "BEHAVIORAL": return "bg-green-500/10 text-green-300 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-300 border-gray-500/20";
    }
  }

  function getDifficultyColor(diff: string) {
    switch (diff) {
      case "EASY": return "bg-green-500/10 text-green-300 border-green-500/20";
      case "MEDIUM": return "bg-yellow-500/10 text-yellow-300 border-yellow-500/20";
      case "HARD": return "bg-red-500/10 text-red-300 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-300 border-gray-500/20";
    }
  }

  function getScoreColor(score: number) {
    if (score >= 8) return "text-green-400";
    if (score >= 5) return "text-yellow-400";
    return "text-red-400";
  }

  return (
    <div className="min-h-screen relative" style={{ background: '#0a0f1e' }}>
      {/* Floating Orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(0,212,255,0.06), transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.06), transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse',
        zIndex: 0
      }} />

      {/* Particle Effect */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${Math.random() * 20}%`,
            left: `${Math.random() * 100}%`,
            width: '2px',
            height: '2px',
            background: 'rgba(0,212,255,0.3)',
            borderRadius: '50%',
            animation: `drift ${20 + Math.random() * 10}s infinite`,
            animationDelay: `${Math.random() * 5}s`,
            zIndex: 0
          }}
        />
      ))}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) }
          50% { transform: translateY(-20px) }
        }
        @keyframes drift {
          0%, 100% { transform: translateX(0px) translateY(0px) }
          25% { transform: translateX(10px) translateY(-5px) }
          50% { transform: translateX(-5px) translateY(10px) }
          75% { transform: translateX(5px) translateY(5px) }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) }
          to { opacity: 1; transform: translateY(0) }
        }
      `}</style>

      <div className="relative z-10 p-6">
        {/* Page Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-white font-semibold" style={{ fontSize: '28px' }}>Practice Session</h1>
            <p className="text-gray-400 mt-1" style={{ fontSize: '14px' }}>Sharpen your skills with targeted questions</p>
          </div>
          <div className="px-3 py-1 rounded-full text-sm" style={{
            background: currentStreak > 0 ? 'rgba(0,212,255,0.1)' : 'rgba(156,163,175,0.1)',
            color: currentStreak > 0 ? '#00d4ff' : '#9ca3af',
            border: `1px solid ${currentStreak > 0 ? 'rgba(0,212,255,0.3)' : 'rgba(156,163,175,0.3)'}`
          }}>
            🔥 {currentStreak > 0 ? `${currentStreak} day streak` : 'Start your streak today'}
          </div>
        </div>

        {/* Filter Section */}
        {mode === "select" && (
          <div style={{
            background: '#0d1526',
            border: '1px solid #1e2d4a',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div className="mb-4">
              <label className="text-cyan-300 uppercase text-xs tracking-wider font-semibold">Category</label>
              <div className="flex gap-2 flex-wrap mt-2">
                {["All", "DSA", "HR", "SYSTEM_DESIGN", "BEHAVIORAL"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className="px-4 py-2 rounded-full text-sm transition-all duration-200"
                    style={{
                      background: category === c 
                        ? 'linear-gradient(135deg, #00d4ff, #7c3aed)' 
                        : 'transparent',
                      color: category === c ? 'white' : '#9ca3af',
                      border: category === c ? 'none' : '1px solid #1e2d4a',
                      transform: category === c ? 'scale(1.01)' : 'scale(1)'
                    }}
                  >
                    <span style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: category === c ? 'white' : 'transparent',
                      marginRight: '6px'
                    }} />
                    {c === "All" ? "All" : c === "SYSTEM_DESIGN" ? "SYSTEM DESIGN" : c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-cyan-300 uppercase text-xs tracking-wider font-semibold">Difficulty</label>
              <div className="flex gap-2 flex-wrap mt-2">
                {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className="px-4 py-2 rounded-full text-sm transition-all duration-200"
                    style={{
                      background: difficulty === d 
                        ? (d === 'Easy' ? '#10b981' : d === 'Medium' ? '#eab308' : d === 'Hard' ? '#ef4444' : 'linear-gradient(135deg, #00d4ff, #7c3aed)')
                        : 'transparent',
                      color: difficulty === d ? 'white' : '#9ca3af',
                      border: difficulty === d ? 'none' : '1px solid #1e2d4a',
                      transform: difficulty === d ? 'scale(1.01)' : 'scale(1)'
                    }}
                  >
                    <span style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: difficulty === d ? 'white' : 'transparent',
                      marginRight: '6px'
                    }} />
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={getQuestion}
              disabled={questionLoading}
              className="w-full text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                height: '48px',
                background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                transform: questionLoading ? 'scale(1)' : 'scale(1)',
                opacity: questionLoading ? 0.7 : 1
              }}
            >
              {questionLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Finding question...
                </>
              ) : (
                <>
                  ⚡ Get Question
                </>
              )}
            </button>
          </div>
        )}

        {/* Question Card */}
        {mode === 'write' && question && (
          <div style={{
            background: '#0d1526',
            border: '1px solid #1e2d4a',
            borderRadius: '16px',
            padding: '24px',
            animation: 'fadeInUp 0.5s ease-out'
          }}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(question.category)}`}>
                  {question.category === "SYSTEM_DESIGN" ? "SYSTEM DESIGN" : question.category}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 font-mono text-sm">{formatTime(timerSec)}</span>
                <button 
                  onClick={resetToSelect}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>

            <p className="text-white mb-6" style={{ 
              fontSize: '18px', 
              fontWeight: 400, 
              lineHeight: 1.7 
            }}>
              {question.text}
            </p>

            <div className="border-t border-gray-700 pt-4 mb-4">
              <label className="text-cyan-300 text-xs font-medium uppercase tracking-wider mb-2 block">Your Answer</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Structure your answer with examples. Be specific and concise."
                className="w-full resize-none outline-none transition-all duration-200"
                style={{
                  minHeight: '180px',
                  background: '#080d1a',
                  border: '1px solid #1e2d4a',
                  borderRadius: '12px',
                  padding: '16px',
                  color: 'white',
                  fontSize: '15px',
                  lineHeight: 1.7
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00d4ff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#1e2d4a';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-xs">{content.length} / 1000</span>
              </div>
            </div>

            <button
              onClick={submitAnswer}
              disabled={submittingAnswer || loadingFeedback || !content.trim()}
              className="px-6 py-2.5 rounded-lg text-white font-medium transition-all duration-200 flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                opacity: (submittingAnswer || loadingFeedback || !content.trim()) ? 0.5 : 1,
                cursor: (submittingAnswer || loadingFeedback || !content.trim()) ? 'not-allowed' : 'pointer'
              }}
            >
              📤 Submit Answer
            </button>
          </div>
        )}

        {/* Feedback Card */}
        {mode === 'feedback' && question && feedback && (
          <div style={{
            background: '#0d1526',
            border: '1px solid #1e2d4a',
            borderRadius: '16px',
            padding: '24px',
            animation: 'fadeInUp 0.5s ease-out'
          }}>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-cyan-400 text-lg">🤖</span>
              <h2 className="text-white text-xl font-semibold">AI Feedback</h2>
            </div>

            <div className="text-center mb-8">
              <div className={`text-6xl font-bold ${getScoreColor(animatedScore)}`}>
                {animatedScore}/10
              </div>
              <p className="text-gray-400 text-sm mt-2">Overall Score</p>
            </div>

            <div className="space-y-4 mb-8">
              {[
                { label: 'Clarity', value: feedback.clarity, color: '#00d4ff' },
                { label: 'Completeness', value: feedback.completeness, color: '#7c3aed' },
                { label: 'Structure', value: feedback.structure, color: '#10b981' }
              ].map((metric) => (
                <div key={metric.label} className="flex items-center justify-between">
                  <span className="text-white text-sm">{metric.label}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${(metric.value / 10) * 100}%`,
                          background: metric.color
                        }}
                      />
                    </div>
                    <span className="text-white text-sm w-8 text-right">{metric.value}/10</span>
                  </div>
                </div>
              ))}
            </div>

            {(feedback.strengths?.length > 0) && (
              <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(16,185,129,0.05)' }}>
                <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                  ✓ Strengths
                </h3>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength: string, i: number) => (
                    <li key={i} className="text-white text-sm flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(feedback.improvements?.length > 0) && (
              <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(245,158,11,0.05)' }}>
                <h3 className="text-orange-400 font-semibold mb-3 flex items-center gap-2">
                  → Improvements
                </h3>
                <ul className="space-y-2">
                  {feedback.improvements.map((improvement: string, i: number) => (
                    <li key={i} className="text-white text-sm flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5">→</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.summary && (
              <div className="p-4 rounded-lg mb-6" style={{ 
                background: 'rgba(0,212,255,0.05)',
                borderLeft: '3px solid #00d4ff'
              }}>
                <p className="text-gray-300 italic text-sm">{feedback.summary}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={resetToSelect}
                className="py-3 rounded-lg text-white font-medium transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)'
                }}
              >
                Practice Another
              </button>
              <Link
                href="/dashboard/progress"
                className="py-3 rounded-lg text-white font-medium border border-gray-600 text-center transition-all duration-200 hover:border-gray-400"
              >
                View Progress →
              </Link>
            </div>
          </div>
        )}

        {/* Loading State */}
        {questionLoading && !question && (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-[240px] w-full rounded-2xl" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-12 rounded-full" />
              <Skeleton className="h-12 rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
