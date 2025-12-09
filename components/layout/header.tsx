"use client";

import ForgotPasswordModal from "@/components/shared/auth/forgotPasswordModal";
import LoginModal from "@/components/shared/auth/loginModal";
import RegisterModal from "@/components/shared/auth/registerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { cartItemQueries } from "@/services/cartItemService";
import { useAuthStore } from "@/stores/useAuthStore";
import { formatCurrency, getUserFullName } from "@/utils";
import { IconDevices2, IconShoppingBag } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { CircleUserRound, HelpCircle, Menu, Newspaper, Phone, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import CartDropdown from "./cartDropdown";
import CategoryDropdown from "./categoryDropdown";
import SearchDropdown from "./searchDropdown";

export default function Header() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const cartButtonRef = useRef<HTMLAnchorElement | null>(null);
  const categoryButtonRef = useRef<HTMLButtonElement | null>(null);

  // Sử dụng React Query để fetch cart data
  const { data: cartItems = [] } = useQuery({
    ...cartItemQueries.list(),
    enabled: !!user,
  });

  const { data: cartSummary } = useQuery({
    ...cartItemQueries.summary(),
    enabled: !!user,
  });

  const cartTotal = cartSummary?.totalAmount || 0;
  const hasCartItems = cartItems.length > 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-white">
        <div className="container mx-auto px-2 md:px-3 lg:px-4">
          <div className="flex items-center justify-between h-10">
            <div className="flex items-center gap-4">
              {/* Phone */}
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 rounded-full text-gray-900 hover:text-primary transition-colors px-4 py-2"
                aria-label="Hotline"
              >
                <Link href="tel:0362343012">
                  <Phone className="h-4 w-4" />
                  <span className="hidden sm:inline font-bold text-xs">0362343012</span>
                </Link>
              </Button>

              {/* Support */}
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 rounded-full text-gray-900 hover:text-primary transition-colors px-4 py-2"
                aria-label="Hỗ trợ"
              >
                <Link href="#">
                  <HelpCircle className="h-4 w-4" />
                  <span className="hidden sm:inline font-bold text-xs">Hỗ trợ</span>
                </Link>
              </Button>
            </div>
            <div className="hidden md:flex items-center gap-4">
              {/* PC Builder - Desktop */}
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden lg:flex items-center gap-2 rounded-full text-gray-900 hover:text-primary transition-colors px-4 py-2"
                aria-label="PC Builder"
              >
                <Link href="/pc-builder">
                  <IconDevices2 className="size-4" />
                  <span className="hidden sm:inline font-bold text-xs">PC Builder</span>
                </Link>
              </Button>

              {/* News - Desktop */}
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden lg:flex items-center gap-2 rounded-full text-gray-900 hover:text-primary transition-colors px-4 py-2"
                aria-label="Tin tức"
              >
                <Link href="/articles">
                  <Newspaper className="h-4 w-4" />
                  <span className="hidden sm:inline font-bold text-xs">Tin tức</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-2 md:px-3 lg:px-4 py-1">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 shrink-0">
              {/* Logo */}
              <Link href="/" className="flex items-center shrink-0">
                <Image
                  src="/logo.svg"
                  alt="ACB Computer Logo"
                  width={80}
                  height={40}
                  className="h-12 w-auto"
                  priority
                />
              </Link>

              {/* Products Menu */}
              <div className="relative">
                <Button
                  ref={categoryButtonRef}
                  variant="ghost"
                  size="lg"
                  className="rounded-full font-bold text-base h-10 text-gray-900 hover:text-primary"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <Menu className="size-6 mr-1" />
                  <span className="hidden sm:inline">Sản phẩm</span>
                </Button>
                <CategoryDropdown
                  isOpen={isCategoryOpen}
                  onClose={() => setIsCategoryOpen(false)}
                  triggerRef={categoryButtonRef}
                />
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 relative">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const query = searchQuery.trim();
                  if (!query) return;
                  setIsSearchFocused(false);
                  router.push(`/search?keyword=${encodeURIComponent(query)}`);
                }}
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-7 w-7 text-primary pointer-events-none" />
                  <Input
                    ref={searchInputRef}
                    type="search"
                    placeholder="Xin chào, bạn đang tìm gì?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    className={cn(
                      "w-full pl-14 pr-4 rounded-full h-12",
                      "bg-gray-100 border border-gray-200 focus:bg-white",
                      "placeholder:text-gray-500",
                    )}
                  />
                </div>
              </form>

              {/* Search Dropdown */}
              <SearchDropdown
                isOpen={isSearchFocused}
                searchQuery={searchQuery}
                onClose={() => setIsSearchFocused(false)}
                inputRef={searchInputRef}
              />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Login */}
              {user ? (
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-full font-bold text-base h-10 text-gray-900 hover:text-primary"
                  asChild
                >
                  <Link href="/profile">
                    <CircleUserRound className="size-6 mr-1" />
                    <span className="hidden sm:inline">{getUserFullName(user) || "Tài khoản"}</span>
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-full font-bold text-base h-10 text-gray-900 hover:text-primary"
                  onClick={() => setIsLoginOpen(true)}
                >
                  <CircleUserRound className="size-6 mr-1" />
                  <span className="hidden sm:inline">Đăng nhập</span>
                </Button>
              )}

              {/* Shopping Cart */}
              <div className="relative">
                <Button
                  size="lg"
                  className="relative rounded-full text-white hover:bg-rose-600 font-bold text-base h-11"
                  asChild
                >
                  <Link
                    ref={cartButtonRef}
                    href="/cart"
                    aria-label="Giỏ hàng"
                    className="flex items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsCartOpen(!isCartOpen);
                    }}
                  >
                    <IconShoppingBag className="size-6 mr-1" />
                    {formatCurrency(cartTotal)}
                    {hasCartItems ? (
                      <span className="absolute -top-1 -right-1 bg-orange-400 border border-white text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center z-10">
                        {cartItems.length}
                      </span>
                    ) : null}
                  </Link>
                </Button>
                <CartDropdown
                  isOpen={isCartOpen}
                  onClose={() => setIsCartOpen(false)}
                  triggerRef={cartButtonRef}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenRegister={() => {
          setIsLoginOpen(false);
          setTimeout(() => setIsRegisterOpen(true), 100);
        }}
        onOpenForgotPassword={() => {
          setIsLoginOpen(false);
          setTimeout(() => setIsForgotPasswordOpen(true), 100);
        }}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onOpenLogin={() => {
          setIsRegisterOpen(false);
          setTimeout(() => setIsLoginOpen(true), 100);
        }}
      />
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onOpenLogin={() => {
          setIsForgotPasswordOpen(false);
          setTimeout(() => setIsLoginOpen(true), 100);
        }}
      />
    </header>
  );
}
