"use client";

import Loader from "@/components/common/loader";
import CouponModal from "@/components/shared/cart/coupon-modal";
import AddressSelector from "@/components/shared/checkout/address-selector";
import CheckoutProductsList from "@/components/shared/checkout/checkout-products-list";
import PaymentMethodSelector from "@/components/shared/checkout/payment-method-selector";
import { Button } from "@/components/ui/button";
import { cartItemQueries, cartItemQueryKeys } from "@/services/cartItemService";
import { momoService } from "@/services/momoService";
import { orderService } from "@/services/orderService";
import { userAddressQueries, userAddressQueryKeys } from "@/services/userAddressService";
import { vnpayService } from "@/services/vnpayService";
import { zalopayService } from "@/services/zalopayService";
import { useCartStore } from "@/stores/useCartStore";
import { CouponTypeEnum, PaymentMethodEnum, type PaymentMethod } from "@/types/enums";
import { formatCurrency } from "@/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Gift, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { selectedCoupon, clearCoupon, calculateDiscount, calculateTotal } = useCartStore();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // Fetch cart items
  const { data: cartItems = [], isLoading: isLoadingCart } = useQuery(cartItemQueries.list());
  const { data: cartSummary } = useQuery(cartItemQueries.summary());

  // Fetch addresses
  const { data: addresses = [], isLoading: isLoadingAddresses } = useQuery(
    userAddressQueries.list(),
  );

  // Set default address on load
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find((addr) => addr.isDefault);
      const addressToSelect = defaultAddress || addresses[0];
      setSelectedAddressId(addressToSelect.id?.toString() || null);
    }
  }, [addresses, selectedAddressId]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoadingCart && cartItems.length === 0) {
      toast.error("Giỏ hàng trống!");
      router.push("/cart");
    }
  }, [cartItems.length, isLoadingCart, router]);

  // Calculate prices - recalculate when coupon changes
  const subtotal = useMemo(() => cartSummary?.totalAmount || 0, [cartSummary]);
  const discount = useMemo(
    () => calculateDiscount(subtotal),
    [subtotal, calculateDiscount, selectedCoupon],
  );
  const total = useMemo(() => calculateTotal(subtotal), [subtotal, calculateTotal, selectedCoupon]);

  // Handle address selection
  const handleAddressSelect = (addressId: string | null) => {
    setSelectedAddressId(addressId);
  };

  // Handle add new address
  const handleAddNewAddress = () => {
    queryClient.invalidateQueries({ queryKey: userAddressQueryKeys.lists() });
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  // Handle submit order
  const handleSubmitOrder = async () => {
    // Validation
    if (!selectedAddressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống!");
      router.push("/cart");
      return;
    }

    // Get selected address
    const selectedAddress = addresses.find((addr) => addr.id?.toString() === selectedAddressId);

    if (!selectedAddress) {
      toast.error("Địa chỉ không hợp lệ");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order
      const orderData = {
        shippingAddress: selectedAddress.addressLine || "",
        shippingPhone: selectedAddress.phoneNumber || "",
        shippingName: selectedAddress.recipientName || "",
        shippingWard: selectedAddress.ward || "",
        shippingDistrict: selectedAddress.district || "",
        shippingCity: selectedAddress.city || "",
        paymentMethod: selectedPaymentMethod,
        discountAmount: discount,
        couponCode: selectedCoupon?.code || "",
      };

      const order = await orderService.createFromCart(orderData);

      // Handle online payment gateways
      if (
        selectedPaymentMethod === PaymentMethodEnum.VNPAY ||
        selectedPaymentMethod === PaymentMethodEnum.MOMO ||
        selectedPaymentMethod === PaymentMethodEnum.ZALOPAY
      ) {
        try {
          let paymentResponse;
          const paymentData = {
            orderId: order.id,
            amount: Math.round(total),
          };

          if (selectedPaymentMethod === PaymentMethodEnum.VNPAY) {
            paymentResponse = await vnpayService.createPayment(paymentData);
          } else if (selectedPaymentMethod === PaymentMethodEnum.MOMO) {
            paymentResponse = await momoService.createPayment(paymentData);
          } else if (selectedPaymentMethod === PaymentMethodEnum.ZALOPAY) {
            paymentResponse = await zalopayService.createPayment(paymentData);
          }

          if (paymentResponse && paymentResponse.code === "00" && paymentResponse.paymentUrl) {
            // Redirect to payment gateway page
            window.location.href = paymentResponse.paymentUrl;
            return;
          } else {
            throw new Error("Không thể tạo liên kết thanh toán");
          }
        } catch (paymentError: any) {
          console.error("Error creating payment URL:", paymentError);
          toast.error("Không thể kết nối với cổng thanh toán");
          setIsSubmitting(false);
          return;
        }
      }

      // For COD, show success and redirect
      toast.success("Đặt hàng thành công! Cảm ơn bạn đã đặt hàng.");

      // Clear cart coupon
      useCartStore.getState().clearCoupon();

      // Invalidate cart queries
      queryClient.invalidateQueries({ queryKey: cartItemQueryKeys.all });

      // Redirect to order details page (or orders list if details page doesn't exist)
      router.push(`/profile/orders`);
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error("Không thể tạo đơn hàng. Vui lòng thử lại");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCart || isLoadingAddresses) {
    return (
      <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Delivery Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-gray-900 font-bold text-xl mb-4">Thông tin giao hàng</h2>
            <AddressSelector
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelect={handleAddressSelect}
              onAddNew={handleAddNewAddress}
            />
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-gray-900 font-bold text-xl mb-4">Phương thức thanh toán</h2>
            <PaymentMethodSelector
              selectedMethod={selectedPaymentMethod}
              onChange={handlePaymentMethodChange}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Promotions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-gray-900 font-bold text-xl mb-4">Khuyến mãi</h2>
            {selectedCoupon ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-gray-900 font-semibold text-sm">{selectedCoupon.code}</p>
                      <p className="text-gray-600 text-xs">
                        {selectedCoupon.type === CouponTypeEnum.FIXED
                          ? `Giảm ${formatCurrency(selectedCoupon.value)}`
                          : `Giảm ${selectedCoupon.value}%`}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearCoupon()}
                    className="h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsCouponModalOpen(true)}
                  className="w-full rounded-full border-gray-200 text-gray-900 hover:bg-gray-50 font-semibold"
                >
                  <Gift className="mr-2 h-4 w-4" />
                  Chọn hoặc nhập mã khuyến mãi
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsCouponModalOpen(true)}
                className="w-full rounded-full h-10 border-gray-200 text-gray-900 hover:bg-gray-50 font-semibold"
              >
                <Gift className="size-5" />
                Chọn hoặc nhập mã khuyến mãi
              </Button>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-gray-900 font-bold text-xl mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-3">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Tạm tính</span>
                <span className="text-gray-900 font-semibold">{formatCurrency(subtotal)}</span>
              </div>

              {/* Discount */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Giảm giá</span>
                <span className="text-primary font-semibold">
                  {discount > 0 ? `-${formatCurrency(discount)}` : formatCurrency(0)}
                </span>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-3 border-t-2 border-dashed border-gray-300">
                <span className="text-gray-900 font-bold text-lg">Tổng cộng</span>
                <span className="text-primary font-bold text-xl">{formatCurrency(total)}</span>
              </div>
            </div>
            {/* Place Order Button */}
            <Button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full mt-6 rounded-full bg-primary text-white hover:bg-rose-600 font-semibold py-6 text-base"
            >
              {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
            </Button>
          </div>

          {/* Products List */}
          <CheckoutProductsList cartItems={cartItems} defaultOpen={false} />
        </div>
      </div>

      {/* Coupon Modal */}
      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        subtotal={subtotal}
      />
    </div>
  );
}
