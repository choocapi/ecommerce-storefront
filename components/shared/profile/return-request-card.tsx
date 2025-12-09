"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { IReturnRequest } from "@/types/return-request";
import {
  getReturnStatusBadgeClassName,
  getReturnStatusBadgeVariant,
  getReturnStatusLabel,
} from "@/types/return-request";
import { formatDate } from "@/utils";
import { FileText, Image as ImageIcon, Package } from "lucide-react";
import Image from "next/image";

interface ReturnRequestCardProps {
  returnRequest: IReturnRequest;
}

export default function ReturnRequestCard({ returnRequest }: ReturnRequestCardProps) {
  const parseImageUrls = (): string[] => {
    if (!returnRequest.imageUrls) return [];
    try {
      const parsed = JSON.parse(returnRequest.imageUrls);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const images = parseImageUrls();

  return (
    <Card className="p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-4">
        {/* Header: Request ID and Status */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Mã yêu cầu</p>
                <p className="text-base font-semibold text-gray-900">#{returnRequest.id}</p>
              </div>
            </div>
            <div className="ml-8 space-y-1">
              <p className="text-sm text-gray-500">
                Đơn hàng:{" "}
                <span className="font-medium text-gray-900">
                  #{returnRequest.orderId.slice(0, 8).toUpperCase()}
                </span>
              </p>
              {returnRequest.createdAt && (
                <p className="text-sm text-gray-500">
                  Tạo ngày: {formatDate(returnRequest.createdAt)}
                </p>
              )}
            </div>
          </div>
          <Badge
            variant={getReturnStatusBadgeVariant(returnRequest.status)}
            className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              getReturnStatusBadgeClassName(returnRequest.status),
            )}
          >
            {getReturnStatusLabel(returnRequest.status)}
          </Badge>
        </div>

        {/* Reason */}
        {returnRequest.reason && (
          <div className="pl-8 border-l-2 border-gray-100">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">Lý do trả hàng</p>
                <p className="text-sm text-gray-600 leading-relaxed">{returnRequest.reason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Images */}
        {images.length > 0 && (
          <div className="pl-8 border-l-2 border-gray-100">
            <div className="flex items-start gap-2">
              <ImageIcon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-2">Hình ảnh</p>
                <div className="flex gap-2 flex-wrap">
                  {images.slice(0, 3).map((url, index) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200"
                    >
                      <Image
                        src={url}
                        alt={`Hình ảnh ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {images.length > 3 && (
                    <div className="flex items-center justify-center w-20 h-20 rounded-md border border-gray-200 bg-gray-50">
                      <span className="text-xs text-gray-500">+{images.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Note */}
        {returnRequest.adminNote && (
          <div className="pl-8 border-l-2 border-gray-100">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">Ghi chú từ admin</p>
                <p className="text-sm text-gray-600 leading-relaxed">{returnRequest.adminNote}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
