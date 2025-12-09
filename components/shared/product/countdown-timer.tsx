"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  endTime?: number; // milliseconds timestamp, default: 24 hours from now
  className?: string;
}

export default function CountdownTimer({ endTime, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Default: 24 hours from now if endTime not provided
    const targetTime = endTime || new Date().getTime() + 24 * 60 * 60 * 1000;

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance > 0) {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className={`flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200 shadow-md ${className || ""}`}>
      <Clock className="w-4 h-4 text-primary" />
      <span className="text-gray-500 text-sm font-medium">Kết thúc sau:</span>
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center bg-primary/10 rounded-lg px-3 py-1 min-w-[50px]">
          <span className="text-primary font-bold text-lg leading-none">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="text-gray-500 text-xs">Giờ</span>
        </div>
        <span className="text-primary font-bold text-lg">:</span>
        <div className="flex flex-col items-center bg-primary/10 rounded-lg px-3 py-1 min-w-[50px]">
          <span className="text-primary font-bold text-lg leading-none">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="text-gray-500 text-xs">Phút</span>
        </div>
        <span className="text-primary font-bold text-lg">:</span>
        <div className="flex flex-col items-center bg-primary/10 rounded-lg px-3 py-1 min-w-[50px]">
          <span className="text-primary font-bold text-lg leading-none">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="text-gray-500 text-xs">Giây</span>
        </div>
      </div>
    </div>
  );
}

