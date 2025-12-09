"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PaymentMethodEnum, type PaymentMethod } from "@/types/enums";
import Image from "next/image";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
}

export default function PaymentMethodSelector({
  selectedMethod,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <RadioGroup value={selectedMethod || undefined} onValueChange={onChange}>
      <div className="space-y-4">
        {/* COD */}
        <div className="flex items-center space-x-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
          <RadioGroupItem value={PaymentMethodEnum.COD} id="cod" className="text-primary" />
          <Label htmlFor="cod" className="flex-1 cursor-pointer text-sm font-medium text-gray-900">
            Thanh toán khi nhận hàng (COD)
          </Label>
        </div>

        {/* VNPAY */}
        <div className="flex items-center space-x-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
          <RadioGroupItem value={PaymentMethodEnum.VNPAY} id="vnpay" className="text-primary" />
          <Label htmlFor="vnpay" className="flex-1 cursor-pointer">
            <div className="relative h-8 w-24">
              <Image
                src="/assets/payments/Vnpay_Logo.png"
                alt="VNPay"
                fill
                className="object-contain"
              />
            </div>
          </Label>
        </div>

        {/* MOMO */}
        <div className="flex items-center space-x-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
          <RadioGroupItem value={PaymentMethodEnum.MOMO} id="momo" className="text-primary" />
          <Label htmlFor="momo" className="flex-1 cursor-pointer">
            <div className="relative size-8">
              <Image
                src="/assets/payments/MoMo_Logo.png"
                alt="MoMo"
                fill
                className="object-contain"
              />
            </div>
          </Label>
        </div>

        {/* ZALOPAY */}
        <div className="flex items-center space-x-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
          <RadioGroupItem value={PaymentMethodEnum.ZALOPAY} id="zalopay" className="text-primary" />
          <Label htmlFor="zalopay" className="flex-1 cursor-pointer">
            <div className="relative h-8 w-24">
              <Image
                src="/assets/payments/ZaloPay_Logo.png"
                alt="ZaloPay"
                fill
                className="object-contain"
              />
            </div>
          </Label>
        </div>
      </div>
    </RadioGroup>
  );
}
