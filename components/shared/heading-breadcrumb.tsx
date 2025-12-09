"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface HeadingBreadcrumbProps {
  items: {
    label: string;
    href?: string;
  }[];
  className?: string;
}

export function HeadingBreadcrumb({ items, className }: HeadingBreadcrumbProps) {
  return (
    <section className={cn("mb-6 md:mb-8", className)}>
      {/* Breadcrumb */}
      {items.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              return (
                <BreadcrumbItem key={item.label || index}>
                  {isLast || !item.href ? (
                    <BreadcrumbPage className="text-gray-500 text-sm">{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href} className="text-sm text-gray-500">
                      {item.label}
                    </BreadcrumbLink>
                  )}
                  {!isLast && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </section>
  );
}
