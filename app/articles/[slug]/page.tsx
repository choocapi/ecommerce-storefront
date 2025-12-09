"use client";

import ArticleCard from "@/components/shared/article/article-card";
import ArticleCardSkeleton from "@/components/shared/skeletons/article-card-skeleton";
import { articleQueries } from "@/services/articleService";
import { formatDate, getUserFullName } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Fetch article by slug
  const { data: article, isLoading: isLoadingArticle } = useQuery(articleQueries.bySlug(slug));

  // Fetch related articles (same category, exclude current article)
  const { data: relatedArticlesData, isLoading: isLoadingRelated } = useQuery({
    ...articleQueries.byCategory({
      category: article?.category || "",
      page: 0,
      size: 5,
    }),
    enabled: !!article?.category,
  });

  // Filter out current article and limit to 3-5 articles
  const relatedArticles = useMemo(() => {
    if (!relatedArticlesData?.content || !article) return [];
    return relatedArticlesData.content.filter((a) => a.id !== article.id).slice(0, 5);
  }, [relatedArticlesData, article]);

  if (isLoadingArticle) {
    return (
      <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-1/2" />
            <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          {/* Content Skeleton */}
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-gray-900 font-bold text-2xl mb-4">Bài viết không tồn tại</h1>
          <p className="text-gray-500 text-base">Không tìm thấy bài viết bạn đang tìm kiếm.</p>
        </div>
      </div>
    );
  }

  const authorName = getUserFullName(article.user);
  const formattedDate = formatDate(article.publishedAt);

  return (
    <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
      <article className="max-w-4xl mx-auto">
        {/* Article Header */}
        <header className="mb-8">
          {/* Title */}
          <h1 className="text-gray-900 font-bold text-3xl md:text-4xl mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Author and Date */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <span>{authorName}</span>
            <span>/</span>
            <span>{formattedDate}</span>
          </div>

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="relative w-full aspect-video overflow-hidden bg-gray-100 rounded-xl mb-8">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
                priority
              />
            </div>
          )}
        </header>

        {/* Article Content */}
        {article.content && (
          <div
            className="article-content mb-12"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-gray-900 font-bold text-2xl mb-6">Bài viết liên quan</h2>
            {isLoadingRelated ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <ArticleCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedArticles.map((relatedArticle) => (
                  <ArticleCard key={relatedArticle.id} article={relatedArticle} />
                ))}
              </div>
            )}
          </section>
        )}
      </article>
    </div>
  );
}
