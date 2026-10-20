import React from "react";
import { LucideIcon } from "lucide-react";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | number;

export type IconComponentType =
  | LucideIcon
  | React.ComponentType<{ className?: string; size?: number | string }>;

export interface AppIconProps {
  icon: IconComponentType;
  size?: IconSize;
  className?: string;
  ariaLabel?: string;
  title?: string;
}

const sizeMap: Record<string, number> = {
  xs: 14,
  sm: 16,
  md: 18, // Standard Figma icon size (18x18)
  lg: 20,
  xl: 24
};

export const AppIcon: React.FC<AppIconProps> = ({
  icon: IconComponent,
  size = "md",
  className = "",
  ariaLabel,
  title
}) => {
  const pixelSize = typeof size === "number" ? size : sizeMap[size] || 18;
  const isInteractive = Boolean(ariaLabel || title);

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center"
      role={isInteractive ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={isInteractive ? undefined : "true"}
      title={title}
    >
      <IconComponent
        size={pixelSize}
        className={`transition-colors duration-150 ${className}`}
      />
    </span>
  );
};
