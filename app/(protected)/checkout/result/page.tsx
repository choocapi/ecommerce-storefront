"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Check, Home, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type ResultStatus = "processing" | "pending" | "success" | "failed" | "error";

export default function CheckoutResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<ResultStatus>("processing");
  const [message, setMessage] = useState("Đang xử lý kết quả thanh toán...");
  const [orderId, setOrderId] = useState<string>("");

  useEffect(() => {
    const resultStatus = searchParams.get("status");
    const orderIdParam = searchParams.get("orderId");

    if (orderIdParam) {
      setOrderId(orderIdParam);
    }

    if (resultStatus === "success") {
      setStatus("success");
      setMessage("Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.");

      setTimeout(() => {
        if (orderIdParam) {
          router.push(`/profile/orders/${orderIdParam}`);
        } else {
          router.push("/profile/orders");
        }
      }, 5000);
    } else if (resultStatus === "failed") {
      setStatus("failed");
      setMessage(
        "Thanh toán không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.",
      );
    } else if (resultStatus === "pending" || resultStatus === "processing") {
      setStatus("pending");
      setMessage("Đơn hàng đang được xử lý. Vui lòng đợi trong giây lát...");
    } else if (resultStatus === "error") {
      setStatus("error");
      setMessage("Có lỗi xảy ra trong quá trình xử lý thanh toán. Vui lòng liên hệ hỗ trợ.");
    }
  }, [searchParams, router]);

  const handleViewOrder = () => {
    if (orderId) {
      router.push(`/profile/orders/${orderId}`);
    } else {
      router.push("/profile/orders");
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleRetry = () => {
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="p-8 rounded-xl border border-gray-200">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Processing/Pending Status */}
            {(status === "processing" || status === "pending") && (
              <>
                <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <AlertCircle className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-gray-900 font-bold text-2xl mb-2">Đang xử lý...</h1>
                  <p className="text-sm text-gray-600">{message}</p>
                </div>
              </>
            )}

            {/* Success Status */}
            {status === "success" && (
              <>
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h1 className="text-gray-900 font-bold text-2xl mb-2">Thanh toán thành công!</h1>
                  <p className="text-sm text-gray-600 mb-4">{message}</p>
                  {orderId && (
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Mã đơn hàng: <span className="text-primary">{orderId}</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Đang chuyển hướng đến chi tiết đơn hàng...
                  </p>
                </div>
              </>
            )}

            {/* Failed/Error Status */}
            {(status === "failed" || status === "error") && (
              <>
                <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="h-10 w-10 text-red-600" />
                </div>
                <div>
                  <h1 className="text-gray-900 font-bold text-2xl mb-2">
                    {status === "failed" ? "Thanh toán thất bại" : "Lỗi xử lý thanh toán"}
                  </h1>
                  <p className="text-sm text-gray-600 mb-6">{message}</p>
                  {orderId && (
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Mã đơn hàng: <span className="text-primary">{orderId}</span>
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="w-full space-y-3">
                  {orderId && (
                    <Button
                      onClick={handleViewOrder}
                      className="w-full rounded-full bg-primary text-white hover:bg-rose-600 font-semibold"
                    >
                      Xem chi tiết đơn hàng
                    </Button>
                  )}
                  {status === "failed" && (
                    <Button
                      onClick={handleRetry}
                      variant="outline"
                      className="w-full rounded-full border-gray-200 text-gray-900 hover:bg-gray-50 font-semibold"
                    >
                      Thử lại thanh toán
                    </Button>
                  )}
                  <Button
                    onClick={handleBackToHome}
                    variant="ghost"
                    className="w-full rounded-full text-gray-600 hover:bg-gray-100 font-semibold"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Về trang chủ
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
