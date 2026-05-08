import type { QuestionType } from "@/types";

type QuestionCardProps = {
  question: QuestionType;
};

const categoryStyles: Record<QuestionType["category"], string> = {
  DSA: "bg-cyan-500/15 text-cyan-300 ring-cyan-400/20",
  HR: "bg-fuchsia-500/15 text-fuchsia-300 ring-fuchsia-400/20",
  SYSTEM_DESIGN: "bg-violet-500/15 text-violet-300 ring-violet-400/20",
  BEHAVIORAL: "bg-amber-500/15 text-amber-300 ring-amber-400/20",
};

const difficultyStyles: Record<QuestionType["difficulty"], string> = {
  EASY: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
  MEDIUM: "bg-amber-500/15 text-amber-300 ring-amber-400/20",
  HARD: "bg-rose-500/15 text-rose-300 ring-rose-400/20",
};

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.22)] transition duration-300 hover:-translate-y-1 hover:border-cyan-400/25 hover:bg-slate-900">
      <p className="text-base leading-7 text-slate-100">{question.text}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${categoryStyles[question.category]}`}
        >
          {question.category.replace("_", " ")}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${difficultyStyles[question.difficulty]}`}
        >
          {question.difficulty}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}