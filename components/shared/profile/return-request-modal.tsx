"use client";

import MultipleImageUpload from "@/components/shared/product/multiple-image-upload";
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
import { Textarea } from "@/components/ui/textarea";
import { returnRequestService } from "@/services/returnRequestService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const returnRequestSchema = z.object({
  reason: z.string().min(10, "Lý do trả hàng phải có ít nhất 10 ký tự"),
});

type ReturnRequestFormValues = z.infer<typeof returnRequestSchema>;

interface ReturnRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  orderId: string;
}

export default function ReturnRequestModal({
  isOpen,
  onClose,
  onSuccess,
  orderId,
}: ReturnRequestModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const form = useForm<ReturnRequestFormValues>({
    resolver: zodResolver(returnRequestSchema),
    defaultValues: {
      reason: "",
    },
  });

  const handleClose = () => {
    form.reset();
    setImageUrls([]);
    onClose();
  };

  const onSubmit = async (values: ReturnRequestFormValues) => {
    try {
      setIsLoading(true);

      // Prepare imageUrls as JSON string
      const imageUrlsJson = imageUrls.length > 0 ? JSON.stringify(imageUrls) : undefined;

      await returnRequestService.create({
        orderId,
        reason: values.reason,
        imageUrls: imageUrlsJson,
      });

      toast.success("Đã tạo yêu cầu trả hàng thành công!");
      form.reset();
      setImageUrls([]);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Create return request error:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900 font-bold text-xl">Yêu cầu trả hàng</DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            Vui lòng điền thông tin và lý do trả hàng. Chúng tôi sẽ xem xét yêu cầu của bạn trong
            thời gian sớm nhất.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* Reason Field */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-900 font-medium">
                    Lý do trả hàng <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="rounded-md border-gray-200 min-h-[120px] resize-none"
                      placeholder="Vui lòng mô tả chi tiết lý do bạn muốn trả hàng..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <FormItem>
              <FormLabel className="text-sm text-gray-900 font-medium">
                Hình ảnh minh chứng (Tùy chọn)
              </FormLabel>
              <FormControl>
                <MultipleImageUpload
                  maxImages={5}
                  folder="return-requests"
                  value={imageUrls}
                  onChange={setImageUrls}
                  disabled={isLoading}
                />
              </FormControl>
              <p className="text-xs text-gray-500 mt-1">
                Tải lên hình ảnh để hỗ trợ yêu cầu trả hàng của bạn (tối đa 5 ảnh)
              </p>
            </FormItem>

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
                {isLoading ? "Đang gửi..." : "Gửi yêu cầu"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
