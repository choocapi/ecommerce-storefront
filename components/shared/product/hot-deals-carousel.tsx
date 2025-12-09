"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/types/products";
import ProductCard from "./product-card";

interface HotDealsCarouselProps {
  products: IProduct[];
  className?: string;
}

export default function HotDealsCarousel({ products, className }: HotDealsCarouselProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden",
        "bg-gradient-to-br from-rose-300/80 via-rose-300/50 to-rose-300/70",
        className,
      )}
    >
      {/* Content */}
      <div className="relative p-6 md:p-8">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 text-gray-900 bg-white/90 hover:bg-white border-none" />
          <CarouselNext className="-right-4 text-gray-900 bg-white/90 hover:bg-white border-none" />
        </Carousel>
      </div>
    </div>
  );
}
