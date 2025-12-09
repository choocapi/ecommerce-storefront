"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  onOpenLogin,
}: ForgotPasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      setIsLoading(true);
      await authService.forgotPassword(values.email);
      setIsSubmitted(true);
      toast.success("Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.");
    } catch (error: unknown) {
      console.error("Forgot password error:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setIsSubmitted(false);
    onClose();
  };

  const handleBackToLogin = () => {
    handleClose();
    if (onOpenLogin) {
      setTimeout(() => {
        onOpenLogin();
      }, 100);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <Image
              src="/logo.svg"
              alt="ACB Computer Logo"
              width={120}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </div>
          <DialogTitle className="text-gray-900 font-medium text-lg text-center">
            Quên mật khẩu
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm text-center">
            {isSubmitted
              ? "Chúng tôi đã gửi email khôi phục mật khẩu đến địa chỉ email của bạn."
              : "Nhập email của bạn để nhận link khôi phục mật khẩu"}
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-xl text-center">
              <p className="text-gray-900 text-sm">
                Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn để đặt lại mật khẩu.
              </p>
            </div>
            <DialogFooter>
              <Button
                onClick={handleBackToLogin}
                className="w-full bg-primary text-white rounded-full h-10 hover:bg-rose-600 font-medium text-lg"
              >
                Quay lại đăng nhập
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-sm">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          className="rounded-md border-gray-200 h-10 pl-10 pr-3"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex-col gap-2 sm:flex-col">
                <Button
                  type="submit"
                  className="w-full bg-primary text-white rounded-full h-10 hover:bg-rose-600 font-semibold text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang gửi email..." : "Gửi email khôi phục"}
                </Button>
                <div className="text-center text-sm">
                  <span className="text-gray-500">Nhớ mật khẩu? </span>
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-primary hover:underline font-medium"
                  >
                    Đăng nhập ngay
                  </button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
