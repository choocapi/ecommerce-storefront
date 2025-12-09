"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { couponQueries, couponService } from "@/services/couponService";
import { useCartStore } from "@/stores/useCartStore";
import { ICoupon } from "@/types/coupon";
import { CouponTypeEnum } from "@/types/enums";
import { formatCurrency } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Gift, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
}

export default function CouponModal({ isOpen, onClose, subtotal }: CouponModalProps) {
  const [searchCode, setSearchCode] = useState("");
  const { selectedCoupon, setSelectedCoupon } = useCartStore();

  const { data: couponsData, isLoading } = useQuery(couponQueries.listAll({ isActive: true }));

  const coupons = couponsData || [];
  const filteredCoupons = searchCode
    ? coupons.filter((c) => c.code.toLowerCase().includes(searchCode.toLowerCase()))
    : coupons;

  const handleApplyCoupon = (coupon: ICoupon) => {
    // Validate coupon
    if (coupon.startDate && new Date(coupon.startDate) > new Date()) {
      toast.error("Mã giảm giá chưa có hiệu lực!");
      return;
    }
    if (coupon.endDate && new Date(coupon.endDate) < new Date()) {
      toast.error("Mã giảm giá đã hết hạn!");
      return;
    }
    if (coupon.usageLimit && coupon.usedCount && coupon.usedCount >= coupon.usageLimit) {
      toast.error("Mã giảm giá đã hết lượt sử dụng!");
      return;
    }

    setSelectedCoupon(coupon);
    toast.success("Đã áp dụng mã giảm giá!");
    onClose();
  };

  const handleSearchAndApply = async () => {
    if (!searchCode.trim()) {
      toast.error("Vui lòng nhập mã giảm giá!");
      return;
    }

    try {
      const coupon = await couponService.getByCode(searchCode.trim());
      handleApplyCoupon(coupon);
    } catch (error: any) {
      toast.error("Mã giảm giá không hợp lệ!");
    }
  };

  const calculateDiscount = (coupon: ICoupon): number => {
    if (coupon.type === CouponTypeEnum.FIXED) {
      return Math.min(coupon.value, subtotal);
    } else {
      return (subtotal * coupon.value) / 100;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900 font-bold text-2xl">
            Chọn hoặc nhập mã khuyến mãi
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Nhập mã khuyến mại"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchAndApply();
                }
              }}
              className="flex-1 rounded-md h-10 border border-gray-200"
            />
            <Button
              onClick={handleSearchAndApply}
              className="rounded-full bg-gray-900 text-white hover:bg-gray-800 font-semibold h-10"
            >
              <Search className="size-4" />
              Tìm mã
            </Button>
          </div>

          {/* Info Text */}
          <p className="text-sm text-gray-600">
            Bạn có thể chọn {filteredCoupons.length} mã khuyến mãi
          </p>

          {/* Coupons List */}
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Đang tải mã giảm giá...</div>
          ) : filteredCoupons.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchCode ? "Không tìm thấy mã giảm giá" : "Không có mã giảm giá nào"}
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredCoupons.map((coupon) => {
                const discount = calculateDiscount(coupon);
                const isSelected = selectedCoupon?.id === coupon.id;

                return (
                  <button
                    key={coupon.id}
                    type="button"
                    onClick={() => handleApplyCoupon(coupon)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Gift className="h-5 w-5 text-primary" />
                          <span className="text-gray-900 font-bold text-lg">{coupon.code}</span>
                        </div>
                        {coupon.description && (
                          <p className="text-sm text-gray-600 mb-2">{coupon.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {coupon.type === CouponTypeEnum.FIXED ? (
                            <span>Giảm {formatCurrency(coupon.value)}</span>
                          ) : (
                            <span>Giảm {coupon.value}%</span>
                          )}
                          {discount > 0 && (
                            <span className="text-primary font-semibold">
                              (Tiết kiệm {formatCurrency(discount)})
                            </span>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="shrink-0">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
