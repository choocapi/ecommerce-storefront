"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Category {
  name: string;
  slug: string;
}

interface FeaturedCategoriesProps {
  categories: readonly Category[];
  className?: string;
}

export default function FeaturedCategories({ categories, className }: FeaturedCategoriesProps) {
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4", className)}>
      {categories.map((category) => {
        const imagePath = `/assets/categories/${category.slug}.png`;

        return (
          <Link
            key={category.slug}
            href={`/${category.slug}`}
            className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-white hover:bg-rose-500/80 transition-all"
          >
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-transparent">
              <Image
                src={imagePath}
                alt={category.name}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 14.28vw, 14.28vw"
              />
            </div>
            <p className="text-base text-gray-900 font-semibold text-center line-clamp-2 group-hover:text-white group-hover:underline transition-all">
              {category.name}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
