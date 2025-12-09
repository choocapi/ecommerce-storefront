"use client";

import InvalidImage from "@/components/common/invalid-image";
import { usePCBuilderStore } from "@/stores/usePCBuilderStore";
import { getProductImageUrl } from "@/types/products";
import { formatCurrency } from "@/utils";
import Image from "next/image";

export function PCBuilderQuoteView() {
  const components = usePCBuilderStore((state) => state.components);
  const getTotalPrice = usePCBuilderStore((state) => state.getTotalPrice);

  const entries = Object.entries(components);
  const totalPrice = getTotalPrice();

  return (
    <div className="w-[960px] bg-white text-gray-900 rounded-2xl shadow-xl p-6 font-sans">
      <header className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="ACB Computer"
            width={100}
            height={100}
            className="h-10 w-auto"
          />
          <h2 className="text-xl font-semibold text-gray-900">Báo giá cấu hình PC</h2>
        </div>
        <div className="text-right text-xs text-gray-500">
          <p>Ngày tạo: {new Date().toLocaleDateString("vi-VN")}</p>
        </div>
      </header>

      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-2 px-3 text-left font-medium text-gray-700 rounded-l-lg">
              Linh kiện
            </th>
            <th className="py-2 px-3 text-left font-medium text-gray-700">Sản phẩm</th>
            <th className="py-2 px-3 text-center font-medium text-gray-700">Số lượng</th>
            <th className="py-2 px-3 text-right font-medium text-gray-700 rounded-r-lg">
              Thành tiền
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([slug, component]) => {
            const imageUrl = getProductImageUrl(component.product);
            return (
              <tr key={slug} className="border-b border-gray-100 last:border-0">
                <td className="py-3 px-3 align-top text-sm font-medium text-gray-800">
                  {component.product.category?.name || slug}
                </td>
                <td className="py-3 px-3 align-top">
                  <div className="flex items-start gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={component.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <InvalidImage />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{component.product.name}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Đơn giá: {formatCurrency(component.product.price)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 align-top text-center text-sm text-gray-800">
                  {component.quantity}
                </td>
                <td className="py-3 px-3 align-top text-right text-sm font-semibold text-gray-900">
                  {formatCurrency(component.product.price * component.quantity)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <footer className="mt-4 border-t border-gray-200 pt-4 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Giá trên chỉ mang tính tham khảo tại thời điểm xuất báo giá và có thể thay đổi mà không
          cần báo trước.
        </p>
        <div className="text-right">
          <p className="text-xs text-gray-600">Tổng cộng</p>
          <p className="text-xl font-bold text-primary">{formatCurrency(totalPrice)}</p>
        </div>
      </footer>
    </div>
  );
}
