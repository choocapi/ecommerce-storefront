"use client";

import InvalidImage from "@/components/common/invalid-image";
import { cn } from "@/lib/utils";
import { IArticle } from "@/types/article";
import { formatDate, getUserFullName } from "@/utils";
import Image from "next/image";
import Link from "next/link";

interface ArticleCardProps {
  article: IArticle;
  className?: string;
}

export default function ArticleCard({ article, className }: ArticleCardProps) {
  const authorName = getUserFullName(article.user);
  const formattedDate = formatDate(article.publishedAt);

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        "group flex flex-col rounded-xl bg-white border border-gray-200 overflow-hidden",
        "hover:shadow-md transition-all duration-300",
        className,
      )}
    >
      {/* Article Image */}
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
        {article.featuredImage ? (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <InvalidImage />
        )}
      </div>

      {/* Article Info */}
      <div className="flex flex-col gap-2 p-4">
        {/* Article Title */}
        <h3 className="text-gray-900 font-semibold text-base line-clamp-2 min-h-10 group-hover:text-primary transition-colors">
          {article.title}
        </h3>

        {/* Author and Date */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{authorName}</span>
          <span>/</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
}
