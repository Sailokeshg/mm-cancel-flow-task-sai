"use client";

import React from "react";
import { FONT_DM_SANS_VAR } from "../lib/ui/constants";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "success";
};

function PrimaryButton({
  children,
  variant = "primary",
  className = "",
  disabled,
  ...rest
}: Props) {
  const base = "w-full py-3.5 rounded-2xl font-semibold transition-colors";
  const variantClass =
    variant === "primary"
      ? "bg-[#5D3AF7] text-white hover:bg-[#4F2FF3]"
      : variant === "success"
      ? "bg-[#28B463] text-white hover:bg-[#24A259]"
      : "bg-white text-gray-800 border border-gray-300 hover:shadow-md";

  // Respect disabled prop visually and by cursor
  const isDisabled = Boolean(disabled);
  const disabledClass = isDisabled
    ? "opacity-60 cursor-not-allowed pointer-events-none hover:bg-none hover:shadow-none"
    : "";

  return (
    <button
      {...rest}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={[base, variantClass, disabledClass, className].join(" ")}
      style={{ fontFamily: FONT_DM_SANS_VAR }}
    >
      {children}
    </button>
  );
}

export default React.memo(PrimaryButton);
