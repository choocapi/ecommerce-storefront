"use client";

import { PCBuilderCategoryRow } from "@/components/shared/pc-builder/pc-builder-category-row";
import { PCBuilderSelectModal } from "@/components/shared/pc-builder/pc-builder-select-modal";
import { PCBuilderSummary } from "@/components/shared/pc-builder/pc-builder-summary";
import { Button } from "@/components/ui/button";
import { PC_BUILDER_CATEGORIES } from "@/constants/pc-builder";
import { cn } from "@/lib/utils";
import { usePCBuilderStore } from "@/stores/usePCBuilderStore";
import type { IProduct } from "@/types/products";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface SelectedCategoryState {
  slug: string;
  name: string;
}

export default function PCBuilderPage() {
  const clearConfig = usePCBuilderStore((state) => state.clearConfig);
  const addComponent = usePCBuilderStore((state) => state.addComponent);
  const components = usePCBuilderStore((state) => state.components);
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<SelectedCategoryState | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectCategory = (slug: string, name: string) => {
    setSelectedCategory({ slug, name });
    setIsModalOpen(true);
  };

  const handleProductSelect = (product: IProduct) => {
    if (!selectedCategory) return;
    addComponent(selectedCategory.slug, product, 1);
    toast.success(`Đã chọn "${product.name}" cho ${selectedCategory.name}`);
  };

  const handleReset = () => {
    clearConfig();
    toast.success("Đã xóa cấu hình hiện tại");
  };

  const handleExportQuote = () => {
    const componentCount = Object.keys(components).length;
    if (componentCount === 0) {
      toast.warning("Vui lòng chọn ít nhất một linh kiện trước khi xuất báo giá");
      return;
    }
    router.push("/pc-builder/quote");
  };

  return (
    <div className={cn("container mx-auto px-2 md:px-3 lg:px-4 py-8")}>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Xây dựng cấu hình PC</h1>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-sm"
            onClick={handleReset}
          >
            <RotateCcw className="size-4" />
            Chọn lại từ đầu
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-sm"
            onClick={handleExportQuote}
          >
            Xem báo giá
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          {PC_BUILDER_CATEGORIES.map((category) => (
            <PCBuilderCategoryRow
              key={category.slug}
              category={category}
              onSelect={() => handleSelectCategory(category.slug, category.name)}
            />
          ))}
        </div>

        <div className="self-start">
          <PCBuilderSummary />
        </div>
      </div>

      {selectedCategory && (
        <PCBuilderSelectModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          categorySlug={selectedCategory.slug}
          categoryName={selectedCategory.name}
          onSelect={handleProductSelect}
        />
      )}
    </div>
  );
}
