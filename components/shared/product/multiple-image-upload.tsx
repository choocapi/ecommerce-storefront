"use client";

import { Label } from "@/components/ui/label";
import { cloudinaryService } from "@/services/cloudinaryService";
import { Loader2, Mountain, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface MultipleImageUploadProps {
  maxImages?: number;
  folder?: string;
  label?: string;
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  className?: string;
}

export default function MultipleImageUpload({
  maxImages = 3,
  folder = "product-reviews",
  label,
  value,
  onChange,
  disabled = false,
  className,
}: MultipleImageUploadProps) {
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check total images
    if (value.length + files.length > maxImages) {
      toast.error(`Chỉ được tải tối đa ${maxImages} ảnh`);
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      setUploadingImages(true);
      const uploadedUrls = await cloudinaryService.uploadMultipleImages(validFiles, folder);
      onChange([...value, ...uploadedUrls]);
      toast.success(`Đã tải ${uploadedUrls.length} ảnh thành công!`);
    } catch (error: any) {
      console.error("Image upload error:", error);
      toast.error("Tải ảnh thất bại!");
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={className}>
      {label && (
        <Label className="text-gray-900 font-medium">
          {label} {maxImages > 0 && `(tối đa ${maxImages} ảnh)`}
        </Label>
      )}
      <div className={`mt-2 space-y-3 ${label ? "" : ""}`}>
        {/* Image Preview Grid */}
        {value.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {value.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-md overflow-hidden border border-gray-200 group"
              >
                <Image
                  src={url}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        {value.length < maxImages && !disabled && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImages || disabled}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center gap-2 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadingImages ? (
              <>
                <Loader2 className="size-6 animate-spin" />
                <span className="text-sm text-gray-600">Đang tải...</span>
              </>
            ) : (
              <>
                <Mountain className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">Chọn ảnh để tải lên</span>
              </>
            )}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="hidden"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
