"use client";

import React from "react";
import Image from "next/image";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "./MUIDrawer";

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
  if (!visible) return null;

  return (
    <>
      {/* ===== Desktop dialog (MUI) ===== */}
      <div className="hidden lg:block">
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <ResponsiveDialog
            open={visible}
            onClose={onClose}
            maxWidth="lg"
            fullWidth={true}
            paperSx={{ borderRadius: 6 }}
          >
            <div className="relative">
              {/* Header: centered title with absolute close button (restores previous layout) */}
              <div className="w-full px-6 py-4 border-b border-gray-200 flex items-center justify-center">
                <h3
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

              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 p-6 md:p-10">
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
                      <em>Have you found a job yet?</em>
                    </p>

                    <p
                      className="text-gray-600 text-base md:text-[17px] leading-relaxed mt-4"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      Whatever your answer, we just want to help you take the next
                      step. With visa support, or by hearing how we can do better.
                    </p>

                    <hr className="my-6 border-t border-gray-200" />

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
          </ResponsiveDialog>
        </div>
      </div>

      {/* ===== Mobile drawer ===== */}
      <MUIDrawer
        open={visible}
        onClose={onClose}
        title="Subscription Cancellation"
        showGrabHandle={true}
      >
        {/* Image */}
        <div className="mt-4 w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200">
          <div className="relative w-full aspect-[16/9] sm:aspect-[4/3]">
            <Image
              src="/empire-state-compressed.jpg"
              alt="New York City skyline with Empire State Building"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </div>

        {/* Text */}
        <h1
          className="text-[28px] font-semibold text-gray-800 leading-tight mt-5"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Hey mate,
          <br />
          Quick one before you go.
        </h1>

        <p
          className="text-[26px] font-semibold text-gray-800 mt-3 italic"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Have you found a job yet?
        </p>

        <p
          className="text-gray-600 text-[15px] leading-relaxed mt-3"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Whatever your answer, we just want to help you take the next step.
          With visa support, or by hearing how we can do better.
        </p>

        <hr className="my-5 border-t border-gray-200" />

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={onJobFound}
            className="w-full py-4 rounded-2xl border border-gray-300 bg-white shadow-sm hover:shadow-md hover:border-gray-400 transition-all text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Yes, I&apos;ve found a job
          </button>

          <button
            onClick={onStillLooking}
            className="w-full py-4 rounded-2xl border border-gray-300 bg-white shadow-sm hover:shadow-md hover:border-gray-400 transition-all text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Not yet – I&apos;m still looking
          </button>
        </div>
      </MUIDrawer>
    </>
  );
}
