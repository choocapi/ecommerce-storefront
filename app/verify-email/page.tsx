"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authService } from "@/services/authService";
import { CheckCircle2, Mail, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type VerifyStatus = "idle" | "verifying" | "success" | "error";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Token không hợp lệ hoặc đã hết hạn");
      return;
    }

    const verifyEmail = async () => {
      setStatus("verifying");
      try {
        await authService.verifyEmail(token);
        setStatus("success");
        toast.success("Xác thực email thành công!");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } catch (error: any) {
        setStatus("error");
        const message = "Token không hợp lệ hoặc đã hết hạn";
        setErrorMessage(message);
        toast.error(message);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
          {status === "verifying" && (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <Spinner className="h-12 w-12 text-primary mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Đang xác thực email...</h1>
              <p className="text-sm text-gray-600">Vui lòng đợi trong giây lát</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="rounded-full bg-green-100 p-4 mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Xác thực email thành công!</h1>
              <p className="text-sm text-gray-600 mb-6">
                Email của bạn đã được xác thực. Bạn có thể đăng nhập ngay bây giờ.
              </p>
              <Button
                size="lg"
                asChild
                className="rounded-full text-gray-900 text-base font-semibold"
              >
                <Link href="/">Về trang chủ</Link>
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="rounded-full bg-red-100 p-4 mb-4">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Xác thực email thất bại</h1>
              <p className="text-sm text-gray-600 mb-6">{errorMessage}</p>
              <Button
                size="lg"
                asChild
                className="rounded-full text-gray-900 text-base font-semibold"
              >
                <Link href="/">Về trang chủ</Link>
              </Button>
            </div>
          )}

          {status === "idle" && (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <Mail className="h-12 w-12 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Xác thực email</h1>
              <p className="text-sm text-gray-600">Đang kiểm tra token...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
