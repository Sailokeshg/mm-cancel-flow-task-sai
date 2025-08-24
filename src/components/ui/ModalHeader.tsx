"use client";

import React from "react";
import { FONT_DM_SANS_VAR } from "../../lib/ui/constants";

type Props = {
  title?: React.ReactNode;
  onClose?: () => void;
  onBack?: () => void;
  backLabel?: string;
};

function ModalHeader({ title, onClose, onBack, backLabel = "Back" }: Props) {
  return (
    <div className="w-full flex items-center justify-between">
      <div>
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            aria-label="Back"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm" style={{ fontFamily: FONT_DM_SANS_VAR }}>
              {backLabel}
            </span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {typeof title === "string" ? (
          <h3
            className="text-base md:text-lg font-semibold text-gray-900"
            style={{ fontFamily: FONT_DM_SANS_VAR }}
          >
            {title}
          </h3>
        ) : (
          title
        )}
      </div>

      <div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default React.memo(ModalHeader);
