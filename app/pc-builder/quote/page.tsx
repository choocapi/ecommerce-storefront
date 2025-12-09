"use client";

import { PCBuilderQuoteView } from "@/components/shared/pc-builder/pc-builder-quote-view";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePCBuilderStore } from "@/stores/usePCBuilderStore";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function PCBuilderQuotePage() {
  const router = useRouter();
  const quoteRef = useRef<HTMLDivElement | null>(null);
  const components = usePCBuilderStore((state) => state.components);
  const [isExporting, setIsExporting] = useState(false);

  const componentCount = Object.keys(components).length;

  const handleExport = async () => {
    if (!quoteRef.current) {
      toast.error("Không thể xuất báo giá. Vui lòng thử lại.");
      return;
    }

    if (componentCount === 0) {
      toast.warning("Vui lòng quay lại và chọn ít nhất một linh kiện trước khi xuất báo giá.");
      return;
    }

    setIsExporting(true);
    try {
      const dataUrl = await toPng(quoteRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `bao-gia-pc-${new Date().getTime()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Đã xuất báo giá thành công");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Export quote error:", error);
      toast.error("Không thể xuất báo giá. Vui lòng thử lại.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={cn("container mx-auto px-2 md:px-3 lg:px-4 py-8")}>
      <div className="mb-4 flex items-center justify-center">
        <Button
          size="lg"
          className="rounded-full text-base font-semibold text-white px-4"
          onClick={handleExport}
          disabled={componentCount === 0 || isExporting}
        >
          <Download className="size-4" />
          {isExporting ? "Đang xuất..." : "Tải file báo giá"}
        </Button>
      </div>

      {componentCount === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-600">
            Chưa có linh kiện nào trong cấu hình. Vui lòng quay lại trang Build PC để chọn linh kiện
            trước khi xuất báo giá.
          </p>
        </div>
      ) : (
        <div className="flex justify-center">
          <div ref={quoteRef}>
            <PCBuilderQuoteView />
          </div>
        </div>
      )}
    </div>
  );
}
