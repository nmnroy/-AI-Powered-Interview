import { Skeleton } from "@/components/ui/Skeleton";

export default function GenerateLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-72" />
      <Skeleton className="h-[300px] w-full rounded-3xl" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-12 rounded-2xl" />
        <Skeleton className="h-12 rounded-2xl" />
      </div>
      <Skeleton className="h-12 w-40 rounded-full" />
      <Skeleton className="h-64 w-full rounded-3xl" />
    </div>
  );
}
