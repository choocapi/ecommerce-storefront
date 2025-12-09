"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function HProductCardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100">
      <Skeleton className="shrink-0 w-24 h-24 rounded-xs" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );
}

