"use client";

import Chatbot from "@/components/shared/chatbot/chatbot";
import Footer from "./footer";
import Header from "./header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white w-full">
      <Header />
      <main className="flex min-h-[calc(100vh-112px)] flex-col bg-white w-full pt-[112px]">
        <div className="flex-1 bg-white w-full">{children}</div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
