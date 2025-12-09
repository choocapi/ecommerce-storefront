"use client";

import { Button } from "@/components/ui/button";
import { cartItemQueries, cartItemQueryKeys, cartItemService } from "@/services/cartItemService";
import { useAuthStore } from "@/stores/useAuthStore";
import { getProductImageUrl } from "@/types/products";
import { formatCurrency } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import InvalidImage from "../common/invalid-image";
import Loader from "../common/loader";

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

export default function CartDropdown({ isOpen, onClose, triggerRef }: CartDropdownProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sử dụng React Query để fetch cart items
  const { data: cartItems = [], isLoading } = useQuery({
    ...cartItemQueries.list(),
    enabled: isOpen && !!user,
  });

  // Mutation để xóa item
  const deleteMutation = useMutation({
    mutationFn: (itemId: number) => cartItemService.delete(itemId),
    onSuccess: () => {
      // Invalidate cart queries để refetch
      queryClient.invalidateQueries({ queryKey: cartItemQueryKeys.all });
    },
  });

  // Calculate total
  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const handleRemoveItem = (itemId: number) => {
    deleteMutation.mutate(itemId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg border border-gray-200 z-50"
    >
      {!user ? (
        // Not logged in state
        <div className="p-8 text-center">
          <p className="text-gray-900 font-bold text-base mb-2">Vui lòng đăng nhập</p>
          <p className="text-gray-500 text-sm mb-4">Đăng nhập để xem giỏ hàng của bạn</p>
          <Button
            asChild
            className="text-white bg-primary font-semibold rounded-full hover:bg-rose-600"
          >
            <Link href={"#"} onClick={onClose}>
              Đăng nhập
            </Link>
          </Button>
        </div>
      ) : isLoading ? (
        // Loading state
        <div className="p-8 text-center">
          <Loader className="inline-block" />
          <p className="mt-2 text-sm text-gray-500">Đang tải...</p>
        </div>
      ) : cartItems.length === 0 ? (
        // Empty cart
        <div className="p-8 text-center">
          <p className="text-gray-900 font-bold text-lg mb-2">Giỏ hàng trống</p>
          <p className="text-gray-500 text-sm mb-4">Hãy thêm sản phẩm vào giỏ hàng</p>
          <Button
            asChild
            variant="outline"
            className="rounded-full font-semibold"
            onClick={onClose}
          >
            <Link href="#">Xem sản phẩm</Link>
          </Button>
        </div>
      ) : (
        // Cart with items
        <div className="flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="flex items-center rounded-t-xl bg-gray-50 justify-between px-4 py-2 border-b border-gray-200">
            <h3 className="text-gray-900 font-bold text-lg">Giỏ hàng ({cartItems.length})</h3>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full text-gray-900 hover:text-primary"
              onClick={onClose}
            >
              <Link href="/cart">Xem tất cả</Link>
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="flex flex-col gap-2">
              {cartItems.map((item) => {
                const product = item.product;
                if (!product) return null;

                const imageUrl = getProductImageUrl(product);
                const hasOriginalPrice =
                  product.originalPrice && product.originalPrice > product.price;

                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <InvalidImage />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 text-base line-clamp-2 mb-1">{product.name}</h4>
                      <p className="text-gray-500 text-sm mb-2">
                        {/* Description or specs - có thể customize theo data thực tế */}
                        {product.brand?.name || "Chính hãng"}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-primary font-bold text-sm">
                          {formatCurrency(product.price)}
                        </span>
                        {hasOriginalPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            {formatCurrency(product.originalPrice!)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity and Remove */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-gray-500 text-sm">x{item.quantity}</span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 rounded-full hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Xóa sản phẩm"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer with Total and Checkout */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-900 font-bold text-base">Tổng cộng</span>
              <span className="text-gray-900 font-bold text-lg">{formatCurrency(totalAmount)}</span>
            </div>
            <Button
              asChild
              className="w-full bg-primary text-white rounded-full hover:bg-rose-600 text-base font-semibold"
              onClick={onClose}
            >
              <Link href="/checkout">Đặt hàng</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
