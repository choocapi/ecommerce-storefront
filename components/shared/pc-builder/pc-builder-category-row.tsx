"use client";

import InvalidImage from "@/components/common/invalid-image";
import { Button } from "@/components/ui/button";
import type { PCBuilderCategory } from "@/constants/pc-builder";
import { cn } from "@/lib/utils";
import { usePCBuilderStore } from "@/stores/usePCBuilderStore";
import { getProductImageUrl } from "@/types/products";
import { formatCurrency } from "@/utils";
import Image from "next/image";

interface PCBuilderCategoryRowProps {
  category: PCBuilderCategory;
  onSelect: () => void;
  className?: string;
}

export function PCBuilderCategoryRow({ category, onSelect, className }: PCBuilderCategoryRowProps) {
  const component = usePCBuilderStore((state) => state.getComponent(category.slug));
  const removeComponent = usePCBuilderStore((state) => state.removeComponent);
  const updateQuantity = usePCBuilderStore((state) => state.updateQuantity);

  const handleRemove = () => {
    removeComponent(category.slug);
  };

  const handleDecrease = () => {
    if (!component) return;
    updateQuantity(category.slug, Math.max(1, component.quantity - 1));
  };

  const handleIncrease = () => {
    if (!component) return;
    updateQuantity(category.slug, component.quantity + 1);
  };

  const imageUrl = component ? getProductImageUrl(component.product) : null;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-2xl bg-white border border-gray-200 px-3 py-3 md:px-4 md:py-4 shadow-sm",
        className,
      )}
    >
      <div className="flex flex-1 items-center gap-3 md:gap-4 min-w-0">
        <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-gray-100 flex-shrink-0">
          {component && imageUrl ? (
            <Image src={imageUrl} alt={component.product.name} fill className="object-cover" />
          ) : (
            <InvalidImage />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{category.name}</p>
          {component ? (
            <>
              <p className="text-sm text-gray-700 truncate">{component.product.name}</p>
              <div className="flex items-center gap-3 text-sm text-gray-900">
                <span className="font-semibold text-primary">
                  {formatCurrency(component.product.price * component.quantity)}
                </span>
                <span className="text-xs text-gray-500">
                  ({formatCurrency(component.product.price)} x {component.quantity})
                </span>
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-500">
              Chưa chọn {category.name}. Hãy chọn linh kiện phù hợp cho cấu hình của bạn.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        {component && (
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-2 py-1">
            <button
              type="button"
              onClick={handleDecrease}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm border border-gray-200 text-sm"
            >
              -
            </button>
            <span className="min-w-[24px] text-center text-sm font-medium text-gray-900">
              {component.quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrease}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm border border-gray-200 text-sm"
            >
              +
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {component && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs md:text-sm px-3"
              onClick={handleRemove}
            >
              Xóa
            </Button>
          )}
          <Button
            size="sm"
            className="rounded-full text-sm font-semibold text-white px-4"
            variant="default"
            onClick={onSelect}
          >
            {component ? "Thay đổi" : "Chọn"}
          </Button>
        </div>
      </div>
    </div>
  );
}
