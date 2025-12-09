"use client";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { ChevronRight, FileText, LogOut, MapPin, RotateCcw, Star, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const menuItems: MenuItem[] = [
  {
    label: "Thông tin tài khoản",
    href: "/profile",
    icon: UserCircle,
  },
  {
    label: "Lịch sử đơn hàng",
    href: "/profile/orders",
    icon: FileText,
  },
  {
    label: "Yêu cầu trả hàng",
    href: "/profile/return-requests",
    icon: RotateCcw,
  },
  {
    label: "Sổ địa chỉ",
    href: "/profile/addresses",
    icon: MapPin,
  },
  {
    label: "Đánh giá và nhận xét",
    href: "/profile/reviews",
    icon: Star,
  },
];

export default function ProfileSidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="w-full md:w-72 bg-white rounded-xl border border-gray-200 p-2 space-y-2 shadow-sm">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center font-bold justify-between hover:text-primary hover:bg-gray-50 px-4 py-3 rounded-full transition-colors",
              isActive
                ? "bg-primary text-white hover:text-gray-900 hover:bg-rose-600"
                : "text-gray-900",
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5" />
              <span className="text-sm">{item.label}</span>
            </div>
            <ChevronRight className="size-5" strokeWidth={2} />
          </Link>
        );
      })}

      <button
        onClick={handleLogout}
        className="w-full flex font-bold items-center justify-between px-4 py-3 rounded-full hover:text-primary text-gray-900 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <LogOut className="h-5 w-5" />
          <span className="text-sm">Đăng xuất</span>
        </div>
        <ChevronRight className="size-5" strokeWidth={2} />
      </button>
    </div>
  );
}
