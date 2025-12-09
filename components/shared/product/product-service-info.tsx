"use client";

import { ShieldCheck, Truck } from "lucide-react";

interface ProductServiceInfoProps {
  className?: string;
}

export default function ProductServiceInfo({ className }: ProductServiceInfoProps) {
  return (
    <div className={className}>
      <div className="bg-gray-100 rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Info */}
          <div className="flex flex-col items-center text-center">
            <Truck className="size-8 text-gray-900 mb-4" />
            <h3 className="text-gray-900 font-bold text-lg mb-2">Vận chuyển miễn phí</h3>
            <p className="text-gray-600 text-sm">Nội thành HN & TP.HCM</p>
          </div>

          {/* Warranty Info */}
          <div className="flex flex-col items-center text-center md:border-l md:border-gray-200 md:pl-6">
            <ShieldCheck className="size-8 text-gray-900 mb-4" />
            <h3 className="text-gray-900 font-bold text-lg mb-2">Bảo hành và đổi trả</h3>
            <div className="text-gray-600 text-sm space-y-1">
              <p>Bảo hành 12 tháng</p>
              <p>Đổi mới trong 15 ngày đầu tiên</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
