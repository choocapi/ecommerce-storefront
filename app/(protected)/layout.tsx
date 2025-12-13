"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import Loading from "../loading";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, accessToken, initialize, isLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      initialize().finally(() => {
        setIsInitialized(true);
      });
    }
  }, [initialize, isInitialized]);

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    if (!accessToken || !user) {
      router.push("/");
      return;
    }
  }, [user, accessToken, isLoading, isInitialized, pathname]);

  if (!isInitialized || isLoading || !accessToken || !user) {
    return <Loading />;
  }

  return <>{children}</>;
}
