"use client";

import Loader from "@/components/common/loader";
import DeleteConfirmDialog from "@/components/shared/profile/delete-confirm-dialog";
import OrderProductCard from "@/components/shared/profile/order-product-card";
import ReturnRequestModal from "@/components/shared/profile/return-request-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { cartItemQueryKeys, cartItemService } from "@/services/cartItemService";
import { momoService } from "@/services/momoService";
import { orderService } from "@/services/orderService";
import { vnpayService } from "@/services/vnpayService";
import { zalopayService } from "@/services/zalopayService";
import { OrderStatusEnum, PaymentMethodEnum, PaymentStatusEnum } from "@/types/enums";
import type { IOrder } from "@/types/order";
import { getOrderStatusLabel, getStatusBadgeClassName, getStatusBadgeVariant } from "@/types/order";
import { formatCurrency, formatOrderCode } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Copy,
  CreditCard,
  MapPin,
  PackageCheck,
  RefreshCw,
  User,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = use(params);
  const [isReturnRequestModalOpen, setIsReturnRequestModalOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Fetch order details
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.get(id),
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: () => orderService.cancel(id),
    onSuccess: () => {
      toast.success("Đã hủy đơn hàng thành công!");
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
    onError: (error: any) => {
      toast.error("Không thể hủy đơn hàng. Vui lòng thử lại.");
    },
  });

  // Confirm delivery mutation
  const confirmDeliveryMutation = useMutation({
    mutationFn: () => orderService.confirmDelivery(id),
    onSuccess: () => {
      toast.success("Cảm ơn bạn đã xác nhận đã nhận hàng!");
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
    onError: (error: any) => {
      toast.error("Không thể xác nhận giao hàng. Vui lòng thử lại.");
    },
  });

  // Buy again mutation
  const buyAgainMutation = useMutation({
    mutationFn: async (order: IOrder) => {
      if (!order.items || order.items.length === 0) {
        throw new Error("Đơn hàng không có sản phẩm");
      }

      // Add all products to cart
      const requests = order.items.map((item) => ({
        productId: item.productId!,
        quantity: item.quantity,
      }));

      await cartItemService.addBatch(requests);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartItemQueryKeys.all });
      toast.success("Đã thêm tất cả sản phẩm vào giỏ hàng!");
      router.push("/cart");
    },
    onError: (error: any) => {
      toast.error("Không thể thêm sản phẩm vào giỏ hàng");
    },
  });

  const handleBuyAgain = () => {
    if (order) {
      buyAgainMutation.mutate(order);
    }
  };

  const handleCopyOrderId = () => {
    if (order) {
      const orderCode = `#${order.id.slice(0, 8).toUpperCase()}`;
      navigator.clipboard.writeText(orderCode);
      toast.success("Đã sao chép mã đơn hàng!");
    }
  };

  const canRetryPayment = () => {
    if (!order) return false;
    return (
      order.status === OrderStatusEnum.PENDING &&
      order.paymentStatus === PaymentStatusEnum.PENDING &&
      order.paymentMethod !== PaymentMethodEnum.COD &&
      order.paymentMethod !== undefined
    );
  };

  const handleRetryPayment = async () => {
    if (!order) return;

    setIsProcessingPayment(true);
    try {
      const amount = Math.round(order.totalAmount || 0);
      let paymentResponse;

      if (order.paymentMethod === PaymentMethodEnum.VNPAY) {
        paymentResponse = await vnpayService.createPayment({
          orderId: order.id,
          amount,
        });
      } else if (order.paymentMethod === PaymentMethodEnum.MOMO) {
        paymentResponse = await momoService.createPayment({
          orderId: order.id,
          amount,
        });
      } else if (order.paymentMethod === PaymentMethodEnum.ZALOPAY) {
        paymentResponse = await zalopayService.createPayment({
          orderId: order.id,
          amount,
        });
      } else {
        throw new Error("Phương thức thanh toán không hợp lệ");
      }

      if (paymentResponse && paymentResponse.code === "00" && paymentResponse.paymentUrl) {
        // Redirect to payment gateway page
        window.location.href = paymentResponse.paymentUrl;
      } else {
        throw new Error("Không thể tạo liên kết thanh toán");
      }
    } catch (error: any) {
      console.error("Error creating payment URL:", error);
      toast.error(error?.message || "Không thể kết nối với cổng thanh toán");
      setIsProcessingPayment(false);
    }
  };

  const formatAddress = (order: IOrder) => {
    const parts = [
      order.shippingAddress,
      order.shippingWard,
      order.shippingDistrict,
      order.shippingCity,
    ].filter(Boolean);
    return parts.join(", ");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">Không tìm thấy đơn hàng</p>
        </div>
      </div>
    );
  }

  const canCancelOrder =
    order.status === OrderStatusEnum.PENDING || order.status === OrderStatusEnum.PROCESSING;
  const canConfirmDelivery = order.status === OrderStatusEnum.SHIPPED;
  const canRequestReturn = order.status === OrderStatusEnum.DELIVERED;

  return (
    <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/profile/orders")}
            className="rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="size-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Tất cả đơn hàng</span>
          </Button>
        </div>

        {/* Order Header: ID, Status, Buy Again Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-gray-900 font-bold text-2xl">
              Đơn hàng {formatOrderCode(order.id)}
            </h1>
            <Badge
              variant={getStatusBadgeVariant(order.status)}
              className={cn(
                "text-sm px-3 py-1 rounded-full",
                getStatusBadgeClassName(order.status),
              )}
            >
              {getOrderStatusLabel(order.status)}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-3 justify-start md:justify-end">
            {canRetryPayment() && (
              <Button
                type="button"
                variant="outline"
                disabled={isProcessingPayment}
                onClick={handleRetryPayment}
                className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold px-6"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isProcessingPayment ? "Đang xử lý..." : "Thanh toán lại"}
              </Button>
            )}

            {canCancelOrder && (
              <Button
                type="button"
                variant="outline"
                disabled={cancelOrderMutation.isPending}
                onClick={() => setIsCancelDialogOpen(true)}
                className="rounded-full border-red-200 text-red-600 hover:bg-red-50 font-semibold px-6"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Hủy đơn hàng
              </Button>
            )}

            {canConfirmDelivery && (
              <Button
                type="button"
                variant="outline"
                disabled={confirmDeliveryMutation.isPending}
                onClick={() => setIsConfirmDialogOpen(true)}
                className="rounded-full border-green-200 text-green-700 hover:bg-green-50 font-semibold px-6"
              >
                <PackageCheck className="mr-2 h-4 w-4" />
                Đã nhận hàng
              </Button>
            )}

            {canRequestReturn && (
              <Button
                onClick={() => setIsReturnRequestModalOpen(true)}
                variant="outline"
                className="rounded-full border-gray-200 text-gray-900 hover:bg-gray-50 font-semibold px-6"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Yêu cầu trả hàng
              </Button>
            )}
            <Button
              onClick={handleBuyAgain}
              disabled={buyAgainMutation.isPending || !order.items || order.items.length === 0}
              className="rounded-full bg-gray-900 text-white hover:bg-gray-800 font-semibold px-6"
            >
              {buyAgainMutation.isPending ? "Đang thêm..." : "Mua lại"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Order Summary Card */}
          <Card className="p-6 rounded-xl border border-gray-200">
            <h2 className="text-gray-900 font-bold text-xl">Tóm tắt đơn hàng</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tạm tính</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(order.subtotal || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Giảm giá</span>
                <span className="text-sm font-semibold text-primary">
                  {order.discountAmount && order.discountAmount > 0
                    ? `-${formatCurrency(order.discountAmount)}`
                    : formatCurrency(0)}
                </span>
              </div>
              <div className="border-t-2 border-dashed border-gray-300 my-3"></div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-bold text-lg">Tổng cộng</span>
                <span className="text-gray-900 font-bold text-lg">
                  {formatCurrency(order.totalAmount || 0)}
                </span>
              </div>
            </div>
          </Card>

          {/* Order Information Card */}
          <Card className="p-6 rounded-xl border border-gray-200">
            <h2 className="text-gray-900 font-bold text-xl">Thông tin đơn hàng</h2>
            <div className="space-y-4">
              {/* Order Code */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mã đặt hàng:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {formatOrderCode(order.id)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyOrderId}
                    className="h-6 w-6 p-0 rounded-full hover:bg-gray-100"
                  >
                    <Copy className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
              </div>

              {/* Recipient */}
              {order.shippingName && (
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm text-gray-600">Người nhận:</span>
                    <span className="text-sm font-medium text-gray-900 ml-2">
                      {order.shippingName}
                      {order.shippingPhone && `, ${order.shippingPhone}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              {formatAddress(order) && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm text-gray-600">Giao tới:</span>
                    <span className="text-sm text-gray-900 ml-2">{formatAddress(order)}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Products Card */}
          <Card className="p-6 rounded-xl border border-gray-200">
            <h2 className="text-gray-900 font-bold text-xl">
              Sản phẩm ({order.items?.length || 0})
            </h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <OrderProductCard key={item.id} item={item} orderStatus={order.status} />
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Return Request Modal */}
      <ReturnRequestModal
        isOpen={isReturnRequestModalOpen}
        onClose={() => setIsReturnRequestModalOpen(false)}
        onSuccess={() => {
          // Optionally refresh order data or show success message
          queryClient.invalidateQueries({ queryKey: ["order", id] });
        }}
        orderId={order.id}
      />

      {/* Cancel Order Dialog */}
      <DeleteConfirmDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={() => cancelOrderMutation.mutate()}
        title="Xác nhận hủy đơn hàng"
        description="Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này có thể không hoàn tác được."
        confirmText={cancelOrderMutation.isPending ? "Đang hủy..." : "Hủy đơn hàng"}
        cancelText="Quay lại"
      />

      {/* Confirm Delivery Dialog */}
      <DeleteConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={() => confirmDeliveryMutation.mutate()}
        title="Xác nhận đã nhận hàng"
        description="Bạn xác nhận đã nhận đầy đủ sản phẩm trong đơn hàng này?"
        confirmText={confirmDeliveryMutation.isPending ? "Đang xác nhận..." : "Đã nhận hàng"}
        cancelText="Quay lại"
      />
    </div>
  );
}
