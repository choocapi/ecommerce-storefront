import type { OrderStatus, PaymentMethod, PaymentStatus } from "./enums";
import { IProduct } from "./products";
import { IUser } from "./user";

export interface IOrder {
  id: string; // UUID
  userId?: string; // UUID
  user?: IUser;
  status: OrderStatus;
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  shippingWard?: string;
  shippingDistrict?: string;
  shippingCity?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  vnPayOrderId?: string; // VNPay transaction reference
  subtotal?: number;
  discountAmount?: number;
  totalAmount?: number;
  couponCode?: string;
  orderedAt?: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  items?: IOrderItem[];
}

export interface IOrderItem {
  id: number;
  orderId?: string; // UUID
  order?: IOrder;
  productId?: number;
  product?: IProduct;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Chờ duyệt",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đang giao",
  DELIVERED: "Đã giao",
  RETURNED: "Đã trả hàng",
  CANCELLED: "Đã hủy",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  COD: "COD",
  MOMO: "MOMO",
  VNPAY: "VNPay",
  ZALOPAY: "ZaloPay",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  CANCELLED: "Đã hủy",
  REFUNDED: "Đã hoàn trả",
  FAILED: "Thất bại",
};

export const getOrderStatusLabel = (status: string): string => {
  return ORDER_STATUS_LABELS[status as OrderStatus] || status || "Unknown";
};

export const getPaymentMethodLabel = (method: string): string => {
  return PAYMENT_METHOD_LABELS[method as PaymentMethod] || method || "Unknown";
};

export const getPaymentStatusLabel = (status: string): string => {
  return PAYMENT_STATUS_LABELS[status as PaymentStatus] || status || "Unknown";
};

export const getStatusBadgeVariant = (
  status: string,
): "default" | "destructive" | "outline" | "secondary" => {
  switch (status) {
    case "PENDING":
      return "outline";
    case "PROCESSING":
      return "default";
    case "SHIPPED":
      return "default";
    case "DELIVERED":
      return "default";
    case "CANCELLED":
      return "destructive";
    case "RETURNED":
      return "outline";
    default:
      return "outline";
  }
};

export const getStatusBadgeClassName = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "border-yellow-500 text-yellow-700 bg-yellow-50";
    case "PROCESSING":
      return "border-blue-500 text-blue-700 bg-blue-50";
    case "SHIPPED":
      return "border-orange-500 text-orange-700 bg-orange-50";
    case "DELIVERED":
      return "border-green-500 text-green-700 bg-green-50";
    case "CANCELLED":
      return "border-red-500 text-red-700 bg-red-50";
    case "RETURNED":
      return "border-gray-500 text-gray-700 bg-gray-50";
    default:
      return "";
  }
};
