"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { IUserAddress } from "@/types/user-address";
import { MapPin, Pencil, Trash2 } from "lucide-react";

interface AddressCardProps {
  address: IUserAddress;
  onEdit: (address: IUserAddress) => void;
  onDelete: (address: IUserAddress) => void;
}

export default function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  const formatAddress = (address: IUserAddress) => {
    const parts = [address.addressLine, address.ward, address.district, address.city].filter(
      Boolean,
    );
    return parts.join(", ");
  };

  return (
    <Card className="p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow relative">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base font-medium text-gray-900">{address.recipientName}</h3>
            {address.isDefault && (
              <Badge
                variant="default"
                className="bg-primary text-white text-xs px-2 py-0.5 rounded-full"
              >
                Mặc định
              </Badge>
            )}
          </div>
          {address.phoneNumber && (
            <p className="text-sm text-gray-600 mb-2">{address.phoneNumber}</p>
          )}
          <div className="flex items-start gap-2">
            <MapPin className="size-4 text-gray-400 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-600 leading-relaxed">{formatAddress(address)}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(address)}
          className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
        >
          <Pencil className="h-4 w-4 text-gray-600" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(address)}
          className="h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
