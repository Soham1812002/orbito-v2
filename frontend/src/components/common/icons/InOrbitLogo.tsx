import React from "react";
import { InOrbitMark } from "./InOrbitMark";

export interface InOrbitLogoProps {
  collapsed?: boolean;
  className?: string;
}

export const InOrbitLogo: React.FC<InOrbitLogoProps> = ({
  collapsed = false,
  className = ""
}) => {
  if (collapsed) {
    return <InOrbitMark size={36} className={className} />;
  }

  return (
    <div className={`flex items-center gap-2.5 overflow-hidden select-none ${className}`}>
      <InOrbitMark size={36} />
      <div className="flex items-center gap-1.5">
        <div className="flex items-baseline tracking-tight">
          <span className="text-xl font-extrabold text-white">in</span>
          <span className="text-xl font-black text-[#2563EB]">O</span>
          <span className="text-xl font-extrabold text-white">rbit</span>
        </div>
        <span className="badge-cyan">
          fleet
        </span>
      </div>
    </div>
  );
};
