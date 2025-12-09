"use client";

import type React from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
