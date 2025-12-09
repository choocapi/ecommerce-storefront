import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import type { IApiResponse } from "@/types/api-response";
import { IUserAddress } from "@/types/user-address";

export const userAddressService = {
  // POST /users/addresses
  create: async (request: Partial<IUserAddress>): Promise<IUserAddress> => {
    const res = await api.post<IApiResponse<IUserAddress>>("/users/addresses", request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Create failed");
    }
    return res.data.data;
  },

  // GET /users/addresses
  list: async (): Promise<IUserAddress[]> => {
    const res = await api.get<IApiResponse<IUserAddress[]>>("/users/addresses");
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /users/addresses/{id}
  get: async (id: string): Promise<IUserAddress> => {
    const res = await api.get<IApiResponse<IUserAddress>>(`/users/addresses/${id}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // PATCH /users/addresses/{id}
  update: async (id: number, request: Partial<IUserAddress>): Promise<IUserAddress> => {
    const res = await api.patch<IApiResponse<IUserAddress>>(`/users/addresses/${id}`, request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Update failed");
    }
    return res.data.data;
  },

  // DELETE /users/addresses/{id}
  delete: async (id: number): Promise<void> => {
    await api.delete<IApiResponse<void>>(`/users/addresses/${id}`);
  },
};

// Query Keys
export const userAddressQueryKeys = {
  all: ["user-addresses"] as const,
  lists: () => [...userAddressQueryKeys.all, "list"] as const,
  detail: (id: number) => [...userAddressQueryKeys.all, "detail", id] as const,
};

// Query Options
export const userAddressQueries = {
  list: createQueryOptions(userAddressQueryKeys.lists(), () => userAddressService.list(), {
    staleTime: 2 * 60 * 1000,
  }),
};
