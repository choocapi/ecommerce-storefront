import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { PageResponse } from "@/types";
import type { IApiResponse } from "@/types/api-response";
import type { IBrand } from "@/types/products";

export const brandService = {
  // GET /brands (with pagination)
  list: async (page = 0, size = 20): Promise<PageResponse<IBrand>> => {
    const res = await api.get<IApiResponse<PageResponse<IBrand>>>("/brands", {
      params: { page, size, sort: "name,asc" },
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /brands (all, no pagination)
  listAll: async (): Promise<IBrand[]> => {
    const pageResponse = await brandService.list(0, 1000);
    return pageResponse.content;
  },
};

// Query Keys
export const brandQueryKeys = {
  all: ["brands"] as const,
  lists: () => [...brandQueryKeys.all, "list"] as const,
};

// Query Options
export const brandQueries = {
  listAll: createQueryOptions([...brandQueryKeys.all, "all"], () => brandService.listAll(), {
    staleTime: 10 * 60 * 1000,
  }),
};
