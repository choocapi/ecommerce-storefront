"use client";

import Loader from "@/components/common/loader";
import AddressCard from "@/components/shared/profile/address-card";
import AddressModal from "@/components/shared/profile/address-modal";
import DeleteConfirmDialog from "@/components/shared/profile/delete-confirm-dialog";
import { Card } from "@/components/ui/card";
import { userAddressService } from "@/services/userAddressService";
import type { IUserAddress } from "@/types/user-address";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<IUserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IUserAddress | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<IUserAddress | null>(null);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const data = await userAddressService.list();
      setAddresses(data);
    } catch (error: any) {
      console.error("Fetch addresses error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEditAddress = (address: IUserAddress) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async () => {
    if (!deletingAddress?.id) return;

    try {
      await userAddressService.delete(deletingAddress.id);
      toast.success("Xóa địa chỉ thành công!");
      fetchAddresses();
    } catch (error: any) {
      console.error("Delete address error:", error);
      toast.error("Không thể xóa địa chỉ");
    }
  };

  const handleModalSuccess = () => {
    fetchAddresses();
  };

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sổ địa chỉ</h2>
            <p className="text-sm text-gray-500">{addresses.length} địa chỉ được lưu</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Existing Addresses */}
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEditAddress}
              onDelete={setDeletingAddress}
            />
          ))}

          {/* Add New Address Card */}
          <Card
            className="p-5 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-gray-50 transition-colors cursor-pointer min-h-[200px] flex items-center justify-center"
            onClick={handleAddAddress}
          >
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">Thêm địa chỉ nhận</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAddress(null);
        }}
        onSuccess={handleModalSuccess}
        address={editingAddress}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingAddress}
        onClose={() => setDeletingAddress(null)}
        onConfirm={handleDeleteAddress}
        title="Xác nhận xóa địa chỉ"
        description="Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể hoàn tác."
      />
    </div>
  );
}
