import type { ICoupon } from "@/types/coupon";
import { CouponTypeEnum } from "@/types/enums";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartState {
  selectedCoupon: ICoupon | null;
  setSelectedCoupon: (coupon: ICoupon | null) => void;
  clearCoupon: () => void;
  calculateDiscount: (subtotal: number) => number;
  calculateTotal: (subtotal: number) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      selectedCoupon: null,

      setSelectedCoupon: (coupon) => {
        set({ selectedCoupon: coupon });
      },

      clearCoupon: () => {
        set({ selectedCoupon: null });
      },

      calculateDiscount: (subtotal: number) => {
        const { selectedCoupon } = get();
        if (!selectedCoupon) return 0;

        if (selectedCoupon.type === CouponTypeEnum.FIXED) {
          return Math.min(selectedCoupon.value, subtotal);
        } else {
          return (subtotal * selectedCoupon.value) / 100;
        }
      },

      calculateTotal: (subtotal: number) => {
        const discount = get().calculateDiscount(subtotal);
        return subtotal - discount;
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage for cart data
      partialize: (state) => ({
        selectedCoupon: state.selectedCoupon,
      }),
    },
  ),
);

