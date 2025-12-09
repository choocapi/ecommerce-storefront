import type { ReturnStatus } from "./enums";
import type { IUser } from "./user";

export interface IReturnRequest {
  id: number;
  orderId: string;
  userId: string;
  user?: IUser;
  reason: string;
  imageUrls?: string; // JSON string array: ["url1", "url2", ...]
  status: ReturnStatus;
  adminNote?: string;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  completedAt?: string;
}

export const RETURN_STATUS_LABELS: Record<ReturnStatus, string> = {
  PENDING: "Chờ xử lý",
  APPROVED: "Đã chấp nhận",
  REJECTED: "Đã từ chối",
  COMPLETED: "Đã hoàn tất",
};

export const RETURN_STATUS_COLORS: Record<ReturnStatus, string> = {
  PENDING: "yellow",
  APPROVED: "blue",
  REJECTED: "red",
  COMPLETED: "green",
};

export const getReturnStatusLabel = (status: string): string => {
  return RETURN_STATUS_LABELS[status as ReturnStatus] || status || "Không xác định";
};

export const getReturnStatusColor = (status: string): string => {
  return RETURN_STATUS_COLORS[status as ReturnStatus] || "gray";
};

export const getReturnStatusBadgeVariant = (
  status: string,
): "default" | "destructive" | "outline" | "secondary" => {
  switch (status) {
    case "PENDING":
      return "outline";
    case "APPROVED":
      return "default";
    case "REJECTED":
      return "destructive";
    case "COMPLETED":
      return "default";
    default:
      return "outline";
  }
};

export const getReturnStatusBadgeClassName = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "border-yellow-500 text-yellow-700 bg-yellow-50";
    case "APPROVED":
      return "border-blue-500 text-blue-700 bg-blue-50";
    case "REJECTED":
      return "border-red-500 text-red-700 bg-red-50";
    case "COMPLETED":
      return "border-green-500 text-green-700 bg-green-50";
    default:
      return "";
  }
};
