import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { IApiResponse } from "@/types/api-response";
import { ICartItem, ICartSummary } from "@/types/cart";

export interface CartItemAddRequest {
  productId: number;
  quantity: number;
}

export const cartItemService = {
  async add(productId: number, quantity: number = 1): Promise<ICartItem> {
    const response = await api.post<IApiResponse<ICartItem>>("/cart-items", {
      productId,
      quantity,
    });
    if (!response.data.data) {
      throw new Error("Failed to add item to cart");
    }
    return response.data.data;
  },

  async addBatch(requests: CartItemAddRequest[]): Promise<ICartItem[]> {
    const response = await api.post<IApiResponse<ICartItem[]>>("/cart-items/batch", requests);
    if (!response.data.data) {
      throw new Error("Failed to add items to cart");
    }
    return response.data.data;
  },

  async list(): Promise<ICartItem[]> {
    const response = await api.get<IApiResponse<ICartItem[]>>("/cart-items");
    return response.data.data || [];
  },

  async update(id: number, quantity: number): Promise<ICartItem> {
    const response = await api.patch<IApiResponse<ICartItem>>(`/cart-items/${id}/${quantity}`);
    if (!response.data.data) {
      throw new Error("Failed to update cart item");
    }
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/cart-items/${id}`);
  },

  async getCartSummary(): Promise<ICartSummary> {
    const response = await api.get<IApiResponse<ICartSummary>>("/cart-items/summary");
    if (!response.data.data) {
      throw new Error("Failed to get cart summary");
    }
    return response.data.data;
  },
};

// Query Keys
export const cartItemQueryKeys = {
  all: ["cart-items"] as const,
  list: () => [...cartItemQueryKeys.all, "list"] as const,
  summary: () => [...cartItemQueryKeys.all, "summary"] as const,
};

// Query Options
export const cartItemQueries = {
  list: createQueryOptions(
    cartItemQueryKeys.list(),
    () => cartItemService.list(),
    { staleTime: 1 * 60 * 1000 }, // Cart data cần fresh hơn
  ),

  summary: createQueryOptions(cartItemQueryKeys.summary(), () => cartItemService.getCartSummary(), {
    staleTime: 1 * 60 * 1000,
  }),
};
