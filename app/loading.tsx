"use client";

import Loader from "@/components/common/loader";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white">
      <Loader className="w-10 h-10 text-primary mb-4" />
      <p className="text-gray-900 text-sm font-medium font-lexend">Đang tải...</p>
    </div>
  );
}
