import { FEATURED_CATEGORIES } from "./categories";

// Danh mục được phép dùng trong PC Builder
// Loại bỏ: Laptop, Phụ kiện, Tai nghe và các danh mục không trực tiếp là linh kiện build
const ALLOWED_PC_BUILDER_SLUGS = [
  "cpu",
  "mainboard",
  "card-man-hinh",
  "ram",
  "o-cung",
  "psu",
  "case",
  "tan-nhiet",
  "man-hinh",
] as const;

export const PC_BUILDER_CATEGORIES = FEATURED_CATEGORIES.filter((category) =>
  ALLOWED_PC_BUILDER_SLUGS.includes(category.slug as (typeof ALLOWED_PC_BUILDER_SLUGS)[number]),
);

export type PCBuilderCategory = (typeof PC_BUILDER_CATEGORIES)[number];


