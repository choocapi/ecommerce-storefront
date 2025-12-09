"use client";

import Loader from "@/components/common/loader";
import OrderCard from "@/components/shared/profile/order-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orderService } from "@/services/orderService";
import { OrderStatusEnum } from "@/types/enums";
import type { IOrder } from "@/types/order";
import { getOrderStatusLabel } from "@/types/order";
import { useEffect, useMemo, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("ALL");

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error: any) {
      console.error("Fetch orders error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders by status (local filtering)
  const filteredOrders = useMemo(() => {
    if (activeTab === "ALL") {
      return orders;
    }
    return orders.filter((order) => order.status === activeTab);
  }, [orders, activeTab]);

  // Count orders by status
  const orderCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: orders.length,
    };

    Object.values(OrderStatusEnum).forEach((status) => {
      counts[status] = orders.filter((order) => order.status === status).length;
    });

    return counts;
  }, [orders]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lịch sử đơn hàng</h2>
          <p className="text-sm text-gray-500">
            {orders.length} đơn hàng{" "}
            {activeTab !== "ALL" &&
              `(${filteredOrders.length} đơn ${getOrderStatusLabel(activeTab).toLowerCase()})`}
          </p>
        </div>

        {/* Tabs for filtering */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <div className="overflow-x-auto -mx-6 md:-mx-8 px-6 md:px-8">
            <TabsList className=" bg-gray-100 rounded-lg p-1 w-max min-w-full md:min-w-0 flex-nowrap">
              <TabsTrigger
                value="ALL"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap shrink-0"
              >
                Tất cả ({orderCounts.ALL || 0})
              </TabsTrigger>
              {Object.values(OrderStatusEnum).map((status) => (
                <TabsTrigger
                  key={status}
                  value={status}
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap shrink-0"
                >
                  {getOrderStatusLabel(status)} ({orderCounts[status] || 0})
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">
                  {activeTab === "ALL"
                    ? "Bạn chưa có đơn hàng nào"
                    : `Không có đơn hàng ${getOrderStatusLabel(activeTab).toLowerCase()}`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
