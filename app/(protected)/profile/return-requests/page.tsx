"use client";

import Loader from "@/components/common/loader";
import ReturnRequestCard from "@/components/shared/profile/return-request-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { returnRequestService } from "@/services/returnRequestService";
import { ReturnStatusEnum } from "@/types/enums";
import type { IReturnRequest } from "@/types/return-request";
import { getReturnStatusLabel } from "@/types/return-request";
import { useEffect, useMemo, useState } from "react";

export default function ReturnRequestsPage() {
  const [returnRequests, setReturnRequests] = useState<IReturnRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("ALL");

  const fetchReturnRequests = async () => {
    try {
      setIsLoading(true);
      const data = await returnRequestService.getMyRequests();
      setReturnRequests(data);
    } catch (error: any) {
      console.error("Fetch return requests error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnRequests();
  }, []);

  // Filter return requests by status (local filtering)
  const filteredRequests = useMemo(() => {
    if (activeTab === "ALL") {
      return returnRequests;
    }
    return returnRequests.filter((request) => request.status === activeTab);
  }, [returnRequests, activeTab]);

  // Count return requests by status
  const requestCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: returnRequests.length,
    };

    Object.values(ReturnStatusEnum).forEach((status) => {
      counts[status] = returnRequests.filter((request) => request.status === status).length;
    });

    return counts;
  }, [returnRequests]);

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Yêu cầu trả hàng</h2>
          <p className="text-sm text-gray-500">
            {returnRequests.length} yêu cầu{" "}
            {activeTab !== "ALL" &&
              `(${filteredRequests.length} yêu cầu ${getReturnStatusLabel(
                activeTab,
              ).toLowerCase()})`}
          </p>
        </div>

        {/* Tabs for filtering */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <div className="overflow-x-auto -mx-6 md:-mx-8 px-6 md:px-8">
            <TabsList className="bg-gray-100 rounded-lg p-1 w-max min-w-full md:min-w-0 flex-nowrap">
              <TabsTrigger
                value="ALL"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap shrink-0"
              >
                Tất cả ({requestCounts.ALL || 0})
              </TabsTrigger>
              {Object.values(ReturnStatusEnum).map((status) => (
                <TabsTrigger
                  key={status}
                  value={status}
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap shrink-0"
                >
                  {getReturnStatusLabel(status)} ({requestCounts[status] || 0})
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-6">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">
                  {activeTab === "ALL"
                    ? "Bạn chưa có yêu cầu trả hàng nào"
                    : `Không có yêu cầu ${getReturnStatusLabel(activeTab).toLowerCase()}`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredRequests.map((request) => (
                  <ReturnRequestCard key={request.id} returnRequest={request} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
