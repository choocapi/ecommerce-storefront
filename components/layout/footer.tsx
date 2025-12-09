"use client";

import {
  IconBrandFacebook,
  IconBrandTiktok,
  IconBrandX,
  IconBrandYoutube,
  IconPhone,
} from "@tabler/icons-react";
import { ExternalLink, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import WavyDivider from "@/components/common/wavy-divider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const defaultSocialMedia = [
  {
    name: "Facebook",
    icon: IconBrandFacebook,
    url: "#",
  },
  {
    name: "Youtube",
    icon: IconBrandYoutube,
    url: "#",
  },
  {
    name: "Tiktok",
    icon: IconBrandTiktok,
    url: "#",
  },
  {
    name: "X",
    icon: IconBrandX,
    url: "#",
  },
];

const defaultAddresses = [
  {
    name: "Cửa hàng Hà Nội",
    addresses: [
      {
        address: "53 Thái Hà, Trung Liệt, Đống Đa",
        url: "#",
      },
      {
        address: "53 Thái Hà, Trung Liệt, Đống Đa",
        url: "#",
      },
    ],
  },
  {
    name: "Cửa hàng TP. HCM",
    addresses: [
      {
        address: "5 - 7 Nguyễn Huy Tưởng, P.6, Q.Bình Thạnh",
        url: "#",
      },
    ],
  },
];

const defaultUsefulInformation = [
  {
    name: "Chính sách bảo hành",
    url: "#",
  },
  {
    name: "Chính sách đổi trả",
    url: "#",
  },
  {
    name: "Chính sách vận chuyển",
    url: "#",
  },
  {
    name: "Chính sách bảo mật",
    url: "#",
  },
  {
    name: "Chính sách thanh toán",
    url: "#",
  },
  {
    name: "Chính sách kiểm hàng",
    url: "#",
  },
  {
    name: "Hướng dẫn mua hàng online",
    url: "#",
  },
  {
    name: "Về chúng tôi",
    url: "#",
  },
];

interface FooterProps {
  socialMedia?: typeof defaultSocialMedia;
  addresses?: typeof defaultAddresses;
  usefulInformation?: typeof defaultUsefulInformation;
  companyName?: string;
  hotlinePhone?: string;
  hotlineDisplay?: string;
  feedbackText?: string;
}

export default function Footer({
  socialMedia = defaultSocialMedia,
  addresses = defaultAddresses,
  usefulInformation = defaultUsefulInformation,
  companyName = "ACB Computer",
  hotlinePhone = "0352343012",
  hotlineDisplay = "0352343012",
  feedbackText = "Đội ngũ Kiểm Soát Chất Lượng của chúng tôi sẵn sàng lắng nghe quý khách.",
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-10 w-full">
      <WavyDivider />

      <div className="container mx-auto pt-6 md:pt-14 pb-6 px-2 md:px-3 lg:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Left Section - Branding & Social */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.svg"
                alt="ACB Computer Logo"
                width={150}
                height={75}
                className="h-14 w-auto"
              />
            </Link>
            <div className="flex items-center gap-4">
              {socialMedia.map((item, index) => (
                <Link
                  key={index}
                  href={item.url}
                  className="h-11 w-11 rounded-full border flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label={item.name}
                >
                  <item.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>

          {/* Middle-Left Section - Contact Information */}
          <div className="space-y-4">
            <h3 className="text-gray-900 font-bold text-lg mb-2">Hotline</h3>
            <Link
              href={`tel:${hotlinePhone}`}
              className="flex items-center gap-2 text-gray-900 hover:text-primary transition-colors"
            >
              <IconPhone className="h-5 w-5" />
              <span className="text-sm">{hotlineDisplay || hotlinePhone}</span>
            </Link>
            <div className="space-y-3">
              {addresses.map((group) => (
                <div key={group.name} className="space-y-2">
                  <h4 className="text-gray-900 font-bold text-lg">{group.name}</h4>
                  {group.addresses.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 mt-1 shrink-0" />
                      <div>
                        <p className="text-sm">{item.address}</p>
                        <Link
                          href={item.url}
                          className="text-blue-600 text-sm inline-flex items-center gap-1"
                        >
                          (Chỉ đường)
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Middle-Right Section - Useful Information */}
          <div className="space-y-4">
            <h3 className="text-gray-900 font-bold text-lg mb-2">Thông tin hữu ích</h3>
            <nav className="space-y-2">
              {usefulInformation.map((item) => (
                <Link
                  key={item.name}
                  href={item.url}
                  className="block text-gray-900 hover:text-primary transition-colors font-light text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Section - Feedback */}
          <div className="space-y-4">
            <h3 className="text-gray-900 font-bold text-lg mb-2">Phản hồi, góp ý</h3>
            <p className="text-gray-900 text-sm font-light leading-relaxed">{feedbackText}</p>
            <Button
              variant="default"
              className={cn(
                "rounded-full bg-black hover:bg-black/80 text-white border-0 h-10 w-full",
                "flex items-center gap-2",
              )}
            >
              <Mail strokeWidth={2} className="size-6" />
              <span className="text-base font-bold">Gửi phản hồi</span>
            </Button>
          </div>
        </div>

        <hr className="mt-6 md:mt-12 mb-5 md:mb-6" />

        {/* Bottom Section - Copyright & Certifications */}
        <div className="text-xs text-gray-900">
          <p>
            © {companyName} {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
}
