"use client";

import FeaturedArticleCard from "@/components/shared/article/featured-article-card";
import HArticleCard from "@/components/shared/article/h-article-card";
import FeaturedArticleSkeleton from "@/components/shared/skeletons/featured-article-skeleton";
import HArticleCardSkeleton from "@/components/shared/skeletons/h-article-card-skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { articleQueries } from "@/services/articleService";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface ArticleCategory {
  name: string;
  slug: string;
  backgroundColor?: string;
  overlayColor?: string;
}

interface ArticleTabsProps {
  categories: readonly ArticleCategory[];
  articlesPerPage?: number;
}

const DEFAULT_ARTICLES_PER_PAGE = 5;

export default function ArticleTabs({
  categories,
  articlesPerPage = DEFAULT_ARTICLES_PER_PAGE,
}: ArticleTabsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.slug || "");

  // Sử dụng React Query - tự động cache!
  const isLatest = selectedCategory === "moi-nhat";
  const { data, isLoading } = useQuery(
    isLatest
      ? articleQueries.list({
          page: 0,
          size: articlesPerPage + 1, // +1 để lấy featured article
          isPublished: true,
        }) // "Mới nhất" với limit
      : articleQueries.byCategory({
          category: selectedCategory,
          page: 0,
          size: articlesPerPage + 1, // +1 để lấy featured article
        }),
  );

  // Tách featured article và articles list (giới hạn 5 bài viết)
  const { featuredArticle, articles } = useMemo(() => {
    if (!data?.content || data.content.length === 0) {
      return { featuredArticle: null, articles: [] };
    }

    const allArticles = data.content;
    const featured = allArticles[0] || null;
    // Chỉ lấy tối đa articlesPerPage bài viết (không tính featured)
    const articlesList = allArticles.slice(1, articlesPerPage + 1);

    return {
      featuredArticle: featured,
      articles: articlesList,
    };
  }, [data, articlesPerPage]);

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
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

      {/* Article Content */}
      {categories.map((category) => (
        <TabsContent key={category.slug} value={category.slug} className="mt-0">
          {isLoading ? (
            <>
              {/* Two Column Layout - 50-50 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Featured Article - Left Column */}
                <div>
                  <FeaturedArticleSkeleton />
                </div>

                {/* Article List - Right Column */}
                <div>
                  <div className="flex flex-col gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <HArticleCardSkeleton key={i} />
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : !featuredArticle && articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-base">Không có bài viết nào</p>
            </div>
          ) : (
            <>
              {/* Two Column Layout - 50-50 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Featured Article - Left Column */}
                <div>
                  {featuredArticle ? (
                    <FeaturedArticleCard
                      article={featuredArticle}
                      backgroundColor={category.backgroundColor || "bg-rose-50"}
                      overlayColor={category.overlayColor || "text-rose-200/50"}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-64 rounded-xl bg-gray-50 border border-gray-200">
                      <p className="text-gray-500 text-base">Không có bài viết nổi bật</p>
                    </div>
                  )}
                </div>

                {/* Article List - Right Column */}
                <div>
                  <div className="flex flex-col gap-4">
                    {articles.length > 0 ? (
                      articles.map((article) => <HArticleCard key={article.id} article={article} />)
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">Không có bài viết khác</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* View All Button */}
              <div className="flex justify-center mt-6">
                <Button asChild variant="outline" className="rounded-full px-8 py-2 font-semibold">
                  <Link href="/articles">
                    Xem tất cả
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
