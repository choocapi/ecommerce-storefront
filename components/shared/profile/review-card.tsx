"use client";

import DeleteConfirmDialog from "@/components/shared/profile/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import type { IProductReview } from "@/types/products";
import { getProductImageUrl } from "@/types/products";
import { formatDate } from "@/utils";
import { ArrowRight, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ReviewCardProps {
  review: IProductReview;
  onDelete: (id: number) => void;
}

export default function ReviewCard({ review, onDelete }: ReviewCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const productImageUrl = review.product ? getProductImageUrl(review.product) : undefined;

  const handleDelete = () => {
    onDelete(review.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card className="p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex flex-col gap-4">
          {/* Product Info */}
          {review.product && (
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              {productImageUrl && (
                <Link
                  href={`/products/${review.product.slug}`}
                  className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200 shrink-0"
                >
                  <Image
                    src={productImageUrl}
                    alt={review.product.name}
                    fill
                    className="object-cover"
                  />
                </Link>
              )}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${review.product.slug}`}
                  className="block hover:text-primary transition-colors"
                >
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                    {review.product.name}
                  </h3>
                </Link>
                {review.createdAt && (
                  <p className="text-sm text-gray-500 mt-1">
                    Đánh giá ngày: {formatDate(review.createdAt)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2">
            <Rating value={review.rating} readOnly className="text-yellow-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <RatingButton key={index} size={16} />
              ))}
            </Rating>
            <span className="text-sm text-gray-600 font-medium">{review.rating}/5</span>
          </div>

          {/* Content */}
          {review.content && (
            <div>
              <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="h-8 px-3 rounded-full hover:bg-red-50 hover:text-red-600 text-sm"
            >
              <Trash2 className="size-4" />
              Xóa
            </Button>
            {review.product && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-gray-200 font-semibold text-gray-900 hover:bg-gray-50 rounded-full px-4"
              >
                <Link href={`/products/${review.product.slug}`}>
                  Xem sản phẩm
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </Card>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa đánh giá"
        description="Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
      />
    </>
  );
}
