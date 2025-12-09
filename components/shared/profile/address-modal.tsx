"use client";

import { AddressSelect } from "@/components/shared/address-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { addressSchema, type AddressFormValues } from "@/schemas";
import { userAddressService } from "@/services/userAddressService";
import type { IUserAddress } from "@/types/user-address";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  address?: IUserAddress | null;
}

export default function AddressModal({ isOpen, onClose, onSuccess, address }: AddressModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!address;

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      recipientName: "",
      phoneNumber: "",
      addressLine: "",
      city: "",
      district: "",
      ward: "",
      isDefault: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (address) {
        form.reset({
          recipientName: address.recipientName || "",
          phoneNumber: address.phoneNumber || "",
          addressLine: address.addressLine || "",
          city: address.city || "",
          district: address.district || "",
          ward: address.ward || "",
          isDefault: address.isDefault || false,
        });
      } else {
        form.reset({
          recipientName: "",
          phoneNumber: "",
          addressLine: "",
          city: "",
          district: "",
          ward: "",
          isDefault: false,
        });
      }
    }
  }, [isOpen, address, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: AddressFormValues) => {
    try {
      setIsLoading(true);
      if (isEditMode && address?.id) {
        await userAddressService.update(address.id, values);
        toast.success("Cập nhật địa chỉ thành công!");
      } else {
        await userAddressService.create(values);
        toast.success("Thêm địa chỉ thành công!");
      }
      form.reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Address save error:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900 font-medium text-lg">
            {isEditMode ? "Sửa địa chỉ" : "Thêm địa chỉ nhận hàng"}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            {isEditMode
              ? "Cập nhật thông tin địa chỉ nhận hàng của bạn"
              : "Thêm địa chỉ mới để nhận hàng"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="recipientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-900 font-medium">
                    Tên người nhận
                  </FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <FormControl>
                      <Input
                        {...field}
                        className="pl-10 rounded-md h-10 border-gray-200"
                        placeholder="Nhập tên người nhận"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-900 font-medium">Số điện thoại</FormLabel>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        className="pl-10 rounded-md h-10 border-gray-200"
                        placeholder="Nhập số điện thoại"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AddressSelect
              control={form.control}
              setValue={form.setValue}
              cityField="city"
              districtField="district"
              wardField="ward"
              disabled={isLoading}
            />

            <FormField
              control={form.control}
              name="addressLine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-900 font-medium">
                    Địa chỉ chi tiết
                  </FormLabel>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    <FormControl>
                      <Textarea
                        {...field}
                        className="pl-10 rounded-md border-gray-200 min-h-[100px] resize-none"
                        placeholder="Nhập số nhà, tên đường, tòa nhà..."
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm text-gray-900 font-medium cursor-pointer">
                      Đặt làm địa chỉ mặc định
                    </FormLabel>
                    <p className="text-xs text-gray-500">
                      Địa chỉ này sẽ được sử dụng mặc định khi đặt hàng
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="border-gray-200 font-semibold text-gray-900 hover:bg-gray-50 rounded-full px-4"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary font-semibold text-white hover:bg-rose-600 rounded-full px-4"
              >
                {isLoading ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Thêm địa chỉ"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
