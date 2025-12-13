"use client";

import Loader from "@/components/common/loader";
import FeaturedArticleCard from "@/components/shared/article/featured-article-card";
import HArticleCard from "@/components/shared/article/h-article-card";
import HProductCard from "@/components/shared/product/h-product-card";
import FeaturedArticleSkeleton from "@/components/shared/skeletons/featured-article-skeleton";
import HArticleCardSkeleton from "@/components/shared/skeletons/h-article-card-skeleton";
import HProductCardSkeleton from "@/components/shared/skeletons/h-product-card-skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ARTICLE_CATEGORIES } from "@/constants/articles";
import { articleQueries } from "@/services/articleService";
import { productQueries } from "@/services/productService";
import type { IArticle } from "@/types/article";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const ARTICLES_PER_PAGE = 5;

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    ARTICLE_CATEGORIES[0]?.slug || "",
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [allArticles, setAllArticles] = useState<IArticle[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<IArticle | null>(null);

  // Fetch articles based on selected category
  const isLatest = selectedCategory === "moi-nhat";
  const { data, isLoading, isFetching } = useQuery(
    isLatest
      ? articleQueries.list({
          page: currentPage,
          size: ARTICLES_PER_PAGE + 1,
        })
      : articleQueries.byCategory({
          category: selectedCategory,
          page: currentPage,
          size: ARTICLES_PER_PAGE + 1,
        }),
  );

  // Fetch products
  const { data: productsData, isLoading: isLoadingProducts } = useQuery(productQueries.list());

  // Reset state when category changes
  useEffect(() => {
    setCurrentPage(0);
    setFeaturedArticle(null);
    setAllArticles([]);
  }, [selectedCategory]);

  // Update articles when data changes
  useEffect(() => {
    if (!data?.content || data.content.length === 0) {
      if (currentPage === 0) {
        setFeaturedArticle(null);
        setAllArticles([]);
      }
      return;
    }

    const newFeatured = data.content[0];
    const newArticles = data.content.slice(1);

    if (currentPage === 0) {
      // First page: replace all
      setFeaturedArticle(newFeatured);
      setAllArticles(newArticles);
    } else {
      // Load more: append to existing articles
      setAllArticles((prev) => [...prev, ...newArticles]);
    }
  }, [data, currentPage]);

  // Get first 5 products
  const products = useMemo(() => {
    return (productsData?.content || []).slice(0, 5);
  }, [productsData]);

  const hasMore = data
    ? data.content.length === ARTICLES_PER_PAGE + 1 && currentPage < data.totalPages - 1
    : false;

  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(0); // Reset page when changing category
  };

  const selectedCategoryConfig = useMemo(() => {
    return ARTICLE_CATEGORIES.find((cat) => cat.slug === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-gray-900 font-bold text-4xl text-center">
          <span className="text-primary">Tin tức</span> công nghệ
        </h1>
      </div>

      {/* Tabs */}
      <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="bg-gray-100 p-1 h-auto gap-0 rounded-xl inline-flex">
            {ARTICLE_CATEGORIES.map((category) => (
              <TabsTrigger
                key={category.slug}
                value={category.slug}
                className="rounded-lg px-6 py-2 text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-900 hover:bg-gray-200/50 transition-colors"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Content */}
        {ARTICLE_CATEGORIES.map((category) => (
          <TabsContent key={category.slug} value={category.slug} className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Articles (2/3 width) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Featured Article */}
                {isLoading && currentPage === 0 ? (
                  <FeaturedArticleSkeleton />
                ) : featuredArticle ? (
                  <FeaturedArticleCard
                    article={featuredArticle}
                    backgroundColor={selectedCategoryConfig?.backgroundColor || "bg-rose-50"}
                    overlayColor={selectedCategoryConfig?.overlayColor || "text-rose-200/50"}
                  />
                ) : null}

                {/* Articles List */}
                {isLoading && currentPage === 0 ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <HArticleCardSkeleton key={i} />
                    ))}
                  </div>
                ) : allArticles.length > 0 ? (
                  <div className="space-y-4">
                    {allArticles.map((article) => (
                      <HArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                ) : !featuredArticle ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-base">Không có bài viết nào</p>
                  </div>
                ) : null}

                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center pt-4">
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
              </div>

              {/* Right Column - Products Sidebar (1/3 width) */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <h3 className="text-gray-900 font-bold text-xl mb-4">Có thể bạn cũng thích</h3>
                  {isLoadingProducts ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <HProductCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : products.length > 0 ? (
                    <div className="space-y-4">
                      {products.map((product) => (
                        <HProductCard
                          key={product.id}
                          product={product}
                          showOriginalPrice={false}
                          className="h-24 w-full"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">Không có sản phẩm</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
