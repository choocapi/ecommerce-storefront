"use client";

import ProductCard from "@/components/shared/product/product-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
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
import { use, useEffect, useMemo, useState } from "react";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const PAGE_SIZE = 20;

type SortOption = "featured" | "price_asc" | "price_desc";

interface PriceRange {
  key: string;
  label: string;
  min: number;
  max?: number;
}

const PRICE_RANGES: PriceRange[] = [
  { key: "lt10", label: "Dưới 10 triệu", min: 0, max: 10_000_000 },
  { key: "10_15", label: "Từ 10 - 15 triệu", min: 10_000_000, max: 15_000_000 },
  { key: "15_20", label: "Từ 15 - 20 triệu", min: 15_000_000, max: 20_000_000 },
  { key: "20_25", label: "Từ 20 - 25 triệu", min: 20_000_000, max: 25_000_000 },
  { key: "25_30", label: "Từ 25 - 30 triệu", min: 25_000_000, max: 30_000_000 },
  { key: "gt30", label: "Trên 30 triệu", min: 30_000_000 },
];

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceKey, setSelectedPriceKey] = useState<string | null>(null);

  const hasMore = page + 1 < totalPages;

  const loadPage = async (pageToLoad: number, isLoadMore: boolean) => {
    if (!slug) return;

    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const response = await productService.getByCategorySlug(slug, pageToLoad, PAGE_SIZE);

      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
      setPage(response.number);

      if (isLoadMore) {
        setProducts((prev) => [...prev, ...response.content]);
      } else {
        setProducts(response.content);
      }
    } catch (error: any) {
      console.error("Category products error:", error);
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  // Reset & load when slug changes
  useEffect(() => {
    if (!slug) return;
    setProducts([]);
    setPage(0);
    setTotalElements(0);
    setTotalPages(0);
    setSelectedBrands([]);
    setSelectedPriceKey(null);
    loadPage(0, false);
  }, [slug]);

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    loadPage(page + 1, true);
  };

  const uniqueBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand?.name) set.add(p.brand.name);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const handleResetFilters = () => {
    setSelectedBrands([]);
    setSelectedPriceKey(null);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    // Brand filter
    if (selectedBrands.length > 0) {
      list = list.filter((p) => (p.brand?.name ? selectedBrands.includes(p.brand.name) : false));
    }

    // Price filter
    if (selectedPriceKey) {
      const range = PRICE_RANGES.find((r) => r.key === selectedPriceKey);
      if (range) {
        list = list.filter((p) => {
          const price = p.price || 0;
          if (range.max != null) {
            return price >= range.min && price < range.max;
          }
          return price >= range.min;
        });
      }
    }

    // Sort
    if (sortBy === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, selectedBrands, selectedPriceKey, sortBy]);

  const categoryName = useMemo(() => {
    if (products[0]?.category?.name) return products[0].category.name;
    if (!slug) return "Danh mục";
    return slug.replace(/-/g, " ");
  }, [products, slug]);

  const isInitialLoading = isLoading && products.length === 0;

  return (
    <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900 font-bold text-lg">Bộ lọc</h2>
              {(selectedBrands.length > 0 || selectedPriceKey) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-primary hover:text-rose-600"
                >
                  Xóa hết lọc
                </button>
              )}
            </div>

            <Accordion type="multiple" defaultValue={["brand", "price"]} className="space-y-2">
              {/* Brand Filter */}
              <AccordionItem value="brand" className="border-b border-gray-100 pb-3">
                <AccordionTrigger className="flex items-center justify-between py-0 hover:no-underline">
                  <span className="font-semibold text-base text-gray-900 text-left">
                    Thương hiệu
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 mt-2">
                  {uniqueBrands.length === 0 ? (
                    <p className="text-xs text-gray-500">Không có thương hiệu nào</p>
                  ) : (
                    uniqueBrands.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                          className="rounded-[4px] border-gray-200"
                        />
                        <span>{brand}</span>
                      </label>
                    ))
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Price Filter */}
              <AccordionItem value="price" className="pb-1 border-none">
                <AccordionTrigger className="flex items-center justify-between py-0 hover:no-underline">
                  <span className="font-semibold text-base text-gray-900 text-left">
                    Khoảng giá
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 mt-2">
                  {PRICE_RANGES.map((range) => (
                    <label
                      key={range.key}
                      className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedPriceKey === range.key}
                        onCheckedChange={() =>
                          setSelectedPriceKey((prev) => (prev === range.key ? null : range.key))
                        }
                        className="rounded-[6px] border-gray-200"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Products & Header */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-gray-900 font-bold text-2xl md:text-3xl mb-1">{categoryName}</h1>
              <p className="text-sm text-gray-500">
                {isLoading && products.length === 0
                  ? "Đang tải sản phẩm..."
                  : `${totalElements} sản phẩm`}
              </p>
            </div>

            {/* Sort Select */}
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
          </div>

          {/* Products Grid */}
          {isInitialLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">Đang tải sản phẩm...</span>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-sm text-gray-600">
                Không tìm thấy sản phẩm nào trong danh mục này với bộ lọc hiện tại.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAndSortedProducts.map((product) => (
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
        </div>
      </div>
    </div>
  );
}
