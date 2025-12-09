"use client";

import InvalidImage from "@/components/common/invalid-image";
import { Badge } from "@/components/ui/badge";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { cn } from "@/lib/utils";
import { getProductDiscountPercentage, getProductImageUrl, type IProduct } from "@/types/products";
import { formatCurrency, formatNumber } from "@/utils";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: IProduct;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const imageUrl = getProductImageUrl(product);
  const discountPercentage = getProductDiscountPercentage(product);
  const hasDiscount = discountPercentage > 0 && product.originalPrice;
  const rating = product.averageRating || 5;
  const reviewCount = product.reviewCount || 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group flex flex-col rounded-xl bg-white border border-gray-200 overflow-hidden",
        "hover:shadow-md transition-all duration-300",
        className,
      )}
    >
      {/* Product Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
          />
        ) : (
          <InvalidImage />
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-primary text-white px-2 py-1 rounded-md text-xs font-semibold">
              -{discountPercentage}%
            </Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-2 p-4">
        {/* Product Name */}
        <h3 className="text-gray-900 font-semibold text-base line-clamp-2 min-h-10 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <Rating value={rating} readOnly className="text-yellow-400">
            {Array.from({ length: 5 }).map((_, index) => (
              <RatingButton key={index} size={16} />
            ))}
          </Rating>
          <span className="text-gray-500 text-sm">
            {rating > 0 ? rating.toFixed(1) : "0.0"}
            {reviewCount > 0 && ` (${formatNumber(reviewCount)})`}
          </span>
        </div>

        {/* Price Section */}
        <div className="flex flex-col gap-1 mt-auto">
          {hasDiscount && (
            <span className="text-gray-400 line-through text-sm">
              {formatCurrency(product.originalPrice!)}
            </span>
          )}
          <span className="text-primary font-bold text-lg">{formatCurrency(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}
