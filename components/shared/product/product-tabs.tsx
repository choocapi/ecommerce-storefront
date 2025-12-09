"use client";

import Loader from "@/components/common/loader";
import ProductCard from "@/components/shared/product/product-card";
import ProductCardSkeleton from "@/components/shared/skeletons/product-card-skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productQueries } from "@/services/productService";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Category {
  name: string;
  slug: string;
}

interface ProductTabsProps {
  categories: readonly Category[];
  productsPerPage?: number;
}

const DEFAULT_PRODUCTS_PER_PAGE = 10;

export default function ProductTabs({
  categories,
  productsPerPage = DEFAULT_PRODUCTS_PER_PAGE,
}: ProductTabsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.slug || "");
  const [currentPage, setCurrentPage] = useState(0);

  // Sử dụng React Query - tự động cache!
  const { data, isLoading, isFetching } = useQuery(
    productQueries.byCategory({
      slug: selectedCategory,
      page: currentPage,
      size: productsPerPage,
    }),
  );

  const products = data?.content || [];
  const hasMore = data
    ? data.content.length === productsPerPage && currentPage < data.totalPages - 1
    : false;

  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(0); // Reset page khi đổi category
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="w-full">
      <div className="flex justify-center mb-6">
        <TabsList className="bg-gray-100 p-1 h-auto gap-0 rounded-xl inline-flex">
          {categories.map((category) => (
            <TabsTrigger
              key={category.slug}
              value={category.slug}
              className="rounded-lg px-6 py-2 text-base font-semibold text-gray-900 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-900 hover:bg-gray-200/50 transition-colors"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Product Grid */}
      {categories.map((category) => (
        <TabsContent key={category.slug} value={category.slug} className="mt-0">
          {isLoading && products.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-base">Không có sản phẩm nào</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={handleLoadMore}
                    disabled={isFetching}
                    variant="outline"
                    className="rounded-full px-8 py-2 font-semibold"
                  >
                    {isFetching ? (
                      <Loader />
                    ) : (
                      <>
                        Xem thêm
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
