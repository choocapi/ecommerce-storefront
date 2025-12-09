"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { bannerQueries } from "@/services/bannerService";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function Banners() {
  // Sử dụng React Query - tự động cache!
  const { data: allBanners, isLoading } = useQuery(bannerQueries.listAll());
  const [api, setApi] = useState<CarouselApi>();

  // Filter chỉ lấy banners active
  const banners = useMemo(() => {
    if (!allBanners) return [];
    return allBanners.filter((banner) => banner.isActive);
  }, [allBanners]);

  // Autoplay: tự động chuyển slide
  useEffect(() => {
    if (!api || banners.length <= 1) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 10000);

    return () => clearInterval(interval);
  }, [api, banners.length]);

  if (isLoading) {
    return null;
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-16 rounded-xl overflow-hidden">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="p-0">
              {banner.linkUrl ? (
                <Link href={banner.linkUrl} className="block w-full">
                  <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden bg-gray-900">
                    {banner.imageUrl ? (
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title || "Banner"}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden bg-gray-900">
                  {banner.imageUrl ? (
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title || "Banner"}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                </div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        {banners.length > 1 && (
          <>
            <CarouselPrevious className="left-4 bg-black/60 hover:bg-black/55 border-none hover:text-white text-white" />
            <CarouselNext className="right-4 bg-black/60 hover:bg-black/55 border-none hover:text-white text-white" />
          </>
        )}
      </Carousel>
    </div>
  );
}
