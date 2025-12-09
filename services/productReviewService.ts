import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { IApiResponse } from "@/types/api-response";
import { IProductReview } from "@/types/products";

interface CreateReviewRequest {
  productId: number;
  rating: number;
  content?: string;
  imageUrls?: string; // JSON string array: ["url1", "url2", ...]
  isPurchased?: boolean;
}

export const productReviewService = {
  async create(data: CreateReviewRequest): Promise<IProductReview> {
    const response = await api.post<IApiResponse<IProductReview>>("/product-reviews", data);
    if (!response.data.data) {
      throw new Error("Failed to create review");
    }
    return response.data.data;
  },

  async listByProduct(productId: number): Promise<IProductReview[]> {
    const response = await api.get<IApiResponse<IProductReview[]>>(
      `/product-reviews/product/${productId}`,
    );
    return response.data.data || [];
  },

  async getMyReviews(): Promise<IProductReview[]> {
    const response = await api.get<IApiResponse<IProductReview[]>>("/product-reviews/my-reviews");
    return response.data.data || [];
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/product-reviews/${id}`);
  },
};

// Query Keys
export const productReviewQueryKeys = {
  all: ["product-reviews"] as const,
  byProduct: (productId: number) =>
    [...productReviewQueryKeys.all, "product", productId] as const,
  myReviews: () => [...productReviewQueryKeys.all, "my-reviews"] as const,
};

// Query Options
export const productReviewQueries = {
  byProduct: createQueryOptions(
    productReviewQueryKeys.all,
    (productId: number) => productReviewService.listByProduct(productId),
  ),
  myReviews: createQueryOptions(
    productReviewQueryKeys.myReviews(),
    () => productReviewService.getMyReviews(),
  ),
};
