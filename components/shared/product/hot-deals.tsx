"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { productQueries } from "@/services/productService";
import { getProductDiscountPercentage } from "@/types/products";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Flame } from "lucide-react";
import CountdownTimer from "./countdown-timer";
import HotDealsCarousel from "./hot-deals-carousel";

export default function HotDeals() {
  // Fetch tất cả sản phẩm với React Query
  const { data: allProducts, isLoading } = useQuery(productQueries.listAll());

  // Filter và sort sản phẩm ở client-side
  const products = useMemo(() => {
    if (!allProducts) return [];

    return allProducts
      .filter((product) => {
        const discount = getProductDiscountPercentage(product);
        return discount > 10;
      })
      .sort((a, b) => {
        const discountA = getProductDiscountPercentage(a);
        const discountB = getProductDiscountPercentage(b);
        return discountB - discountA;
      })
      .slice(0, 10); // Giới hạn 10 sản phẩm
  }, [allProducts]);

  if (isLoading) {
    return (
      <div className="mb-16">
        <div className="flex items-center justify-center mb-6">
          <Skeleton className="h-9 w-48" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mb-16">
      {/* Header with countdown */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Flame className="w-8 h-8 text-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
          </div>
          <h2 className="text-gray-900 font-bold text-4xl">Giảm giá sốc</h2>
        </div>

        {/* Countdown Timer */}
        <CountdownTimer />
      </div>

      {/* Carousel Component */}
      <HotDealsCarousel products={products} />
    </div>
  );
}
