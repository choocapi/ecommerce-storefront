"use client";

import InvalidImage from "@/components/common/invalid-image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IArticle } from "@/types/article";
import { formatDate, getUserFullName } from "@/utils";
import Image from "next/image";
import Link from "next/link";

interface FeaturedArticleCardProps {
  article: IArticle;
  className?: string;
  showCategory?: boolean;
  backgroundColor?: string;
  overlayColor?: string;
}

export default function FeaturedArticleCard({
  article,
  className,
  showCategory = true,
  backgroundColor = "bg-rose-50",
  overlayColor = "text-rose-200/50",
}: FeaturedArticleCardProps) {
  const authorName = getUserFullName(article.user);
  const formattedDate = formatDate(article.publishedAt);

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        "group relative flex flex-col rounded-xl overflow-hidden",
        "hover:shadow-lg transition-all duration-300",
        backgroundColor,
        className,
      )}
    >
      {/* HOT NEWS Overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-32 flex items-center justify-center pointer-events-none z-0">
        <span
          className={cn("font-bold text-8xl rotate-90 whitespace-nowrap select-none", overlayColor)}
        >
          HOT NEWS
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4 p-6">
        {/* Category Badge */}
        {showCategory && article.category && (
          <Badge className="bg-white text-gray-900 px-3 py-1 rounded-md text-xs font-semibold uppercase w-fit">
            {article.category}
          </Badge>
        )}

        {/* Article Title */}
        <h2 className="text-gray-900 font-bold text-xl line-clamp-3 group-hover:text-primary transition-colors">
          {article.title}
        </h2>

        {/* Author and Date */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{authorName}</span>
          <span>/</span>
          <span>{formattedDate}</span>
        </div>

        {/* Article Image - Secondary */}
        <div className="relative w-full aspect-video overflow-hidden bg-gray-100 rounded-lg">
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            />
          ) : (
            <InvalidImage />
          )}
        </div>

        {/* Article Excerpt */}
        {article.content && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {article.content.replace(/<[^>]*>/g, "").substring(0, 150)}...
          </p>
        )}
      </div>
    </Link>
  );
}
