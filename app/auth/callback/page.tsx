"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAccessToken, fetchMe } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      router.push("/?error=oauth_error");
      return;
    }

    if (token) {
      // Set access token and fetch user info
      setAccessToken(token);
      fetchMe()
        .then(() => {
          // Redirect to home page after successful login
          router.push("/");
        })
        .catch((err) => {
          console.error("Failed to fetch user info:", err);
          router.push("/?error=auth_failed");
        });
    } else {
      // No token, redirect to home
      router.push("/");
    }
  }, [searchParams, router, setAccessToken, fetchMe]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
}
