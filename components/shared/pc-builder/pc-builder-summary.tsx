"use client";

import { Button } from "@/components/ui/button";
import { cartItemQueryKeys, cartItemService } from "@/services/cartItemService";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePCBuilderStore } from "@/stores/usePCBuilderStore";
import { formatCurrency } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function PCBuilderSummary() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const components = usePCBuilderStore((state) => state.components);
  const getTotalPrice = usePCBuilderStore((state) => state.getTotalPrice);

  const totalPrice = getTotalPrice();
  const componentEntries = Object.entries(components);
  const componentCount = componentEntries.length;

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const requests = componentEntries.map(([, component]) => ({
        productId: component.product.id,
        quantity: component.quantity,
      }));

      return await cartItemService.addBatch(requests);
    },
    onSuccess: (addedItems) => {
      queryClient.invalidateQueries({ queryKey: cartItemQueryKeys.all });
      toast.success(`Đã thêm ${addedItems.length} sản phẩm vào giỏ hàng!`);
      router.push("/cart");
    },
    onError: (error: any) => {
      console.error("Error adding to cart:", error);
      toast.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
    },
  });

  const handleAddToCart = () => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    if (componentCount === 0) {
      toast.warning("Vui lòng chọn ít nhất một linh kiện để thêm vào giỏ hàng");
      return;
    }

    addToCartMutation.mutate();
  };

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm sticky top-4">
      <div className="flex flex-col gap-4">
        <div>
          <h4 className="text-base font-semibold uppercase text-gray-900">Tóm tắt cấu hình</h4>
          <div className="mt-2 flex items-end justify-between gap-2">
            <div>
              <p className="text-sm text-gray-600">Tạm tính</p>
              <p className="mt-1 text-2xl font-bold text-primary">{formatCurrency(totalPrice)}</p>
            </div>
            <p className="text-sm text-gray-500">{componentCount} linh kiện đã chọn</p>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full rounded-full text-base text-white font-semibold"
          onClick={handleAddToCart}
          disabled={componentCount === 0 || addToCartMutation.isPending}
        >
          {addToCartMutation.isPending ? "Đang thêm vào giỏ..." : "Thêm cấu hình vào giỏ hàng"}
        </Button>

        <p className="text-xs text-gray-500">
          Giá chưa bao gồm phí lắp ráp. Vui lòng kiểm tra tương thích linh kiện trước khi thanh
          toán.
        </p>
      </div>
    </div>
  );
}
