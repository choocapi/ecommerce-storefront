"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { IProduct } from "@/types/products";
import { PCBuilderProductPicker } from "./pc-builder-product-picker";

interface PCBuilderSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categorySlug: string;
  categoryName: string;
  onSelect: (product: IProduct) => void;
}

export function PCBuilderSelectModal({
  open,
  onOpenChange,
  categorySlug,
  categoryName,
  onSelect,
}: PCBuilderSelectModalProps) {
  const handleSelect = (product: IProduct) => {
    onSelect(product);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl rounded-2xl p-4 md:p-6 max-h-[85vh] overflow-hidden">
        <DialogTitle className="sr-only">Chọn {categoryName}</DialogTitle>
        <PCBuilderProductPicker
          categorySlug={categorySlug}
          onSelect={handleSelect}
          className="mt-2"
        />
      </DialogContent>
    </Dialog>
  );
}
