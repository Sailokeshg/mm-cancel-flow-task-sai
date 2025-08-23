"use client";

import React from "react";

// ---- Reusable pill button
const OptionButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={!!active}
    className={[
      "w-full py-2 px-4 text-sm font-medium transition-all rounded-lg",
      "border",
      active
        ? "bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-sm"
        : "bg-[#F5F7FA] border-[#E7ECF2] text-gray-700 hover:bg-[#EEF2F7]",
    ].join(" ")}
    style={{ fontFamily: "var(--font-dm-sans)" }}
  >
    {label}
  </button>
);

export default OptionButton;
