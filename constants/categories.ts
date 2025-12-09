export const FEATURED_CATEGORIES = [
  { name: "Bàn phím", slug: "ban-phim" },
  { name: "Case", slug: "case" },
  { name: "Chuột", slug: "chuot" },
  { name: "CPU", slug: "cpu" },
  { name: "Laptop", slug: "laptop" },
  { name: "Mainboard", slug: "mainboard" },
  { name: "Màn hình", slug: "man-hinh" },
  { name: "Ổ cứng", slug: "o-cung" },
  { name: "Phụ kiện", slug: "phu-kien" },
  { name: "Nguồn", slug: "psu" },
  { name: "RAM", slug: "ram" },
  { name: "Tai nghe", slug: "tai-nghe" },
  { name: "Tản nhiệt", slug: "tan-nhiet" },
  { name: "Card màn hình", slug: "card-man-hinh" },
] as const;

export const PRODUCT_CATEGORIES = [
  { name: "Laptop", slug: "laptop" },
  { name: "VGA", slug: "card-man-hinh" },
  { name: "CPU", slug: "cpu" },
  { name: "Ram", slug: "ram" },
] as const;

// Group categories for dropdown left column (1-2 categories per item)
export const GROUPED_CATEGORIES = [
  [FEATURED_CATEGORIES[4]], // Laptop
  [FEATURED_CATEGORIES[0], FEATURED_CATEGORIES[2]], // Bàn phím, Chuột
  [FEATURED_CATEGORIES[1], FEATURED_CATEGORIES[5]], // Case, Mainboard
  [FEATURED_CATEGORIES[3], FEATURED_CATEGORIES[10]], // CPU, RAM
  [FEATURED_CATEGORIES[6], FEATURED_CATEGORIES[13]], // Màn hình, Card màn hình
  [FEATURED_CATEGORIES[7], FEATURED_CATEGORIES[9]], // Ổ cứng, Nguồn
  [FEATURED_CATEGORIES[8], FEATURED_CATEGORIES[12]], // Phụ kiện, Tản nhiệt
  [FEATURED_CATEGORIES[11]], // Tai nghe
] as const;
