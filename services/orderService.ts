import api from "@/lib/axios";
import type { IApiResponse } from "@/types/api-response";
import type { IOrder } from "@/types/order";

export const orderService = {
  // POST /orders/from-cart
  createFromCart: async (request: {
    shippingAddress: string;
    shippingPhone: string;
    shippingName: string;
    shippingWard?: string;
    shippingDistrict?: string;
    shippingCity?: string;
    notes?: string;
    paymentMethod: string;
    discountAmount?: number;
    couponCode?: string;
  }): Promise<IOrder> => {
    const res = await api.post<IApiResponse<IOrder>>("/orders/from-cart", request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Create order from cart failed");
    }
    return res.data.data;
  },

  // GET /orders/{id}
  get: async (id: string): Promise<IOrder> => {
    const res = await api.get<IApiResponse<IOrder>>(`/orders/${id}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /orders/my-orders
  getMyOrders: async (): Promise<IOrder[]> => {
    const res = await api.get<IApiResponse<IOrder[]>>("/orders/my-orders");
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // POST /orders/{id}/cancel
  cancel: async (id: string): Promise<IOrder> => {
    const res = await api.post<IApiResponse<IOrder>>(`/orders/${id}/cancel`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Cancel failed");
    }
    return res.data.data;
  },

  // POST /orders/{id}/confirm-delivery
  confirmDelivery: async (id: string): Promise<IOrder> => {
    const res = await api.post<IApiResponse<IOrder>>(`/orders/${id}/confirm-delivery`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Confirm delivery failed");
    }
    return res.data.data;
  },
};
