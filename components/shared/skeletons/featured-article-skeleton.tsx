"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedArticleSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="w-full h-64 rounded-xl" />
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-3/4 h-6" />
    </div>
  );
}

