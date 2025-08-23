"use client";

import React, { useState } from "react";
import Image from "next/image";
import useMediaQuery from "@mui/material/useMediaQuery";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "./MUIDrawer";

type Props = {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void; // go back to Step 1
  onSubmit?: (feedback: string) => void; // called on Continue when valid
  totalSteps?: number; // default 3
};

export default function CancellationFeedbackModal({
  visible,
  onClose,
  onBack,
  onSubmit,
  totalSteps = 3,
}: Props) {
  // Desktop breakpoint aligned with Tailwind `lg`
  const isDesktop = useMediaQuery("(min-width:1024px)");

  // ---- This screen is Step 2 of 3 ----
  const STEP_INDEX = 2;

  // Feedback state
  const [feedback, setFeedback] = useState("");
  const charCount = feedback.trim().length;
  const MIN = 25;
  const isValid = charCount >= MIN;

  if (!visible) return null;

  // Continue handler
  const handleContinue = () => {
    if (!isValid) return;
    if (onSubmit) {
      onSubmit(feedback.trim());
    } else {
      onClose();
    }
  };

  // ======= Stepper UI (left‑aligned) =======
  const Stepper = () => (
    <div className="flex items-center justify-start gap-3">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const idx = i + 1;
          const isDoneOrCurrent = idx <= STEP_INDEX;
          return (
            <span
              key={idx}
              className={[
                "h-2 rounded-full transition-[width,background-color]",
                idx === STEP_INDEX ? "w-8" : "w-5",
                isDoneOrCurrent ? "bg-green-500" : "bg-gray-300",
              ].join(" ")}
            />
          );
        })}
      </div>
      <span
        className="text-sm text-gray-600"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Step {STEP_INDEX} of {totalSteps}
      </span>
    </div>
  );

  // ==== Shared left content (desktop body) ====
  const LeftContent = () => (
    <div className="max-w-[760px]">
      <h1
        className="text-[32px] md:text-[42px] font-semibold text-gray-800 leading-tight"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        What’s one thing you wish we could’ve helped you with?
      </h1>

      <p
        className="mt-4 text-[16px] md:text-[18px] text-gray-600 max-w-[560px]"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        We’re always looking to improve, your thoughts can help us make Migrate
        Mate more useful for others.*
      </p>

      {/* Textarea + counter */}
      <div className="mt-5">
        <div className="relative">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder=""
            className="w-full h-40 md:h-48 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 p-4 text-gray-800 placeholder-gray-400"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          />
          <div
            className="absolute bottom-2 right-3 text-sm text-gray-500"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Min {MIN} characters ({charCount}/{MIN})
          </div>
        </div>
      </div>

      {/* Desktop divider + Continue */}
      <hr className="hidden md:block mt-6 mb-4 border-gray-200" />
      <button
        onClick={handleContinue}
        disabled={!isValid}
        className={[
          "hidden md:block w-full py-3.5 rounded-2xl font-semibold transition-colors",
          isValid
            ? "bg-[#5D3AF7] text-white hover:bg-[#4F2FF3]"
            : "bg-gray-100 text-gray-400 cursor-not-allowed",
        ].join(" ")}
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Continue
      </button>
    </div>
  );

  return (
    <>
      {/* ===== Desktop dialog (renders ONLY on desktop) ===== */}
      {isDesktop && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <ResponsiveDialog
            open={visible}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            paperSx={{ borderRadius: 6 }}
          >
            <div className="relative">
              <div className="w-full px-5 md:px-6 py-4 border-b border-gray-200">
                <button
                  onClick={() => (onBack ? onBack() : onClose())}
                  className="absolute left-4 top-4 flex items-center gap-2 text-gray-700 hover:text-gray-900"
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

                <div className="flex items-center justify-center gap-4">
                  <h3
                    id="feedback-title"
                    className="text-base md:text-lg font-semibold text-gray-900"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Subscription Cancellation
                  </h3>
                  <Stepper />
                </div>

                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
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

              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 p-6 md:p-10">
                <div className="max-w-[1000px]">
                  <LeftContent />
                </div>

                <div className="flex items-start justify-center">
                  <div className="relative w-full h-[480px] md:h-[560px] rounded-3xl overflow-hidden shadow-md border border-gray-200">
                    <Image
                      src="/empire-state-compressed.jpg"
                      alt="City skyline"
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
      )}

      {/* ===== Mobile drawer (renders on mobile/tablet) ===== */}
      {!isDesktop && (
        <MUIDrawer
          open={visible}
          onClose={onClose}
          title="Subscription Cancellation"
          showGrabHandle={false}
          headerContent={<Stepper />}
          backButton={{
            onBack: onBack ? onBack : onClose,
            label: "Back",
          }}
          maxHeight="min(75dvh,75vh)"
          stickyFooter={
            <button
              onClick={handleContinue}
              disabled={!isValid}
              className={[
                "w-full h-[56px] rounded-2xl font-semibold transition-colors",
                isValid
                  ? "bg-[#5D3AF7] text-white hover:bg-[#4F2FF3]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed",
              ].join(" ")}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Continue
            </button>
          }
        >
          {/* Mobile body — matches Figma */}
          <h1
            className="text-[28px] font-semibold text-gray-800 leading-tight"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            What&apos;s one thing you wish we could&apos;ve helped you with?
          </h1>

          {/* subtle divider under headline */}
          <div className="mt-3 mb-4 h-px bg-gray-200" />

          <p
            className="text-[16px] text-gray-600"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            We&apos;re always looking to improve, your thoughts can help us make
            Migrate Mate more useful for others.*
          </p>

          <div className="mt-5">
            <div className="relative">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full h-48 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 p-4 text-gray-800"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              />
              <div
                className="absolute bottom-2 right-3 text-sm text-gray-500"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Min {MIN} characters ({charCount}/{MIN})
              </div>
            </div>
          </div>
        </MUIDrawer>
      )}
    </>
  );
}
