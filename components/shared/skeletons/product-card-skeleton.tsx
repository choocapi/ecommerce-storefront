"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl bg-white border border-gray-100 overflow-hidden">
      {/* Product Image */}
      <Skeleton className="w-full aspect-square" />

      {/* Product Info */}
      <div className="flex flex-col gap-2 p-4">
        {/* Product Name */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />

        {/* Rating */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Price */}
        <Skeleton className="h-6 w-32 mt-auto" />
      </div>
    </div>
  );
}

