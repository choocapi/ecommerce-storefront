"use client";

import Loader from "@/components/common/loader";
import HProductCard from "@/components/shared/product/h-product-card";
import { GROUPED_CATEGORIES } from "@/constants/categories";
import { cn } from "@/lib/utils";
import { categoryQueries } from "@/services/categoryService";
import { productQueries } from "@/services/productService";
import { ICategory, IProduct } from "@/types/products";
import { IconArrowRight } from "@tabler/icons-react";
import { useQueries, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

interface CategoryDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

export default function CategoryDropdown({ isOpen, onClose, triggerRef }: CategoryDropdownProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch all categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    ...categoryQueries.listAll(),
    enabled: isOpen,
  });

  const categories = categoriesData || [];

  // Build parent-child structure
  const categoryTree = useMemo(() => {
    const tree: Record<number, ICategory[]> = {};
    const rootCategories: ICategory[] = [];

    categories.forEach((category) => {
      if (!category.parentId) {
        rootCategories.push(category);
      } else {
        if (!tree[category.parentId]) {
          tree[category.parentId] = [];
        }
        tree[category.parentId].push(category);
      }
    });

    return { tree, rootCategories };
  }, [categories]);

  // Get selected group and categories in the group
  const selectedGroup = useMemo(() => {
    if (!selectedCategorySlug) return null;
    return GROUPED_CATEGORIES.find((group) =>
      group.some((cat) => cat.slug === selectedCategorySlug),
    );
  }, [selectedCategorySlug]);

  // Get categories data for the selected group
  const selectedGroupCategories = useMemo(() => {
    if (!selectedGroup) return [];
    return selectedGroup
      .map((groupItem) => categories.find((cat) => cat.slug === groupItem.slug))
      .filter((cat): cat is ICategory => cat !== undefined);
  }, [selectedGroup, categories]);

  // Get children for each category in the group
  const groupCategoriesWithChildren = useMemo(() => {
    return selectedGroupCategories.map((category) => ({
      category,
      children: categoryTree.tree[category.id] || [],
    }));
  }, [selectedGroupCategories, categoryTree]);

  // Get all category slugs from the selected group
  const selectedGroupSlugs = useMemo(() => {
    if (!selectedGroup) return [];
    return selectedGroup.map((cat) => cat.slug);
  }, [selectedGroup]);

  // Fetch products for all categories in the group
  const productsQueries = useQueries({
    queries: selectedGroupSlugs.map((slug) => ({
      ...productQueries.byCategory({ slug, page: 0, size: 4 }), // Fetch more to have enough products
      enabled: isOpen && !!slug,
    })),
  });

  // Merge and deduplicate products from all categories in the group
  const products = useMemo(() => {
    const allProducts: IProduct[] = [];
    const productIds = new Set<number>();

    productsQueries.forEach((query) => {
      if (query.data?.content) {
        query.data.content.forEach((product) => {
          if (!productIds.has(product.id)) {
            productIds.add(product.id);
            allProducts.push(product);
          }
        });
      }
    });

    return allProducts;
  }, [productsQueries]);

  const isLoadingProducts = productsQueries.some((query) => query.isLoading);

  // Set first category as default when dropdown opens
  useEffect(() => {
    if (isOpen && !selectedCategorySlug && GROUPED_CATEGORIES.length > 0 && categories.length > 0) {
      const firstGroup = GROUPED_CATEGORIES[0];
      if (firstGroup.length > 0) {
        // Try to find the category in the API data, otherwise use the slug from constants
        const foundCategory = categories.find((cat) => cat.slug === firstGroup[0].slug);
        if (foundCategory || firstGroup[0].slug) {
          setSelectedCategorySlug(firstGroup[0].slug);
        }
      }
    }
  }, [isOpen, selectedCategorySlug, categories]);

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
      className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] max-w-[1200px] bg-white rounded-xl shadow-lg border border-gray-200 z-50"
    >
      <div className="flex max-w-full max-h-[500px]">
        {/* Left Column - Grouped Categories */}
        <div className="w-60 border-r border-gray-200 p-2 overflow-y-auto max-h-[500px]">
          {GROUPED_CATEGORIES.map((group, groupIndex) => {
            // Check if any category in the group is selected
            const isGroupSelected = group.some(
              (categoryItem) => selectedCategorySlug === categoryItem.slug,
            );
            // Get the first category in the group as the default selection
            const firstCategory = group[0];

            return (
              <button
                key={groupIndex}
                onClick={() => setSelectedCategorySlug(firstCategory.slug)}
                className={cn(
                  "w-full text-left px-4 py-2 rounded-md text-base font-semibold text-gray-900 hover:bg-gray-100 hover:text-primary transition-colors",
                  isGroupSelected && "bg-gray-100",
                )}
              >
                {group.length === 1 ? (
                  <span>{firstCategory.name}</span>
                ) : (
                  <span>{group.map((cat) => cat.name).join(", ")}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Center Column - Parent-Child Categories */}
        <div className="flex-1 border-r border-gray-200 overflow-y-auto max-h-[500px] p-6">
          {isLoadingCategories ? (
            <div className="flex justify-center h-full">
              <Loader className="inline-block" />
            </div>
          ) : (
            selectedGroup && (
              <div className="space-y-8 grid grid-cols-2 gap-4">
                {groupCategoriesWithChildren.map(({ category, children }) => (
                  <div key={category.id} className="space-y-4">
                    {/* Category Heading */}
                    <Link
                      href={`/${category.slug}`}
                      onClick={onClose}
                      className="text-gray-900 font-bold text-xl flex items-center gap-2 hover:underline"
                    >
                      {category.name} <IconArrowRight className="size-6" />
                    </Link>

                    <div>
                      {children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/${child.slug}`}
                          onClick={onClose}
                          className="flex items-center py-2 rounded-lg transition-colors group hover:underline"
                        >
                          <span className="text-gray-900 text-sm font-normal">{child.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Right Column - Products */}
        <div className="w-100 overflow-y-auto max-h-[500px] p-6">
          <h3 className="text-gray-900 font-bold text-xl mb-4">Sản phẩm</h3>
          {isLoadingProducts ? (
            <div className="flex justify-center h-full">
              <Loader className="inline-block" />
            </div>
          ) : products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product) => (
                <HProductCard
                  key={product.id}
                  showOriginalPrice={false}
                  product={product}
                  className="h-24 w-full"
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-sm py-8">Không có sản phẩm nào</div>
          )}
        </div>
      </div>
    </div>
  );
}
