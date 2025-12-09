"use client";

import InvalidImage from "@/components/common/invalid-image";
import WriteReviewModal from "@/components/shared/product/write-review-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrderStatusEnum } from "@/types/enums";
import type { IOrderItem } from "@/types/order";
import { getProductImageUrl } from "@/types/products";
import { formatCurrency } from "@/utils";
import { Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface OrderProductCardProps {
  item: IOrderItem;
  orderStatus: string;
}

export default function OrderProductCard({ item, orderStatus }: OrderProductCardProps) {
  const product = item.product;
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);

  if (!product) return null;

  const imageUrl = getProductImageUrl(product);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  // Format variant info - combine SKU and category name
  const variantParts = [product.sku, product.category?.name].filter(Boolean);
  const variantInfo = variantParts.join(" / ");

  const canReview =
    orderStatus !== OrderStatusEnum.PENDING &&
    orderStatus !== OrderStatusEnum.PROCESSING &&
    orderStatus !== OrderStatusEnum.SHIPPED;

  return (
    <>
      <Card className="border border-gray-200 rounded-xl shadow-none">
        <div className="flex gap-4 px-4 py-0">
          {/* Product Image */}
          <Link
            href={`/products/${product.slug}`}
            className="relative shrink-0 size-20 rounded-md overflow-hidden"
          >
            {imageUrl ? (
              <Image src={imageUrl} alt={product.name} fill className="object-cover" sizes="80px" />
            ) : (
              <InvalidImage />
            )}
          </Link>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <Link href={`/products/${product.slug}`} className="block mb-1">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h3>
            </Link>
            {variantInfo && <p className="text-xs text-gray-500 mb-2">{variantInfo}</p>}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">x{item.quantity}</span>
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-primary">
                  {formatCurrency(item.unitPrice)}
                </span>
                {hasDiscount && product.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {canReview && (
              <div className="flex justify-end mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsWriteReviewOpen(true)}
                  className="h-8 px-3 rounded-full border-gray-200 text-gray-900 hover:bg-gray-50 text-xs font-semibold"
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  Viết đánh giá
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {canReview && (
        <WriteReviewModal
          product={product}
          isOpen={isWriteReviewOpen}
          onClose={() => setIsWriteReviewOpen(false)}
          onSuccess={() => setIsWriteReviewOpen(false)}
          isPurchased
        />
      )}
    </>
  );
}
