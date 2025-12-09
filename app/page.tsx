"use client";

import ArticleTabs from "@/components/shared/article/article-tabs";
import Banners from "@/components/shared/banners";
import FeaturedCategories from "@/components/shared/category/featured-categories";
import HotDeals from "@/components/shared/product/hot-deals";
import ProductTabs from "@/components/shared/product/product-tabs";
import { ARTICLE_CATEGORIES } from "@/constants/articles";
import { FEATURED_CATEGORIES, PRODUCT_CATEGORIES } from "@/constants/categories";

export default function HomePage() {
  return (
    <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
      {/* Banners Section */}
      <Banners />

      {/* Hot Deals Section */}
      <HotDeals />

      {/* Products Section */}
      <div className="mb-16">
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-gray-900 font-bold text-4xl">
            <span className="text-primary">Gợi ý</span> cho bạn
          </h2>
        </div>
        <ProductTabs categories={PRODUCT_CATEGORIES} />
      </div>

      {/* Featured Categories Section */}
      <div className="mb-16">
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-gray-900 font-bold text-4xl">
            <span className="text-primary">Danh mục</span> nổi bật
          </h2>
        </div>
        <FeaturedCategories categories={FEATURED_CATEGORIES} />
      </div>

      {/* Articles Section */}
      <div>
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-gray-900 font-bold text-4xl">
            <span className="text-primary">Tin tức</span> công nghệ
          </h2>
        </div>
        <ArticleTabs categories={ARTICLE_CATEGORIES} />
      </div>
    </div>
  );
}
