"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/schemas";
import { authService } from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Eye, EyeOff, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type ResetStatus = "form" | "submitting" | "success" | "error";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<ResetStatus>(token ? "form" : "error");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    token ? "" : "Token không hợp lệ hoặc đã hết hạn",
  );

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Token không hợp lệ hoặc đã hết hạn");
      return;
    }

    setStatus("submitting");
    try {
      await authService.resetPassword(token, data.newPassword);
      setStatus("success");
      toast.success("Đặt lại mật khẩu thành công!");
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      setStatus("error");
      const message =
        error?.response?.data?.error?.message ||
        error?.message ||
        "Token không hợp lệ hoặc đã hết hạn";
      setErrorMessage(message);
      toast.error(message);
    }
  };

  if (status === "success") {
    return (
      <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="rounded-full bg-green-100 p-4 mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Đặt lại mật khẩu thành công!
              </h1>
              <p className="text-sm text-gray-600 mb-6">
                Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập với mật khẩu mới.
              </p>
              <Button size="lg" asChild className="rounded-full text-white text-base font-semibold">
                <Link href="/">Về trang chủ</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="rounded-full bg-red-100 p-4 mb-4">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Đặt lại mật khẩu thất bại</h1>
              <p className="text-sm text-gray-600 mb-6">{errorMessage}</p>
              <Button size="lg" asChild className="rounded-full text-white text-base font-semibold">
                <Link href="/">Về trang chủ</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Đặt lại mật khẩu</h1>
            <p className="text-sm text-gray-600">Vui lòng nhập mật khẩu mới của bạn</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Mật khẩu mới
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu mới"
                          className="rounded-md pr-10 h-10"
                          {...field}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                          {showPassword ? (
                            <EyeOff className="size-5" />
                          ) : (
                            <Eye className="size-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Xác nhận mật khẩu
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Nhập lại mật khẩu mới"
                          className="rounded-md pr-10 h-10"
                          {...field}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="size-5" />
                          ) : (
                            <Eye className="size-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                size="lg"
                type="submit"
                className="w-full rounded-full text-white text-base font-semibold"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Đang xử lý..." : "Đặt lại mật khẩu"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
