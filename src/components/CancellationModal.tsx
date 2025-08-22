"use client";

import React, { useCallback, useEffect } from "react";
import Image from "next/image";

type Props = {
  visible: boolean;
  onClose: () => void;
  onJobFound: () => void;
  onStillLooking: () => void;
};

export default function CancellationModal({
  visible,
  onClose,
  onJobFound,
  onStillLooking,
}: Props) {
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  if (!visible) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-title"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-6xl mx-4 bg-white rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="w-full px-6 py-4 border-b border-gray-200 flex items-center justify-center">
          <h3
            id="cancel-title"
            className="text-lg font-semibold text-gray-900"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Subscription Cancellation
          </h3>

          <button
            onClick={onClose}
            className="absolute right-5 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
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
        </div>

        {/* Body: two columns under the header */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 p-6 md:p-10">
          {/* Left copy */}
          <div className="flex flex-col justify-center">
            <div className="max-w-[1000px]">
              <h1
                className="text-4xl md:text-4xl font-semibold text-gray-800 leading-tight -mt-4"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Hey mate,
                <br />
                Quick one before you go.
              </h1>

              <p
                className="text-4xl md:text-4xl font-semibold text-gray-800 mt-4"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Have you found a job yet?
              </p>

              <p
                className="text-gray-600 text-base md:text-[17px] leading-relaxed mt-4"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Whatever your answer, we just want to help you take the next
                step. With visa support, or by hearing how we can do better.
              </p>

              {/* light divider as in Figma */}
              <hr className="my-6 border-t border-gray-200" />

              {/* Buttons */}
              <div className="space-y-4">
                <button
                  onClick={onJobFound}
                  className="w-full max-w-[560px] py-4 rounded-2xl border border-gray-300 bg-white shadow-sm hover:shadow-md hover:border-gray-400 transition-all text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Yes, I&apos;ve found a job
                </button>

                <button
                  onClick={onStillLooking}
                  className="w-full max-w-[560px] py-4 rounded-2xl border border-gray-300 bg-white shadow-sm hover:shadow-md hover:border-gray-400 transition-all text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Not yet – I&apos;m still looking
                </button>
              </div>
            </div>
          </div>

          {/* Right: framed image card */}
          <div className="flex items-start justify-center">
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/empire-state-compressed.jpg"
                alt="New York City skyline with Empire State Building"
                fill
                className="object-cover"
                priority
                sizes="(min-width:1024px) 560px, 100vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
