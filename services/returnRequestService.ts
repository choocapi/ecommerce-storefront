import api from "@/lib/axios";
import type { IApiResponse } from "@/types/api-response";
import type { IReturnRequest } from "@/types/return-request";

export const returnRequestService = {
  // POST /return-requests
  create: async (request: Partial<IReturnRequest>): Promise<IReturnRequest> => {
    const res = await api.post<IApiResponse<IReturnRequest>>("/return-requests", request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Create failed");
    }
    return res.data.data;
  },

  // GET /return-requests/my-requests
  getMyRequests: async (): Promise<IReturnRequest[]> => {
    const res = await api.get<IApiResponse<IReturnRequest[]>>("/return-requests/my-requests");
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /return-requests/:id
  get: async (id: number): Promise<IReturnRequest> => {
    const res = await api.get<IApiResponse<IReturnRequest>>(`/return-requests/${id}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },
};
