import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import type { IApiResponse } from "@/types/api-response";
import type { IUser } from "@/types/user";

export const userService = {
  // GET /users/me
  getMyInfo: async (): Promise<IUser> => {
    const res = await api.get<IApiResponse<IUser>>("/users/me");
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // PATCH /users/me
  updateMyProfile: async (request: Partial<IUser>): Promise<IUser> => {
    const res = await api.patch<IApiResponse<IUser>>("/users/me", request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Update failed");
    }
    return res.data.data;
  },

  // PATCH /users/change-password
  changePassword: async (request: { oldPassword: string; newPassword: string }): Promise<IUser> => {
    const res = await api.patch<IApiResponse<IUser>>("/users/change-password", request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Change password failed");
    }
    return res.data.data;
  },
};

// Query Keys
export const userQueryKeys = {
  all: ["users"] as const,
  me: () => [...userQueryKeys.all, "me"] as const,
};

// Query Options
export const userQueries = {
  me: createQueryOptions(
    userQueryKeys.me(),
    () => userService.getMyInfo(),
    { staleTime: 2 * 60 * 1000 }, // User info cần fresh hơn
  ),
};
