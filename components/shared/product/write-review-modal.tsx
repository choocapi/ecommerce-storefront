"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { Textarea } from "@/components/ui/textarea";
import { productReviewQueryKeys, productReviewService } from "@/services/productReviewService";
import { IProduct, getProductImageUrl } from "@/types/products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import MultipleImageUpload from "./multiple-image-upload";

interface WriteReviewModalProps {
  product: IProduct;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  // When true (e.g. from order details page), all reviews will be marked as purchased
  isPurchased?: boolean;
}

export default function WriteReviewModal({
  product,
  isOpen,
  onClose,
  onSuccess,
  isPurchased = false,
}: WriteReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const createReviewMutation = useMutation({
    mutationFn: productReviewService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productReviewQueryKeys.byProduct(product.id),
      });
      toast.success("Đánh giá đã được gửi thành công!");
      handleClose();
      onSuccess();
    },
    onError: (error: any) => {
      toast.error("Gửi đánh giá thất bại!");
    },
  });

  const handleClose = () => {
    setRating(5);
    setContent("");
    setImages([]);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Vui lòng chọn đánh giá");
      return;
    }

    const imageUrls = images.length > 0 ? JSON.stringify(images) : undefined;

    createReviewMutation.mutate({
      productId: product.id,
      rating,
      content: content.trim() || undefined,
      imageUrls,
      isPurchased,
    });
  };

  const productImageUrl = getProductImageUrl(product);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900 font-bold text-2xl">
            Đánh giá và nhận xét
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Product Info */}
          <div className="flex gap-4">
            {productImageUrl && (
              <div className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200 shrink-0">
                <Image src={productImageUrl} alt={product.name} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 font-semibold text-sm mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2">{product.sku}</p>
              <div className="mt-2">
                <Rating value={rating} className="text-yellow-400" onValueChange={setRating}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <RatingButton key={index} size={20} />
                  ))}
                </Rating>
              </div>
            </div>
          </div>

          {/* Review Content */}
          <div>
            <Label htmlFor="content" className="text-gray-900 font-medium">
              Đánh giá của bạn
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Mọi sản phẩm đều có ưu, nhược riêng. Chia sẻ chi tiết cho anh em về sản phẩm bạn nhé"
              className="mt-2 min-h-[120px] rounded-md"
              rows={5}
            />
          </div>

          {/* Image Upload */}
          <MultipleImageUpload
            maxImages={3}
            folder="product-reviews"
            label="Thêm ảnh thực tế"
            value={images}
            onChange={setImages}
            disabled={createReviewMutation.isPending}
          />

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={createReviewMutation.isPending}
              className="rounded-full bg-gray-900 text-white hover:bg-gray-800 font-semibold px-8"
            >
              {createReviewMutation.isPending ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
