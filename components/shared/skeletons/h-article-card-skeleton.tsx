"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function HArticleCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl bg-white border border-gray-100 p-4">
      <Skeleton className="w-32 h-24 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

