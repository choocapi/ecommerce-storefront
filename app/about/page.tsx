"use client";

import { HeadManager } from "@/components/common/head-manager";

export default function AboutPage() {
  return (
    <>
      <HeadManager title="About Us" description="About Us" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            About Us
          </h1>
        </div>
      </div>
    </>
  );
}
