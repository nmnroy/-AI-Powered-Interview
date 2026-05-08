type ScoreBadgeProps = {
  score: number | null;
};

export function ScoreBadge({ score }: ScoreBadgeProps) {
  if (score === null) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-500/15 px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-inset ring-slate-500/20">
        No score
      </span>
    );
  }

  const badgeClasses =
    score >= 8
      ? "bg-emerald-500/15 text-emerald-400 ring-emerald-500/25"
      : score >= 5
        ? "bg-amber-500/15 text-amber-400 ring-amber-500/25"
        : "bg-rose-500/15 text-rose-400 ring-rose-500/25";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${badgeClasses}`}
    >
      Score {score}
    </span>
  );
}