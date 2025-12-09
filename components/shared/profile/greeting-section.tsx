"use client";

import { getUserFullName } from "@/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import Image from "next/image";
import { useMemo } from "react";

type TimeOfDay = "morning" | "afternoon" | "evening";

export default function GreetingSection() {
  const { user } = useAuthStore();

  const { timeOfDay, greeting, imageSrc } = useMemo(() => {
    const hour = new Date().getHours();
    let timeOfDay: TimeOfDay;
    let greeting: string;
    let imageSrc: string;

    if (hour >= 5 && hour < 12) {
      timeOfDay = "morning";
      greeting = "Chào buổi sáng";
      imageSrc = "/assets/morning.jpg";
    } else if (hour >= 12 && hour < 18) {
      timeOfDay = "afternoon";
      greeting = "Chào buổi chiều";
      imageSrc = "/assets/afternoon.jpg";
    } else {
      timeOfDay = "evening";
      greeting = "Chào buổi tối";
      imageSrc = "/assets/evening.jpg";
    }

    return { timeOfDay, greeting, imageSrc };
  }, []);

  const fullName = getUserFullName(user);

  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
        <Image
          src={imageSrc}
          alt={timeOfDay}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 64px, 80px"
        />
      </div>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {greeting},<br />
          {fullName || "Người dùng"}
        </h1>
      </div>
    </div>
  );
}

