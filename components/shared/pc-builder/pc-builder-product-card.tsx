"use client";

import InvalidImage from "@/components/common/invalid-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getProductDiscountPercentage, getProductImageUrl, type IProduct } from "@/types/products";
import { formatCurrency } from "@/utils";
import Image from "next/image";

interface PCBuilderProductCardProps {
  product: IProduct;
  onSelect: (product: IProduct) => void;
  className?: string;
}

export function PCBuilderProductCard({ product, onSelect, className }: PCBuilderProductCardProps) {
  const imageUrl = getProductImageUrl(product);
  const discountPercentage = getProductDiscountPercentage(product);
  const hasDiscount = discountPercentage > 0 && product.originalPrice;

  return (
    <div
      className={cn(
        "group flex flex-col rounded-xl bg-white border border-gray-200 overflow-hidden",
        "hover:shadow-md transition-all duration-300",
        className,
      )}
    >
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
          />
        ) : (
          <InvalidImage />
        )}

        {hasDiscount && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-primary text-white px-2 py-1 rounded-md text-[11px] font-semibold">
              -{discountPercentage}%
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-3">
        {product.brand && (
          <span className="inline-flex w-fit rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
            {product.brand.name}
          </span>
        )}

        <p className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
          {product.name}
        </p>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-primary font-semibold text-base">
            {formatCurrency(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(product.originalPrice!)}
            </span>
          )}
        </div>

        <Button
          size="sm"
          className="mt-2 w-full rounded-full font-semibold"
          onClick={() => onSelect(product)}
        >
          Chọn
        </Button>
      </div>
    </div>
  );
}
