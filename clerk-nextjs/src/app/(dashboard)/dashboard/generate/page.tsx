"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";

type GeneratedQuestion = {
  text: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
};

type GeneratedQuestions = {
  technical: GeneratedQuestion[];
  behavioral: GeneratedQuestion[];
};

type HistoryItem = {
  id: string;
  jobDescription: string;
  role: string;
  company: string;
  generatedAt: string;
};

const HISTORY_KEY = "jd-generation-history";

const difficultyStyles: Record<GeneratedQuestion["difficulty"], string> = {
  EASY: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/20",
  MEDIUM: "bg-amber-500/15 text-amber-300 ring-amber-500/20",
  HARD: "bg-rose-500/15 text-rose-300 ring-rose-500/20",
};

export default function GenerateQuestionsPage() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generated, setGenerated] = useState<GeneratedQuestions | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as HistoryItem[];
      const nextHistory = parsed.slice(0, 3);
      window.setTimeout(() => setHistory(nextHistory), 0);
    } catch {
      window.localStorage.removeItem(HISTORY_KEY);
    }
  }, []);

  const canGenerate = useMemo(() => jobDescription.trim().length > 0 && !loading, [jobDescription, loading]);

  function persistHistory(nextItem: Omit<HistoryItem, "id" | "generatedAt">) {
    const item: HistoryItem = {
      id: crypto.randomUUID(),
      generatedAt: new Date().toISOString(),
      ...nextItem,
    };
    setHistory((current) => {
      const next = [item, ...current].slice(0, 3);
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }

  async function generateQuestions(override?: { jobDescription: string; role: string; company: string }) {
    const nextJobDescription = override?.jobDescription ?? jobDescription;
    const nextRole = override?.role ?? role;
    const nextCompany = override?.company ?? company;

    if (!nextJobDescription.trim()) {
      toast.error("Something went wrong. Try again.");
      setMessage("Paste a job description first.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: nextJobDescription,
          role: nextRole,
          company: nextCompany,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error ?? "Failed to generate questions");
      }

      const json = (await response.json()) as GeneratedQuestions;
      setGenerated(json);
      persistHistory({ jobDescription: nextJobDescription, role: nextRole, company: nextCompany });
      toast.success("Questions generated!");
    } catch (error: unknown) {
      const messageText = error instanceof Error ? error.message : "Failed to generate questions";
      setMessage(messageText);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function saveQuestion(question: GeneratedQuestion, column: "technical" | "behavioral") {
    const response = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: {
          text: question.text,
          difficulty: question.difficulty,
          category: column === "technical" ? "SYSTEM_DESIGN" : "BEHAVIORAL",
          column,
          tags: ["generated", column],
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error ?? "Failed to save question");
    }

    const json = await response.json();
    toast.success("Question saved!");
    return json.question as { id: string };
  }

  async function handlePractice(question: GeneratedQuestion, column: "technical" | "behavioral") {
    setSaving(true);
    setMessage(null);

    try {
      const saved = await saveQuestion(question, column);
      router.push(`/dashboard/practice?questionId=${saved.id}`);
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Failed to save question");
      toast.error("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveAll() {
    if (!generated) return;

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: [
            ...generated.technical.map((question) => ({
              text: question.text,
              difficulty: question.difficulty,
              category: "SYSTEM_DESIGN",
              column: "technical",
              tags: ["generated", "technical"],
            })),
            ...generated.behavioral.map((question) => ({
              text: question.text,
              difficulty: question.difficulty,
              category: "BEHAVIORAL",
              column: "behavioral",
              tags: ["generated", "behavioral"],
            })),
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error ?? "Failed to save questions");
      }

      setMessage("Saved all 8 questions to your practice library.");
      toast.success("All questions saved!");
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Failed to save questions");
      toast.error("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="dashboard-card rounded-[2rem] p-6 shadow-[0_20px_80px_rgba(5,10,24,0.35)] sm:p-8">
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
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">Question Generator</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Generate Questions from Job Description
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
          Paste any JD and get targeted interview questions instantly
        </p>

        <div className="mt-8 space-y-4">
          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the full job description here..."
            className="min-h-[300px] w-full rounded-3xl border border-[#1e2d4a] bg-[#0a0f1e] p-5 text-sm leading-7 text-slate-100 outline-none transition focus:border-cyan-400"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={role}
              onChange={(event) => setRole(event.target.value)}
              placeholder="e.g. Frontend Developer, Product Manager"
              className="rounded-2xl border border-[#1e2d4a] bg-[#0a0f1e] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
            />
            <input
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="e.g. Google, Startup"
              className="rounded-2xl border border-[#1e2d4a] bg-[#0a0f1e] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => generateQuestions()}
              disabled={!canGenerate}
              className="dashboard-btn-gradient inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate"}
            </button>

            {message ? <p className="text-sm text-slate-400">{message}</p> : null}
          </div>
        </div>
      </section>

      {loading && !generated ? (
        <section className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[28rem] rounded-[1.75rem]" />
          <Skeleton className="h-[28rem] rounded-[1.75rem]" />
        </section>
      ) : null}

      {generated ? (
        <section className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <QuestionColumn
              title="Technical Questions"
              questions={generated.technical}
              column="technical"
              onPractice={handlePractice}
              saving={saving}
            />

            <QuestionColumn
              title="Behavioral Questions"
              questions={generated.behavioral}
              column="behavioral"
              onPractice={handlePractice}
              saving={saving}
            />
          </div>

          <div className="dashboard-card flex flex-wrap items-center justify-between gap-3 rounded-[1.75rem] p-5 shadow-[0_12px_40px_rgba(5,10,24,0.35)]">
            <div>
              <h2 className="text-lg font-semibold text-white">Save All Questions</h2>
              <p className="mt-1 text-sm text-slate-400">
                Save all 8 generated questions to your custom library.
              </p>
            </div>

            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="dashboard-btn-gradient rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save All Questions"}
            </button>
          </div>
        </section>
      ) : null}

      <section className="dashboard-card rounded-[2rem] p-6 shadow-[0_12px_40px_rgba(5,10,24,0.35)] sm:p-8">
        <h2 className="text-xl font-semibold text-white">Recent JD Generations</h2>
        <p className="mt-1 text-sm text-slate-400">Your last 3 prompts are stored locally for quick reuse.</p>

        <div className="mt-5 space-y-3">
          {history.length ? (
            history.map((item) => (
              <article key={item.id} className="dashboard-card-soft rounded-2xl p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-base font-semibold text-white">
                      {item.role || "Untitled Role"}
                      {item.company ? ` · ${item.company}` : ""}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Generated {new Date(item.generatedAt).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => generateQuestions({ jobDescription: item.jobDescription, role: item.role, company: item.company })}
                    className="dashboard-btn-gradient rounded-full px-4 py-2 text-sm font-semibold transition"
                  >
                    Regenerate
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#1e2d4a] p-6 text-sm text-slate-400">
              No JD history yet. Generate a set of questions to see it here.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function QuestionColumn({
  title,
  questions,
  column,
  onPractice,
  saving,
}: {
  title: string;
  questions: GeneratedQuestion[];
  column: "technical" | "behavioral";
  onPractice: (question: GeneratedQuestion, column: "technical" | "behavioral") => Promise<void>;
  saving: boolean;
}) {
  return (
    <section className="dashboard-card rounded-[1.75rem] p-6 shadow-[0_12px_40px_rgba(5,10,24,0.35)]">
      <h2 className="text-xl font-semibold text-white">{title}</h2>

      <div className="mt-5 space-y-4">
        {questions.map((question, index) => (
          <article key={`${column}-${index}`} className="dashboard-card-soft rounded-3xl p-5 transition hover:border-cyan-400/30">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Question {index + 1}
                </p>
                <p className="mt-2 text-base leading-7 text-slate-100">{question.text}</p>
              </div>

              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${difficultyStyles[question.difficulty]}`}>
                {question.difficulty}
              </span>
            </div>

            <button
              onClick={() => onPractice(question, column)}
              disabled={saving}
              className="dashboard-btn-gradient mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              Practice This →
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
