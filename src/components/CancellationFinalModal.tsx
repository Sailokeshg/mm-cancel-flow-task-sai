"use client";

import React from "react";
import Image from "next/image";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "./MUIDrawer";

type Props = {
  visible: boolean;
  onClose: () => void;
  totalSteps?: number; // default 3
};

export default function CancellationFinalModal({
  visible,
  onClose,
  totalSteps = 3,
}: Props) {
  if (!visible) return null;

  // ======= Stepper UI (all steps completed) =======
  const Stepper = () => (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const idx = i + 1;
          return (
            <span
              key={idx}
              className="h-2 w-5 rounded-full bg-green-500 transition-colors"
            />
          );
        })}
      </div>
      <span
        className="text-sm text-gray-600"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Completed
      </span>
    </div>
  );

  // ======= Main content component =======
  const Content = () => (
    <>
      <h1
        className="text-4xl md:text-4xl font-semibold text-gray-800 leading-tight"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Sorry to see you go, mate.
      </h1>

      <h2
        className="text-base md:text-[17px] font-semibold text-gray-800 leading-relaxed mt-4"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Thanks for being with us, and you&apos;re always welcome back.
      </h2>

      <div className="mt-6 space-y-3">
        <p
          className="text-[15px] text-gray-700 leading-relaxed"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Your subscription is set to end on XX date.
          <br />
          You&apos;ll still have full access until then. No further charges
          after that.
        </p>

        <p
          className="text-[15px] text-gray-600 leading-relaxed"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Changed your mind? You can reactivate anytime before your end date.
        </p>
      </div>

      <button
        onClick={onClose}
        className="w-full max-w-[560px] py-4 rounded-2xl font-semibold bg-[#5D3AF7] text-white hover:bg-[#4F2FF3] transition-colors mt-6"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Back to Jobs
      </button>
    </>
  );

  return (
    <>
      {/* ===== Desktop modal (MUI) ===== */}
      <div className="hidden lg:block">
        <div
          className="fixed inset-0 z-[10] flex items-center justify-center bg-black/50"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="final-completion-title"
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
              {/* Header: back (left), centered title+stepper, close (right) */}
              <div className="w-full px-5 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <button
                  onClick={onClose}
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
                  <span
                    className="text-sm"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Back
                  </span>
                </button>

                <div className="flex items-center gap-4">
                  <h3
                    id="final-completion-title"
                    className="text-base md:text-lg font-semibold text-gray-900"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Subscription Cancelled
                  </h3>
                  <Stepper />
                </div>

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
              </div>

              {/* Main content grid */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 p-6 md:p-10">
                <div className="flex flex-col justify-center">
                  <div className="max-w-[1000px]">
                    <Content />
                  </div>
                </div>

                {/* Empire State Building image */}
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
        title="Subscription Cancelled"
        showGrabHandle={false}
        headerContent={<Stepper />}
        stickyFooter={
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl font-semibold bg-[#5D3AF7] text-white hover:bg-[#4F2FF3] transition-colors"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Back to Jobs
          </button>
        }
      >
        <div className="px-4">
          <Content />
        </div>
      </MUIDrawer>
    </>
  );
}
