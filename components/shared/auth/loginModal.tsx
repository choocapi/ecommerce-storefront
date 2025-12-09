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
import { loginSchema, type LoginFormValues } from "@/schemas";
import { useAuthStore } from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister?: () => void;
  onOpenForgotPassword?: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onOpenRegister,
  onOpenForgotPassword,
}: LoginModalProps) {
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleOpenRegister = () => {
    onClose();
    onOpenRegister?.();
  };

  const handleOpenForgotPassword = () => {
    onClose();
    onOpenForgotPassword?.();
  };

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      form.reset();
      onClose();
    } catch (error) {
      // Error is handled by useAuthStore
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
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
              Đăng nhập
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm text-center">
              Nhập thông tin đăng nhập của bạn
            </DialogDescription>
          </DialogHeader>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-200 text-gray-900 rounded-full h-10 hover:bg-gray-50 font-medium text-sm flex items-center justify-center gap-3"
              onClick={() => {
                // TODO: Implement Facebook login
                toast.info("Chức năng đang phát triển!");
              }}
            >
              <Image
                src="/assets/facebook-icon.svg"
                alt="Facebook"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              Đăng nhập với Facebook
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-200 text-gray-900 rounded-full h-10 hover:bg-gray-50 font-medium text-sm flex items-center justify-center gap-3"
              onClick={() => {
                // Redirect to Google OAuth2 login
                // Spring Security OAuth2 Client uses /login/oauth2/authorization/{registrationId}
                window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/login/oauth2/authorization/google`;
              }}
            >
              <Image
                src="/assets/google-icon.svg"
                alt="Google"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              Đăng nhập với Google
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 text-sm">Hoặc</span>
            </div>
          </div>

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
                          className="rounded-md border-gray-200 h-10 pl-10 pr-3 text-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-sm">Mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu"
                          className="rounded-md border-gray-200 h-10 pl-10 pr-10 text-sm"
                          {...field}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleOpenForgotPassword}
                  className="text-primary text-sm hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <DialogFooter className="flex-col gap-2 sm:flex-col">
                <Button
                  type="submit"
                  className="w-full bg-primary text-white rounded-full h-10 hover:bg-rose-600 font-semibold text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
                <div className="text-center text-sm">
                  <span className="text-gray-500">Chưa có tài khoản? </span>
                  <button
                    type="button"
                    onClick={handleOpenRegister}
                    className="text-primary hover:underline font-medium"
                  >
                    Đăng ký ngay
                  </button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
