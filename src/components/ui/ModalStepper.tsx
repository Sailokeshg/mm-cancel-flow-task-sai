"use client";

import React from "react";
import { FONT_DM_SANS_VAR } from "../../lib/ui/constants";

type Props = {
  totalSteps: number;
  stepIndex: number;
  /** optional override for font var */
  fontFamilyVar?: string;
};

function ModalStepper({ totalSteps, stepIndex, fontFamilyVar }: Props) {
  const fontVar = fontFamilyVar ?? FONT_DM_SANS_VAR;
  return (
    <div className="flex items-center justify-start gap-3">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const idx = i + 1;
          const isDoneOrCurrent = idx <= stepIndex;
          return (
            <span
              key={idx}
              className={[
                "h-2 rounded-full transition-[width,background-color]",
                idx === stepIndex ? "w-8" : "w-5",
                isDoneOrCurrent ? "bg-green-500" : "bg-gray-300",
              ].join(" ")}
            />
          );
        })}
      </div>
      <span className="text-sm text-gray-600" style={{ fontFamily: fontVar }}>
        Step {stepIndex} of {totalSteps}
      </span>
    </div>
  );
}

export default React.memo(ModalStepper);
