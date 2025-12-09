import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { PageResponse } from "@/types";
import type { IApiResponse } from "@/types/api-response";
import type { ICategory } from "@/types/products";

export const categoryService = {
  // GET /categories (with pagination)
  list: async (page = 0, size = 20): Promise<PageResponse<ICategory>> => {
    const res = await api.get<IApiResponse<PageResponse<ICategory>>>("/categories", {
      params: { page, size, sort: "name,asc" },
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /categories (all, no pagination)
  listAll: async (): Promise<ICategory[]> => {
    const pageResponse = await categoryService.list(0, 1000);
    return pageResponse.content;
  },

  // GET /categories/{id}/children - Get children of a category
  getChildren: async (parentId: number): Promise<ICategory[]> => {
    const allCategories = await categoryService.listAll();
    return allCategories.filter((cat) => cat.parentId === parentId);
  },
};

// Query Keys
export const categoryQueryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryQueryKeys.all, "list"] as const,
  list: (page: number, size: number) => [...categoryQueryKeys.lists(), page, size] as const,
};

// Query Options
export const categoryQueries = {
  list: createQueryOptions(
    categoryQueryKeys.lists(),
    ({ page, size }: { page: number; size: number }) => categoryService.list(page, size),
    { staleTime: 10 * 60 * 1000 },
  ),

  listAll: createQueryOptions([...categoryQueryKeys.all, "all"], () => categoryService.listAll(), {
    staleTime: 10 * 60 * 1000,
  }),
};
