export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-700/30 dark:bg-slate-700 ${className}`} />;
}
