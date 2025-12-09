"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { IOrder } from "@/types/order";
import {
  getOrderStatusLabel,
  getPaymentMethodLabel,
  getPaymentStatusLabel,
  getStatusBadgeClassName,
  getStatusBadgeVariant,
} from "@/types/order";
import { formatCurrency, formatDate } from "@/utils";
import { ArrowRight, MapPin, Package, Phone } from "lucide-react";
import Link from "next/link";

interface OrderCardProps {
  order: IOrder;
}

export default function OrderCard({ order }: OrderCardProps) {
  const formatAddress = () => {
    const parts = [
      order.shippingAddress,
      order.shippingWard,
      order.shippingDistrict,
      order.shippingCity,
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <Card className="p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-4">
        {/* Header: Order ID and Status */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Mã đơn hàng</p>
                <p className="text-base font-semibold text-gray-900">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
            {order.orderedAt && (
              <p className="text-sm text-gray-500 ml-8">Đặt ngày: {formatDate(order.orderedAt)}</p>
            )}
          </div>
          <Badge
            variant={getStatusBadgeVariant(order.status)}
            className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              getStatusBadgeClassName(order.status),
            )}
          >
            {getOrderStatusLabel(order.status)}
          </Badge>
        </div>

        {/* Shipping Info */}
        <div className="space-y-2 pl-8 border-l-2 border-gray-100">
          {order.shippingName && (
            <div className="flex items-start gap-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Người nhận:</span> {order.shippingName}
              </p>
            </div>
          )}
          {order.shippingPhone && (
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-600">{order.shippingPhone}</p>
            </div>
          )}
          {formatAddress() && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-600 leading-relaxed">{formatAddress()}</p>
            </div>
          )}
        </div>

        {/* Payment Info */}
        <div className="flex items-center gap-4 text-sm pl-8">
          {order.paymentMethod && (
            <div>
              <span className="text-gray-500">Phương thức:</span>{" "}
              <span className="text-gray-900 font-medium">
                {getPaymentMethodLabel(order.paymentMethod)}
              </span>
            </div>
          )}
          {order.paymentStatus && (
            <div>
              <span className="text-gray-500">Trạng thái:</span>{" "}
              <span className="text-gray-900 font-medium">
                {getPaymentStatusLabel(order.paymentStatus)}
              </span>
            </div>
          )}
        </div>

        {/* Items Count and Total */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-sm text-gray-500">{order.items?.length || 0} sản phẩm</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Tổng tiền</p>
            <p className="text-lg font-bold text-primary">
              {formatCurrency(order.totalAmount || 0)}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <Button
            asChild
            variant="outline"
            className="border-gray-200 font-semibold text-gray-900 hover:bg-gray-50 rounded-full px-4"
          >
            <Link href={`/profile/orders/${order.id}`}>
              Xem chi tiết
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
