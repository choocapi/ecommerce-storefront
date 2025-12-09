"use client";

import Loader from "@/components/common/loader";
import ReviewCard from "@/components/shared/profile/review-card";
import { productReviewService } from "@/services/productReviewService";
import type { IProductReview } from "@/types/products";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<IProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const data = await productReviewService.getMyReviews();
      setReviews(data);
    } catch (error: any) {
      console.error("Fetch reviews error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await productReviewService.delete(id);
      toast.success("Xóa đánh giá thành công!");
      fetchReviews();
    } catch (error: any) {
      console.error("Delete review error:", error);
      toast.error("Không thể xóa đánh giá");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đánh giá và nhận xét</h2>
          <p className="text-sm text-gray-500">{reviews.length} đánh giá đã để lại</p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">Bạn chưa có đánh giá nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
