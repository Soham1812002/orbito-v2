import React from "react";

export interface InOrbitMarkProps {
  className?: string;
  size?: number;
}

export const InOrbitMark: React.FC<InOrbitMarkProps> = ({
  className = "",
  size = 38
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="12" fill="#2563EB" />
      <circle cx="20" cy="20" r="11" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.4" />
      <circle cx="20" cy="20" r="6" fill="#FFFFFF" />
      <ellipse
        cx="20"
        cy="20"
        rx="15"
        ry="6"
        transform="rotate(-30 20 20)"
        stroke="#95F8FF"
        strokeWidth="2"
      />
      <circle cx="31" cy="14" r="2.2" fill="#95F8FF" />
    </svg>
  );
};
