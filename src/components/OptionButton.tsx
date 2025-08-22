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
      "w-full py-2 px-4 text-sm font-medium transition-all",
      "border",
      active
        ? "bg-[#F6EEFF] border-[#E4D4FF] text-[#5D3AF7] shadow-[inset_0_0_0_1px_rgba(93,58,247,0.04)]"
        : "bg-[#F5F7FA] border-[#E7ECF2] text-gray-700 hover:bg-[#EEF2F7]",
    ].join(" ")}
    style={{ fontFamily: "var(--font-dm-sans)" }}
  >
    {label}
  </button>
);

export default OptionButton;
