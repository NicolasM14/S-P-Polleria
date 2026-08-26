import Image from "next/image";

import { siteConfig } from "@/config/site";
import { cn } from "@/shared/lib/utils";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

/** Anchos del logo completo (sin crop circular — el asset ya trae la marca). */
const sizeMap = {
  sm: { width: 148, height: 148, className: "h-14 w-14" },
  md: { width: 180, height: 180, className: "h-28 w-28" },
  lg: { width: 220, height: 220, className: "h-36 w-36" },
} as const;

export function BrandLogo({ className, size = "md" }: BrandLogoProps) {
  const dims = sizeMap[size];

  return (
    <div className={cn("relative shrink-0", dims.className, className)}>
      <Image
        src={siteConfig.logoPath}
        alt={siteConfig.name}
        width={dims.width}
        height={dims.height}
        className="h-full w-full object-contain"
        priority={size !== "sm"}
      />
    </div>
  );
}
