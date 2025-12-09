"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PC_BUILDER_CATEGORIES } from "@/constants/pc-builder";
import { cn } from "@/lib/utils";
import { productService } from "@/services/productService";
import type { IProduct } from "@/types/products";
import { useEffect, useMemo, useState } from "react";
import { PCBuilderProductCard } from "./pc-builder-product-card";

interface PCBuilderProductPickerProps {
  categorySlug: string;
  onSelect: (product: IProduct) => void;
  className?: string;
}

type SortOption = "featured" | "price_asc" | "price_desc";

const PAGE_SIZE = 16;

export function PCBuilderProductPicker({
  categorySlug,
  onSelect,
  className,
}: PCBuilderProductPickerProps) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const hasMore = useMemo(() => page + 1 < totalPages, [page, totalPages]);

  const category = PC_BUILDER_CATEGORIES.find((c) => c.slug === categorySlug);

  const loadPage = async (pageToLoad: number, isLoadMore: boolean) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const response = await productService.getByCategorySlug(categorySlug, pageToLoad, PAGE_SIZE);

      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setPage(response.number);

      if (isLoadMore) {
        setProducts((prev) => [...prev, ...response.content]);
      } else {
        setProducts(response.content);
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Load products for PC builder error:", error);
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  // Load first page when category changes
  useEffect(() => {
    if (!categorySlug) {
      setProducts([]);
      setPage(0);
      setTotalPages(0);
      setTotalElements(0);
      return;
    }
    loadPage(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug]);

  const handleLoadMore = () => {
    if (!hasMore || isLoadingMore) return;
    loadPage(page + 1, true);
  };

  const hasProducts = products.length > 0;

  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortBy === "price_asc") {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price_desc") {
      return list.sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, sortBy]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {category?.name || "Danh sách sản phẩm"}
          </h1>
          <p className="text-sm text-gray-500">{`(${totalElements} sản phẩm)`}</p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-40 h-9 rounded-full border-gray-200 text-sm font-medium text-gray-900">
              <SelectValue placeholder="Nổi bật nhất" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-sm">
              <SelectItem value="featured">Nổi bật nhất</SelectItem>
              <SelectItem value="price_asc">Giá thấp → cao</SelectItem>
              <SelectItem value="price_desc">Giá cao → thấp</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && !hasProducts ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-40 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : !hasProducts ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-6 text-sm text-gray-600">
          <p>Không có sản phẩm nào trong danh mục này.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[480px] overflow-y-auto pr-1">
            {sortedProducts.map((product) => (
              <PCBuilderProductCard key={product.id} product={product} onSelect={onSelect} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full px-5 text-sm"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? "Đang tải thêm..." : "Xem thêm"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
