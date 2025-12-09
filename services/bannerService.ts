import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { PageResponse } from "@/types";
import type { IApiResponse } from "@/types/api-response";
import { IBanner } from "@/types/banner";

export const bannerService = {
  // GET /banners (with pagination)
  list: async (page = 0, size = 20): Promise<PageResponse<IBanner>> => {
    const res = await api.get<IApiResponse<PageResponse<IBanner>>>("/banners", {
      params: { page, size, sort: "id,asc" },
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /banners (all, no pagination)
  listAll: async (): Promise<IBanner[]> => {
    const pageResponse = await bannerService.list(0, 1000);
    return pageResponse.content;
  },
};

// Query Keys
export const bannerQueryKeys = {
  all: ["banners"] as const,
  lists: () => [...bannerQueryKeys.all, "list"] as const,
};

// Query Options
export const bannerQueries = {
  listAll: createQueryOptions([...bannerQueryKeys.all, "all"], () => bannerService.listAll(), {
    staleTime: 10 * 60 * 1000,
  }),
};
