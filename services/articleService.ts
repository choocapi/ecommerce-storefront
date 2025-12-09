import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { PageResponse } from "@/types";
import type { IApiResponse } from "@/types/api-response";
import type { IArticle } from "@/types/article";

export interface ArticleListFilters {
  search?: string;
  category?: string;
}

export interface ArticleListParams extends ArticleListFilters {
  page?: number;
  size?: number;
  isPublished?: boolean;
}

const buildFilterParams = (filters?: ArticleListFilters) => {
  if (!filters) {
    return {};
  }

  const params: Record<string, unknown> = {};

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  if (filters.category?.trim()) {
    params.category = filters.category.trim();
  }

  return params;
};

export const articleService = {
  // GET /articles (with pagination)
  list: async (
    page = 0,
    size = 20,
    filters?: ArticleListFilters,
    isPublished?: boolean,
  ): Promise<PageResponse<IArticle>> => {
    const params: Record<string, unknown> = {
      page,
      size,
      sort: "createdAt,desc",
      ...buildFilterParams(filters),
    };

    if (isPublished !== undefined) {
      params.isPublished = isPublished;
    }

    const res = await api.get<IApiResponse<PageResponse<IArticle>>>("/articles", {
      params,
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  listAll: async (filters?: ArticleListFilters): Promise<IArticle[]> => {
    const page = await articleService.list(0, 1000, filters);
    return page.content;
  },

  // GET /articles/slug/{slug}
  getBySlug: async (slug: string): Promise<IArticle> => {
    const res = await api.get<IApiResponse<IArticle>>(`/articles/slug/${slug}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /articles/category/{category}
  getByCategory: async (category: string, page = 0, size = 5): Promise<PageResponse<IArticle>> => {
    const res = await api.get<IApiResponse<PageResponse<IArticle>>>("/articles", {
      params: {
        page,
        size,
        sort: "createdAt,desc",
        category,
        isPublished: true,
      },
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },
};

// Query Keys
export const articleQueryKeys = {
  all: ["articles"] as const,
  lists: () => [...articleQueryKeys.all, "list"] as const,
  list: (filters?: ArticleListFilters) => [...articleQueryKeys.lists(), filters] as const,
  bySlug: (slug: string) => [...articleQueryKeys.all, "slug", slug] as const,
  byCategory: (category: string, page: number, size: number) =>
    [...articleQueryKeys.all, "category", category, page, size] as const,
};

// Query Options
export const articleQueries = {
  list: createQueryOptions(
    articleQueryKeys.lists(),
    (params?: ArticleListParams) => {
      const { page = 0, size = 10, isPublished, ...filters } = params || {};
      return articleService.list(page, size, filters, isPublished);
    },
    { staleTime: 10 * 60 * 1000 },
  ),

  listAll: createQueryOptions(
    [...articleQueryKeys.all, "all"],
    (filters?: ArticleListFilters) => articleService.listAll(filters),
    { staleTime: 10 * 60 * 1000 },
  ),

  bySlug: createQueryOptions(
    articleQueryKeys.all,
    (slug: string) => articleService.getBySlug(slug),
    {
      enabled: (slug) => !!slug,
      staleTime: 10 * 60 * 1000,
    },
  ),

  byCategory: createQueryOptions(
    articleQueryKeys.all,
    ({ category, page, size }: { category: string; page: number; size: number }) =>
      articleService.getByCategory(category, page, size),
    {
      enabled: (params) => !!params.category,
      staleTime: 10 * 60 * 1000,
    },
  ),
};
