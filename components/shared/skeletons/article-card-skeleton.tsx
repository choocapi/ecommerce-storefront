"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl bg-white border border-gray-100 overflow-hidden">
      {/* Article Image */}
      <Skeleton className="w-full aspect-video" />

      {/* Article Info */}
      <div className="flex flex-col gap-2 p-4">
        {/* Article Title */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />

        {/* Author and Date */}
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

