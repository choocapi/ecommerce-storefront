"use client";

import AddressModal from "@/components/shared/profile/address-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { IUserAddress } from "@/types/user-address";
import { MapPin, Pencil, Plus } from "lucide-react";
import { useState } from "react";

interface AddressSelectorProps {
  addresses: IUserAddress[];
  selectedAddressId: string | null;
  onSelect: (addressId: string | null) => void;
  onAddNew: () => void;
}

export default function AddressSelector({
  addresses,
  selectedAddressId,
  onSelect,
  onAddNew,
}: AddressSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IUserAddress | null>(null);

  const formatAddress = (address: IUserAddress) => {
    const parts = [address.addressLine, address.ward, address.district, address.city].filter(
      Boolean,
    );
    return parts.join(", ");
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEdit = (address: IUserAddress, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    onAddNew();
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  return (
    <div className="space-y-4">
      {/* Address Cards - Horizontal Scroll */}
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
        {addresses.map((address) => {
          const isSelected = selectedAddressId === address.id?.toString();
          return (
            <Card
              key={address.id}
              onClick={() => onSelect(address.id?.toString() || null)}
              className={`min-w-[280px] p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {address.recipientName}
                    </h3>
                    {address.isDefault && (
                      <Badge
                        variant="default"
                        className="bg-primary text-white text-xs px-2 py-0.5 rounded-full shrink-0"
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
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                      {formatAddress(address)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleEdit(address, e)}
                  className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 shrink-0"
                >
                  <Pencil className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            </Card>
          );
        })}

        {/* Add New Address Card */}
        <Card
          onClick={handleAddNew}
          className="min-w-[280px] p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center shrink-0"
        >
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Plus className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900">Thêm địa chỉ nhận</p>
          </div>
        </Card>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        address={editingAddress}
      />
    </div>
  );
}
