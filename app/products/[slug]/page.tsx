"use client";

import { HeadingBreadcrumb } from "@/components/shared/heading-breadcrumb";
import { BrandHighlight } from "@/components/shared/product/brand-highlight";
import HProductCard from "@/components/shared/product/h-product-card";
import ProductDescription from "@/components/shared/product/product-description";
import ProductImages from "@/components/shared/product/product-images";
import ProductPricing from "@/components/shared/product/product-pricing";
import ProductReviews from "@/components/shared/product/product-reviews";
import ProductServiceInfo from "@/components/shared/product/product-service-info";
import ProductSpecifications from "@/components/shared/product/product-specifications";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { Skeleton } from "@/components/ui/skeleton";
import { productQueries } from "@/services/productService";
import { formatNumber } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: product, isLoading, error } = useQuery(productQueries.bySlug(slug));

  // Fetch similar products (same category or brand)
  const { data: similarProductsData, isLoading: isLoadingSimilar } = useQuery(
    productQueries.byCategory({ slug: product?.category?.slug || "", page: 0, size: 5 }),
  );

  const similarProducts = similarProductsData?.content || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="w-full aspect-square rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm</p>
        </div>
      </div>
    );
  }

  const rating = product.averageRating || 0;
  const reviewCount = product.reviewCount || 0;
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    product.category
      ? { label: product.category.name, href: `/${product.category.slug}` }
      : undefined,
    { label: product.name },
  ].filter(Boolean) as { label: string; href?: string }[];

  return (
    <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
      <HeadingBreadcrumb items={breadcrumbItems} />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] gap-6 items-start">
        {/* Left Column - Images, Description, Reviews */}
        <div className="space-y-6">
          {/* Product Images */}
          <ProductImages product={product} />

          {/* Service Info */}
          <ProductServiceInfo />

          {/* Specifications */}
          {product.specifications && <ProductSpecifications product={product} />}

          {/* Description */}
          {product.description && <ProductDescription product={product} />}

          {/* Reviews */}
          <ProductReviews product={product} />
        </div>

        {/* Right Column - Product Info, Brand, Similar Products */}
        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <h2 className="text-gray-900 font-bold text-2xl md:text-2xl mb-2">{product.name}</h2>
            {product.sku && <p className="text-gray-500 text-sm">SKU: {product.sku}</p>}
          </div>

          {/* Rating */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <Rating value={Math.round(rating)} readOnly className="text-yellow-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <RatingButton key={index} size={20} />
                ))}
              </Rating>
              <span className="text-gray-600 text-sm">
                {rating > 0 ? rating.toFixed(1) : "0.0"} ({formatNumber(reviewCount)} đánh giá)
              </span>
            </div>
          )}

          {/* Pricing & Actions */}
          <ProductPricing product={product} />

          {/* Brand description */}
          {product.brand && <BrandHighlight brand={product.brand} />}

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div>
              <h2 className="text-gray-900 font-bold text-xl mb-4">Sản phẩm tương tự</h2>
              {isLoadingSimilar ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {similarProducts.map((similarProduct) => (
                    <HProductCard key={similarProduct.id} product={similarProduct} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
