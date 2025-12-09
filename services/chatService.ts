import api from "@/lib/axios";
import type { IApiResponse } from "@/types/api-response";

export interface ChatProductSuggestion {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  category?: string | null;
  brand?: string | null;
  quantity?: number | null;
  thumbnailUrl?: string | null;
}

export interface ChatOrderSummary {
  id: string;
  status: string;
  totalAmount: number;
  orderedAt: string;
  itemCount: number;
}

export interface ChatResponse {
  reply: string;
  queryType: string;
  timestamp: string;
  products?: ChatProductSuggestion[];
  orders?: ChatOrderSummary[];
}

export interface ChatMessagePayload {
  sender: "user" | "bot";
  text: string;
  queryType?: string;
  productIds?: number[];
  orderIds?: string[];
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessagePayload[];
}

export const chatService = {
  // POST /chat
  sendMessage: async (payload: ChatRequest): Promise<ChatResponse> => {
    const res = await api.post<IApiResponse<ChatResponse>>("/chat", {
      ...payload,
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Chat request failed");
    }
    return res.data.data;
  },
};
