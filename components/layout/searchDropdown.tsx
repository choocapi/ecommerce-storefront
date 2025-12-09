"use client";

import HProductCard from "@/components/shared/product/h-product-card";
import { productQueries } from "@/services/productService";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import Loader from "../common/loader";

interface SearchDropdownProps {
  isOpen: boolean;
  searchQuery: string;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export default function SearchDropdown({
  isOpen,
  searchQuery,
  onClose,
  inputRef,
}: SearchDropdownProps) {
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search query
  useEffect(() => {
    if (!isOpen) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms debounce delay

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, isOpen]);

  // Sử dụng React Query với debounced query
  const { data, isLoading: isSearching } = useQuery({
    ...productQueries.list({ search: debouncedQuery }),
    enabled: !!debouncedQuery.trim() && isOpen,
  });

  const searchResults = data?.content || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
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
  }, [isOpen, onClose, inputRef]);

  if (!isOpen) return null;

  const showContent = debouncedQuery.trim() || searchResults.length > 0;

  if (!showContent) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-[600px] overflow-y-auto z-50"
    >
      {isSearching ? (
        <div className="p-8 text-center text-gray-500">
          <Loader className="inline-block" />
          <p className="mt-2 text-sm">Đang tìm kiếm...</p>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="p-2 flex flex-col gap-2">
          {searchResults.map((product) => (
            <HProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : debouncedQuery.trim() ? (
        <div className="p-8 text-center text-gray-500">
          <p className="text-sm">Không tìm thấy sản phẩm nào</p>
        </div>
      ) : null}
    </div>
  );
}
