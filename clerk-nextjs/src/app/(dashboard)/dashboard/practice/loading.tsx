import { Skeleton } from "@/components/ui/Skeleton";

export default function PracticeLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-60" />
      <Skeleton className="h-24 w-full rounded-3xl" />
      <Skeleton className="h-80 w-full rounded-3xl" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-12 rounded-full" />
        <Skeleton className="h-12 rounded-full" />
      </div>
    </div>
  );
}
