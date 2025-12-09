import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { PageResponse } from "@/types";
import type { IApiResponse } from "@/types/api-response";
import type { IProduct } from "@/types/products";

export interface ProductListFilters {
  search?: string;
  categoryId?: number;
  brandId?: number;
}

const buildFilterParams = (filters?: ProductListFilters) => {
  if (!filters) {
    return {};
  }

  const params: Record<string, unknown> = {};

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  if (typeof filters.categoryId === "number") {
    params.categoryId = filters.categoryId;
  }

  if (typeof filters.brandId === "number") {
    params.brandId = filters.brandId;
  }

  return params;
};

export const productService = {
  // GET /products (with pagination)
  list: async (
    page = 0,
    size = 20,
    filters?: ProductListFilters,
  ): Promise<PageResponse<IProduct>> => {
    const res = await api.get<IApiResponse<PageResponse<IProduct>>>("/products", {
      params: { page, size, sort: "name,asc", ...buildFilterParams(filters) },
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /products (all, no pagination)
  listAll: async (filters?: ProductListFilters): Promise<IProduct[]> => {
    const page = await productService.list(0, 1000, filters);
    return page.content;
  },

  // GET /products/slug/{slug}
  getBySlug: async (slug: string): Promise<IProduct> => {
    const res = await api.get<IApiResponse<IProduct>>(`/products/slug/${slug}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /products/category/{categorySlug}
  getByCategorySlug: async (
    categorySlug: string,
    page = 0,
    size = 20,
  ): Promise<PageResponse<IProduct>> => {
    const res = await api.get<IApiResponse<PageResponse<IProduct>>>(
      `/products/category/${categorySlug}`,
      {
        params: { page, size },
      },
    );
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },
};

// Query Keys - tập trung ở một chỗ
export const productQueryKeys = {
  all: ["products"] as const,
  lists: () => [...productQueryKeys.all, "list"] as const,
  list: (filters?: ProductListFilters) => [...productQueryKeys.lists(), filters] as const,
  bySlug: (slug: string) => [...productQueryKeys.all, "slug", slug] as const,
  byCategory: (slug: string, page: number, size: number) =>
    [...productQueryKeys.all, "category", slug, page, size] as const,
};

// Query Options - sử dụng với useQuery
export const productQueries = {
  list: createQueryOptions(
    productQueryKeys.lists(),
    (filters?: ProductListFilters) => productService.list(0, 20, filters),
    { staleTime: 10 * 60 * 1000 },
  ),

  listAll: createQueryOptions(
    [...productQueryKeys.all, "all"],
    (filters?: ProductListFilters) => productService.listAll(filters),
    { staleTime: 10 * 60 * 1000 },
  ),

  bySlug: createQueryOptions(
    productQueryKeys.all,
    (slug: string) => productService.getBySlug(slug),
    {
      enabled: (slug) => !!slug,
      staleTime: 10 * 60 * 1000,
    },
  ),

  byCategory: createQueryOptions(
    productQueryKeys.all,
    ({ slug, page, size }: { slug: string; page: number; size: number }) =>
      productService.getByCategorySlug(slug, page, size),
    {
      enabled: (params) => !!params.slug,
      staleTime: 10 * 60 * 1000,
    },
  ),
};
