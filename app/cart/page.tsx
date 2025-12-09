"use client";

import CartItemCard from "@/components/shared/cart/cart-item-card";
import CouponModal from "@/components/shared/cart/coupon-modal";
import { Button } from "@/components/ui/button";
import { cartItemQueries, cartItemQueryKeys, cartItemService } from "@/services/cartItemService";
import { useCartStore } from "@/stores/useCartStore";
import { CouponTypeEnum } from "@/types/enums";
import { formatCurrency } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Gift, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { selectedCoupon, setSelectedCoupon, calculateDiscount, calculateTotal } = useCartStore();
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  const { data: cartItems = [], isLoading } = useQuery(cartItemQueries.list());
  const { data: cartSummary } = useQuery(cartItemQueries.summary());

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(cartItems.map((item) => cartItemService.delete(item.id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartItemQueryKeys.all });
      toast.success("Đã xóa tất cả sản phẩm!");
    },
    onError: (error: any) => {
      toast.error("Xóa thất bại!");
    },
  });

  // Calculate totals
  const subtotal = cartSummary?.totalAmount || 0;
  const discount = calculateDiscount(subtotal);
  const total = calculateTotal(subtotal);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }

    // Coupon is already stored in store (persisted to sessionStorage)
    router.push("/checkout");
  };

  const handleRemoveCoupon = () => {
    useCartStore.getState().clearCoupon();
    toast.success("Đã xóa mã giảm giá!");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Cart Items */}
        <div className="lg:col-span-8">
          {cartItems.length === 0 ? (
            // Empty Cart State
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-gray-900 font-bold text-2xl mb-2">Giỏ hàng trống</h2>
              <p className="text-gray-600 text-sm mb-6">Hãy thoải mái lựa chọn sản phẩm bạn nhé</p>
              <Button
                asChild
                className="rounded-full bg-primary text-white hover:bg-rose-600 font-semibold px-8"
              >
                <Link href="/">Khám phá ngay</Link>
              </Button>
            </div>
          ) : (
            // Cart Items List
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-gray-900 font-bold text-2xl mb-1">Giỏ hàng</h1>
                  <p className="text-gray-600 text-sm">{cartItems.length} sản phẩm</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => deleteAllMutation.mutate()}
                  disabled={deleteAllMutation.isPending}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-semibold rounded-full"
                >
                  <Trash2 className="size-5" />
                  Xóa tất cả
                </Button>
              </div>

              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Promotions & Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Promotions Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-gray-900 font-bold text-xl mb-4">Khuyến mãi</h2>
            {selectedCoupon ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-gray-900 font-semibold text-sm">{selectedCoupon.code}</p>
                      <p className="text-gray-600 text-xs">
                        {selectedCoupon.type === CouponTypeEnum.FIXED
                          ? `Giảm ${formatCurrency(selectedCoupon.value)}`
                          : `Giảm ${selectedCoupon.value}%`}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveCoupon}
                    className="h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsCouponModalOpen(true)}
                  className="w-full rounded-full border-gray-200 text-gray-900 hover:bg-gray-50 font-semibold"
                >
                  <Gift className="mr-2 h-4 w-4" />
                  Chọn hoặc nhập mã khuyến mãi
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsCouponModalOpen(true)}
                className="w-full rounded-full h-10 border-gray-200 text-gray-900 hover:bg-gray-50 font-semibold"
              >
                <Gift className="size-5" />
                Chọn hoặc nhập mã khuyến mãi
              </Button>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-gray-900 font-bold text-xl mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-3">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Tạm tính</span>
                <span className="text-gray-900 font-semibold">{formatCurrency(subtotal)}</span>
              </div>

              {/* Discount */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Giảm giá</span>
                <span className="text-primary font-semibold">
                  {discount > 0 ? `-${formatCurrency(discount)}` : formatCurrency(0)}
                </span>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-3 border-t-2 border-dashed border-gray-300">
                <span className="text-gray-900 font-bold text-lg">Tổng cộng</span>
                <span className="text-primary font-bold text-xl">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className="w-full mt-6 rounded-full bg-primary text-white hover:bg-rose-600 font-semibold py-6 text-base"
            >
              Đặt hàng
            </Button>
          </div>
        </div>
      </div>

      {/* Coupon Modal */}
      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        subtotal={subtotal}
      />
    </div>
  );
}
