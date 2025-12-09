"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cloudinaryService } from "@/services/cloudinaryService";
import { Camera, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  firstName?: string;
  lastName?: string;
  onUploadComplete: (avatarUrl: string) => void;
  disabled?: boolean;
}

export default function AvatarUpload({
  currentAvatarUrl,
  firstName,
  lastName,
  onUploadComplete,
  disabled = false,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = () => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return first + last || "U";
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    try {
      setIsUploading(true);
      const avatarUrl = await cloudinaryService.uploadImage(file, "avatars");
      onUploadComplete(avatarUrl);
      toast.success("Tải ảnh đại diện thành công!");
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      toast.error("Tải ảnh đại diện thất bại!");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const displayUrl = previewUrl || currentAvatarUrl;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="size-24 md:size-32 border-4 border-gray-200">
          {displayUrl ? (
            <AvatarImage src={displayUrl} alt="Avatar" />
          ) : (
            <AvatarFallback className="bg-gray-100 text-gray-600 text-2xl font-semibold">
              {getInitials()}
            </AvatarFallback>
          )}
        </Avatar>

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}

        {!disabled && !isUploading && (
          <button
            type="button"
            onClick={handleClick}
            className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-md hover:bg-rose-600 transition-colors"
            aria-label="Đổi ảnh đại diện"
          >
            <Camera className="h-5 w-5" />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
}
