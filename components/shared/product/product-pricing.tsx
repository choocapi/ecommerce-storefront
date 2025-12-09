"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cartItemQueryKeys, cartItemService } from "@/services/cartItemService";
import { IProduct, getProductDiscountPercentage } from "@/types/products";
import { formatCurrency } from "@/utils";
import { IconShoppingCartPlus } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductPricingProps {
  product: IProduct;
  className?: string;
}

export default function ProductPricing({ product, className }: ProductPricingProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const discountPercentage = getProductDiscountPercentage(product);
  const hasDiscount = discountPercentage > 0 && product.originalPrice;

  const addToCartMutation = useMutation({
    mutationFn: (quantity: number = 1) => cartItemService.add(product.id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartItemQueryKeys.all });
      toast.success("Đã thêm vào giỏ hàng!");
    },
    onError: (error: any) => {
      toast.error("Thêm vào giỏ hàng thất bại!");
    },
  });

  const handleBuyNow = async () => {
    try {
      await addToCartMutation.mutateAsync(1);
      router.push("/cart");
    } catch (error) {
      // Error đã được xử lý trong mutation
    }
  };

  const handleAddToCart = () => {
    addToCartMutation.mutate(1);
  };

  return (
    <div className={className}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all">
        {/* Pricing Section */}
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-3">
            <span className="text-primary font-medium text-2xl">
              {formatCurrency(product.price)}
            </span>
            {hasDiscount && product.originalPrice && (
              <>
                <span className="text-gray-400 line-through text-base">
                  {formatCurrency(product.originalPrice)}
                </span>
                <Badge className="bg-primary text-white px-2 rounded-md text-sm font-semibold">
                  -{discountPercentage}%
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            size="lg"
            onClick={handleBuyNow}
            disabled={addToCartMutation.isPending}
            className="flex-1 rounded-full bg-primary text-white hover:bg-rose-600 h-11 font-bold text-base"
          >
            Mua ngay
          </Button>
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending}
            variant="outline"
            className="flex-1 rounded-full bg-gray-900 text-white hover:bg-gray-800 h-11 hover:text-white font-bold text-base border-none"
          >
            <IconShoppingCartPlus className="size-5" />
            Thêm vào giỏ
          </Button>
        </div>
      </div>
    </div>
  );
}
