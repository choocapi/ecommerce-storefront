import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { PageResponse } from "@/types";
import type { IApiResponse } from "@/types/api-response";
import type { ICoupon } from "@/types/coupon";

export interface CouponListFilters {
  search?: string;
  isActive?: boolean;
}

const buildFilterParams = (filters?: CouponListFilters) => {
  if (!filters) {
    return {};
  }

  const params: Record<string, unknown> = {};

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  if (typeof filters.isActive === "boolean") {
    params.isActive = filters.isActive;
  }

  return params;
};

export const couponService = {
  // GET /coupons (with pagination)
  list: async (
    page = 0,
    size = 20,
    filters?: CouponListFilters,
  ): Promise<PageResponse<ICoupon>> => {
    const res = await api.get<IApiResponse<PageResponse<ICoupon>>>("/coupons", {
      params: { page, size, sort: "desc", ...buildFilterParams(filters) },
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /coupons (all, no pagination)
  listAll: async (filters?: CouponListFilters): Promise<ICoupon[]> => {
    const page = await couponService.list(0, 1000, filters);
    return page.content;
  },

  // GET /coupons/code/{code}
  getByCode: async (code: string): Promise<ICoupon> => {
    const res = await api.get<IApiResponse<ICoupon>>(`/coupons/code/${code}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },
};

// Query Keys
export const couponQueryKeys = {
  all: ["coupons"] as const,
  lists: () => [...couponQueryKeys.all, "list"] as const,
  list: (filters?: CouponListFilters) => [...couponQueryKeys.lists(), filters] as const,
  byCode: (code: string) => [...couponQueryKeys.all, "code", code] as const,
};

// Query Options
export const couponQueries = {
  list: createQueryOptions(
    couponQueryKeys.lists(),
    (filters?: CouponListFilters) => couponService.list(0, 20, filters),
    { staleTime: 10 * 60 * 1000 },
  ),

  listAll: createQueryOptions(
    [...couponQueryKeys.all, "all"],
    (filters?: CouponListFilters) => couponService.listAll(filters),
    { staleTime: 10 * 60 * 1000 },
  ),

  byCode: createQueryOptions(couponQueryKeys.all, (code: string) => couponService.getByCode(code), {
    enabled: (code) => !!code,
    staleTime: 10 * 60 * 1000,
  }),
};
