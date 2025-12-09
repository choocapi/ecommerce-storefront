"use client";

import InvalidImage from "@/components/common/invalid-image";
import { cn } from "@/lib/utils";
import { IArticle } from "@/types/article";
import { formatDate, getUserFullName } from "@/utils";
import Image from "next/image";
import Link from "next/link";

interface HArticleCardProps {
  article: IArticle;
  className?: string;
}

export default function HArticleCard({ article, className }: HArticleCardProps) {
  const authorName = getUserFullName(article.user);
  const formattedDate = formatDate(article.publishedAt);

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        "group flex gap-4 rounded-xl bg-white border border-gray-200 overflow-hidden",
        "hover:shadow-md transition-all duration-300",
        className,
      )}
    >
      {/* Article Image */}
      <div className="relative w-32 h-24 shrink-0 overflow-hidden bg-gray-100 rounded-lg">
        {article.featuredImage ? (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="128px"
          />
        ) : (
          <InvalidImage />
        )}
      </div>

      {/* Article Info */}
      <div className="flex flex-col gap-2 py-2 flex-1 min-w-0">
        {/* Article Title */}
        <h3 className="text-gray-900 font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>

        {/* Author and Date */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-auto">
          <span>{authorName}</span>
          <span>/</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
}
