"use client";

import InvalidImage from "@/components/common/invalid-image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ICartItem } from "@/types/cart";
import { getProductImageUrl } from "@/types/products";
import { formatCurrency } from "@/utils";
import Image from "next/image";

interface CheckoutProductsListProps {
  cartItems: ICartItem[];
  defaultOpen?: boolean;
}

export default function CheckoutProductsList({
  cartItems,
  defaultOpen = false,
}: CheckoutProductsListProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultOpen ? "products" : undefined}
        className="w-full"
      >
        <AccordionItem value="products" className="border-0">
          <AccordionTrigger className="p-6 hover:bg-gray-50 transition-colors rounded-xl hover:no-underline">
            <h2 className="text-gray-900 font-bold text-xl">
              Sản phẩm trong đơn ({cartItems.length})
            </h2>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-6 pb-6 space-y-4">
              {cartItems.map((item) => {
                const product = item.product;
                if (!product) return null;

                const imageUrl = getProductImageUrl(product);
                const itemPrice = product.price * item.quantity;

                // Format product variant info
                const variantInfo = [product.sku, product.category?.name]
                  .filter(Boolean)
                  .join(" / ");

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-gray-100 last:border-0"
                  >
                    {/* Product Image */}
                    <div className="relative shrink-0 w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <InvalidImage />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      {variantInfo && <p className="text-xs text-gray-500 mb-2">{variantInfo}</p>}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Số lượng: x{item.quantity}</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(itemPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
