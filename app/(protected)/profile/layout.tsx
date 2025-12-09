"use client";

import GreetingSection from "@/components/shared/profile/greeting-section";
import ProfileSidebar from "@/components/shared/profile/profile-sidebar";
import type React from "react";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-2 md:px-3 lg:px-4 py-8">
      <GreetingSection />
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-72 shrink-0">
          <ProfileSidebar />
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
