"use client";

import InvalidImage from "@/components/common/invalid-image";
import { Button } from "@/components/ui/button";
import { cartItemQueryKeys, cartItemService } from "@/services/cartItemService";
import { ICartItem } from "@/types/cart";
import { getProductDiscountPercentage, getProductImageUrl } from "@/types/products";
import { formatCurrency } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

interface CartItemCardProps {
  item: ICartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const queryClient = useQueryClient();
  const product = item.product;
  const imageUrl = product ? getProductImageUrl(product) : undefined;
  const discountPercentage = product ? getProductDiscountPercentage(product) : 0;
  const hasDiscount = discountPercentage > 0 && product?.originalPrice;

  const updateMutation = useMutation({
    mutationFn: (quantity: number) => cartItemService.update(item.id, quantity),
    onSuccess: (updatedItem) => {
      // Update cache directly to preserve order instead of invalidating
      queryClient.setQueryData<ICartItem[]>(cartItemQueryKeys.list(), (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((cartItem) =>
          cartItem.id === item.id ? updatedItem : cartItem
        );
      });
      // Only invalidate summary to recalculate totals
      queryClient.invalidateQueries({ queryKey: cartItemQueryKeys.summary() });
    },
    onError: (error: any) => {
      toast.error("Cập nhật số lượng thất bại!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => cartItemService.delete(item.id),
    onSuccess: () => {
      // Remove item from cache directly to preserve order of remaining items
      queryClient.setQueryData<ICartItem[]>(cartItemQueryKeys.list(), (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter((cartItem) => cartItem.id !== item.id);
      });
      // Invalidate summary to recalculate totals
      queryClient.invalidateQueries({ queryKey: cartItemQueryKeys.summary() });
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    },
    onError: (error: any) => {
      toast.error("Xóa sản phẩm thất bại!");
    },
  });

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    updateMutation.mutate(newQuantity);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      handleQuantityChange(item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    handleQuantityChange(item.quantity + 1);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  if (!product) {
    return null;
  }

  const itemPrice = product.price * item.quantity;
  const itemOriginalPrice = product.originalPrice ? product.originalPrice * item.quantity : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex gap-4">
        {/* Product Image */}
        <Link
          href={`/products/${product.slug}`}
          className="relative shrink-0 w-24 h-24 rounded-md overflow-hidden border border-gray-200"
        >
          {imageUrl ? (
            <Image src={imageUrl} alt={product.name} fill className="object-cover" sizes="96px" />
          ) : (
            <InvalidImage />
          )}
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          {/* Product Name */}
          <Link
            href={`/products/${product.slug}`}
            className="block mb-2 hover:text-primary transition-colors"
          >
            <h3 className="text-gray-900 font-semibold text-base line-clamp-2">{product.name}</h3>
          </Link>

          {/* Product Specs/Variant */}
          {product.sku && (
            <div className="mb-3">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                {product.sku}
              </span>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecrease}
              disabled={updateMutation.isPending || item.quantity <= 1}
              className="h-8 w-8 p-0 rounded-full border-gray-200"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <input
              value={item.quantity}
              readOnly
              min="1"
              className="size-8 text-center text-sm font-medium border border-gray-200 rounded-md py-1 focus:outline-none focus:ring-2 focus:ring-primary/80"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleIncrease}
              disabled={updateMutation.isPending}
              className="h-8 w-8 p-0 rounded-full border-gray-200"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Price & Delete Button RIGHT aligned, Discounted price on top, Original price under, then delete button below */}
        <div className="flex flex-col items-end justify-between ml-auto">
          {/* Price */}
          <div className="flex flex-col items-end">
            <span className="text-primary font-bold text-base">{formatCurrency(itemPrice)}</span>
            {hasDiscount && itemOriginalPrice && (
              <span className="text-gray-400 line-through text-sm mt-1">
                {formatCurrency(itemOriginalPrice)}
              </span>
            )}
          </div>
          {/* Delete Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="shrink-0 size-8 p-0 rounded-full hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
