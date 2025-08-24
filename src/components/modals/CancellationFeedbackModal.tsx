"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import useMediaQuery from "@mui/material/useMediaQuery";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "../ui/MUIDrawer";
import ModalStepper from "../ui/ModalStepper";
import ModalHeader from "../ui/ModalHeader";
import PrimaryButton from "../buttons/PrimaryButton";
import { DESKTOP_MIN_WIDTH_PX, FONT_DM_SANS_VAR } from "../../lib/ui/constants";

type Props = {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void; // go back to Step 1
  onSubmit?: (feedback: string) => void; // called on Continue when valid
  totalSteps?: number; // default 3
};

/* ---------- Extracted: Stepper (stable identity) ---------- */
// Replaced by shared ModalStepper

/* ---------- Extracted: LeftContent (stable identity) ---------- */
function LeftContent({
  feedback,
  setFeedback,
  charCount,
  MIN,
  isValid,
  handleContinue,
}: {
  feedback: string;
  setFeedback: (s: string) => void;
  charCount: number;
  MIN: number;
  isValid: boolean;
  handleContinue: () => void;
}) {
  return (
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
      <PrimaryButton
        onClick={handleContinue}
        disabled={!isValid}
        className="hidden md:block"
      >
        Continue
      </PrimaryButton>
    </div>
  );
}

function CancellationFeedbackModal({
  visible,
  onClose,
  onBack,
  onSubmit,
  totalSteps = 3,
}: Props) {
  // Desktop breakpoint aligned with Tailwind `lg`
  const isDesktop = useMediaQuery(`(min-width:${DESKTOP_MIN_WIDTH_PX}px)`);

  // ---- This screen is Step 2 of 3 ----
  const STEP_INDEX = 2;

  // Feedback state
  const [feedback, setFeedback] = useState("");
  const charCount = feedback.trim().length;
  const MIN = 25;
  const isValid = charCount >= MIN;

  // Continue handler (stable reference is nice-to-have)
  const handleContinue = useCallback(() => {
    if (!isValid) return;
    if (onSubmit) {
      onSubmit(feedback.trim());
    } else {
      onClose();
    }
  }, [isValid, onSubmit, feedback, onClose]);

  if (!visible) return null;

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
              <div className="w-full px-5 md:px-6 py-4 border-b border-gray-200 relative">
                <ModalHeader
                  title={
                    <div className="flex items-center justify-center gap-4">
                      <span
                        className="text-base md:text-lg font-semibold text-gray-900"
                        style={{ fontFamily: FONT_DM_SANS_VAR }}
                      >
                        Subscription Cancellation
                      </span>
                      <ModalStepper
                        totalSteps={totalSteps}
                        stepIndex={STEP_INDEX}
                      />
                    </div>
                  }
                  onClose={onClose}
                  onBack={onBack}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 p-6 md:p-10">
                <div className="max-w-[1000px]">
                  <LeftContent
                    feedback={feedback}
                    setFeedback={setFeedback}
                    charCount={charCount}
                    MIN={MIN}
                    isValid={isValid}
                    handleContinue={handleContinue}
                  />
                </div>

                <div className="flex items-start justify-center">
                  <div className="relative w-full h-[480px] md:h-[560px] rounded-3xl overflow-hidden shadow-md border border-gray-200">
                    <Image
                      src="/empire-state-compressed.jpg"
                      alt="City skyline"
                      fill
                      className="object-cover"
                      priority
                      sizes={`(min-width:${DESKTOP_MIN_WIDTH_PX}px) 560px, 100vw`}
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
          headerContent={
            <ModalStepper totalSteps={totalSteps} stepIndex={STEP_INDEX} />
          }
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
              style={{ fontFamily: FONT_DM_SANS_VAR }}
            >
              Continue
            </button>
          }
        >
          {/* Mobile body — matches Figma */}
          <h1
            className="text-[28px] font-semibold text-gray-800 leading-tight"
            style={{ fontFamily: FONT_DM_SANS_VAR }}
          >
            What&apos;s one thing you wish we could&apos;ve helped you with?
          </h1>

          {/* subtle divider under headline */}
          <div className="mt-3 mb-4 h-px bg-gray-200" />

          <p
            className="text-[16px] text-gray-600"
            style={{ fontFamily: FONT_DM_SANS_VAR }}
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
                style={{ fontFamily: FONT_DM_SANS_VAR }}
              />
              <div
                className="absolute bottom-2 right-3 text-sm text-gray-500"
                style={{ fontFamily: FONT_DM_SANS_VAR }}
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

export default React.memo(CancellationFeedbackModal);
