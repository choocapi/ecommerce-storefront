"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getProductDiscountPercentage, getProductImageUrl, type IProduct } from "@/types/products";
import { formatCurrency } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import InvalidImage from "../../common/invalid-image";

interface HProductCardProps {
  product: IProduct;
  className?: string;
  showOriginalPrice?: boolean;
}

export default function HProductCard({
  product,
  className,
  showOriginalPrice = true,
}: HProductCardProps) {
  const imageUrl = getProductImageUrl(product);
  const discountPercentage = getProductDiscountPercentage(product);
  const hasDiscount = discountPercentage > 0 && product.originalPrice;

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-all overflow-hidden",
        className,
      )}
    >
      {/* Product Image */}
      <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xs overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="96px"
          />
        ) : (
          <InvalidImage />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        {/* Product Name & Specs */}
        <h3 className="text-gray-900 text-base line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-primary font-medium text-base">
            {formatCurrency(product.price)}
          </span>
          {hasDiscount && (
            <>
              {showOriginalPrice && product.originalPrice && (
                <span className="text-gray-400 line-through text-xs">
                  {formatCurrency(product.originalPrice!)}
                </span>
              )}
              <Badge className="bg-rose-200 text-rose-600 px-2 py-0.5 rounded-md text-xs font-medium">
                -{discountPercentage}%
              </Badge>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
