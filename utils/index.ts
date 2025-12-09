import { IOrder } from "@/types/order";
import { IUser } from "@/types/user";

export const formatDateTime = (dateString?: string) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatNumber = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount);
};

export const getUserFullName = (user: IUser | undefined) => {
  if (!user) return "N/A";
  return `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
};

export const getShippingAddress = (order: IOrder | undefined) => {
  if (!order) return "N/A";
  return `${order?.shippingAddress}, ${order?.shippingWard}, ${order?.shippingDistrict}, ${order?.shippingCity}`;
};

export const formatOrderCode = (orderId?: string) => {
  return `#${orderId?.slice(0, 8).toUpperCase() || ""}`;
};

export { calculateDiscountedPrice, deriveDiscountPercentage } from "./pricingUtils";
