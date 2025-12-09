"use client";

import ProductCard from "@/components/shared/product/product-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productService } from "@/services/productService";
import type { IProduct } from "@/types/products";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 20;

type SortOption = "featured" | "price_asc" | "price_desc";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = (searchParams.get("keyword") || "").trim();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const hasMore = page + 1 < totalPages;

  const loadPage = async (pageToLoad: number, isLoadMore: boolean) => {
    if (!keyword) return;

    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const response = await productService.list(pageToLoad, PAGE_SIZE, {
        search: keyword,
      });

      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
      setPage(response.number);

      if (isLoadMore) {
        setProducts((prev) => [...prev, ...response.content]);
      } else {
        setProducts(response.content);
      }
    } catch (error: any) {
      console.error("Search products error:", error);
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  // Load first page when keyword changes
  useEffect(() => {
    if (!keyword) {
      setProducts([]);
      setTotalElements(0);
      setTotalPages(0);
      setPage(0);
      return;
    }

    loadPage(0, false);
  }, [keyword]);

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    loadPage(page + 1, true);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value as SortOption);
  };

  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortBy === "price_asc") {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price_desc") {
      return list.sort((a, b) => b.price - a.price);
    }
    // featured: giữ nguyên thứ tự backend trả về
    return list;
  }, [products, sortBy]);

  const hasKeyword = !!keyword;

  return (
    <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-gray-900 font-bold text-2xl md:text-3xl mb-2">
            {hasKeyword ? (
              <>
                Kết quả tìm kiếm cho: <span className="text-primary">&quot;{keyword}&quot;</span>
              </>
            ) : (
              "Tìm kiếm sản phẩm"
            )}
          </h1>
          {hasKeyword && (
            <p className="text-sm text-gray-500">
              {isLoading ? "Đang tải sản phẩm..." : `${totalElements} sản phẩm`}
            </p>
          )}
        </div>

        {/* Sort Select */}
        {hasKeyword && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sắp xếp theo</span>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-40 h-10 rounded-full border-gray-200 text-sm font-medium text-gray-900">
                <SelectValue placeholder="Nổi bật nhất" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="featured">Nổi bật nhất</SelectItem>
                <SelectItem value="price_asc">Giá thấp → cao</SelectItem>
                <SelectItem value="price_desc">Giá cao → thấp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Empty state when no keyword */}
      {!hasKeyword && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-600">
            Nhập từ khóa vào ô tìm kiếm phía trên để bắt đầu tìm sản phẩm bạn muốn.
          </p>
        </div>
      )}

      {/* Products Grid */}
      {hasKeyword && (
        <>
          {isLoading && products.length === 0 ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">Đang tải sản phẩm...</span>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-sm text-gray-600">
                Không tìm thấy sản phẩm nào phù hợp với từ khóa trên.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang tải...
                      </>
                    ) : (
                      "Xem thêm"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
