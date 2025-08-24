"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import useMediaQuery from "@mui/material/useMediaQuery";
import OptionButton from "./OptionButton";
import CancellationFeedbackModal from "./CancellationFeedbackModal";
import CancellationVisaSupportModal from "./CancellationVisaSupportModel";
import CancellationProcessedModal from "./CancellationProcessedModal";
import CancellationCompletionModal from "./CancellationCompletionModal";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "./MUIDrawer";

type Props = {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
};

export default function JobFoundModal({ visible, onClose, onBack }: Props) {
  // Desktop breakpoint aligned with Tailwind `lg`
  const isDesktop = useMediaQuery("(min-width:1024px)");

  // ======= Steps (3 total as per Figma) =======
  const TOTAL_STEPS = 3;
  const [step, setStep] = useState(1);
  const [foundVia, setFoundVia] = useState<string | null>(null);

  // ======= Completion flow state =======
  const [showProcessedModal, setShowProcessedModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const goToStep = (n: number) =>
    setStep(Math.min(Math.max(n, 1), TOTAL_STEPS));

  // ======= Form state (Step 1) =======
  const [appliedCount, setAppliedCount] = useState<string | null>(null);
  const [emailedCount, setEmailedCount] = useState<string | null>(null);
  const [interviewedCount, setInterviewedCount] = useState<string | null>(null);

  // Reset on open
  useEffect(() => {
    if (visible) {
      setStep(1);
      setFoundVia(null);
      setAppliedCount(null);
      setEmailedCount(null);
      setInterviewedCount(null);
      setShowProcessedModal(false);
      setShowCompletionModal(false);
    }
  }, [visible]);

  const isStepOneValid = Boolean(
    foundVia && appliedCount && emailedCount && interviewedCount
  );

  if (!visible) return null;

  // Step 2 & 3 are separate modals (to avoid stacking UI underneath)
  if (step === 2) {
    return (
      <CancellationFeedbackModal
        visible
        onBack={() => goToStep(1)}
        onClose={onClose}
        onSubmit={() => {
          goToStep(3);
        }}
        totalSteps={TOTAL_STEPS}
      />
    );
  }

  // Show completion modals after visa support step
  if (showProcessedModal) {
    return (
      <CancellationProcessedModal
        visible
        onClose={() => {
          // Reset all states before closing
          setShowProcessedModal(false);
          setShowCompletionModal(false);
          setStep(1);
          setFoundVia(null);
          setAppliedCount(null);
          setEmailedCount(null);
          setInterviewedCount(null);
          onClose();
        }}
        totalSteps={TOTAL_STEPS}
      />
    );
  }

  if (showCompletionModal) {
    return (
      <CancellationCompletionModal
        visible
        onClose={() => {
          // Reset all states before closing
          setShowProcessedModal(false);
          setShowCompletionModal(false);
          setStep(1);
          setFoundVia(null);
          setAppliedCount(null);
          setEmailedCount(null);
          setInterviewedCount(null);
          onClose();
        }}
        totalSteps={TOTAL_STEPS}
      />
    );
  }

  if (step === 3) {
    return (
      <CancellationVisaSupportModal
        visible
        onBack={() => goToStep(2)}
        onClose={onClose}
        onComplete={async (companyProvidesLawyer: boolean) => {
          // Persist cancellation to backend for dev (uses mock user + seeded subscription)
          try {
            await fetch("/api/cancellations", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                // TODO: replace with real subscription id when available
                subscription_id: "550e8400-e29b-41d4-a716-446655440001",
                reason: null,
                accepted: true,
                accepted_downsell: false,
              }),
            });
          } catch (e) {
            console.error("Failed to persist cancellation", e);
          }

          if (companyProvidesLawyer) {
            setShowProcessedModal(true);
          } else {
            setShowCompletionModal(true);
          }
        }}
        foundViaYes={foundVia === "yes"}
        totalSteps={TOTAL_STEPS}
      />
    );
  }

  const onContinue = () => {
    if (step === 1 && isStepOneValid) goToStep(2);
  };

  // ======= Stepper =======
  const Stepper = () => (
    <div className="flex items-center justify-start gap-3">
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
          const idx = i + 1;
          const isActive = idx <= step;
          return (
            <span
              key={idx}
              className={[
                "h-2 rounded-full transition-colors",
                idx === step ? "w-6" : "w-5",
                isActive ? "bg-gray-500" : "bg-gray-300",
              ].join(" ")}
            />
          );
        })}
      </div>
      <span
        className="text-sm text-gray-600"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Step {step} of {TOTAL_STEPS}
      </span>
    </div>
  );

  // ======= Step 1 content =======
  const StepOne = () => (
    <>
      <h2
        className="text-[28px] md:text-[34px] font-semibold text-gray-800 leading-snug"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Congrats on the new role! 🎉
      </h2>

      {/* subtle divider per Figma */}
      <div className="mt-3 mb-4 h-px bg-gray-200" />

      <div className="space-y-6">
        <div>
          <p
            className="text-[15px] text-gray-700 mb-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Did you find this job with MigrateMate?*
          </p>
          <div className="grid grid-cols-2 gap-4">
            <OptionButton
              label="Yes"
              active={foundVia === "yes"}
              onClick={() => setFoundVia("yes")}
            />
            <OptionButton
              label="No"
              active={foundVia === "no"}
              onClick={() => setFoundVia("no")}
            />
          </div>
        </div>

        <div>
          <p
            className="text-[15px] text-gray-700 mb-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            How many roles did you <u>apply</u> for through Migrate Mate?*
          </p>
          {/* 4 pills per row on mobile per Figma */}
          <div className="grid grid-cols-4 gap-3">
            {["0", "1–5", "6–20", "20+"].map((val) => (
              <OptionButton
                key={val}
                label={val}
                active={appliedCount === val}
                onClick={() => setAppliedCount(val)}
              />
            ))}
          </div>
        </div>

        <div>
          <p
            className="text-[15px] text-gray-700 mb-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            How many companies did you <u>email</u> directly?*
          </p>
          <div className="grid grid-cols-4 gap-3">
            {["0", "1–5", "6–20", "20+"].map((val) => (
              <OptionButton
                key={val}
                label={val}
                active={emailedCount === val}
                onClick={() => setEmailedCount(val)}
              />
            ))}
          </div>
        </div>

        <div>
          <p
            className="text-[15px] text-gray-700 mb-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            How many different companies did you <u>interview</u> with?*
          </p>
          <div className="grid grid-cols-4 gap-3">
            {["0", "1–2", "3–5", "5+"].map((val) => (
              <OptionButton
                key={val}
                label={val}
                active={interviewedCount === val}
                onClick={() => setInterviewedCount(val)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop divider + button */}
      <hr className="hidden lg:block mt-6 mb-4 border-gray-200" />
      <button
        onClick={onContinue}
        disabled={!isStepOneValid}
        className={[
          "hidden lg:block w-full py-3.5 rounded-2xl font-semibold transition-colors",
          isStepOneValid
            ? "bg-[#5D3AF7] text-white hover:bg-[#4F2FF3]"
            : "bg-gray-100 text-gray-400 cursor-not-allowed",
        ].join(" ")}
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Continue
      </button>
    </>
  );

  return (
    <>
      {/* ======== Desktop dialog (renders ONLY on desktop) ======== */}
      {isDesktop && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          role="dialog"
          aria-modal="true"
          aria-labelledby="job-found-title"
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
            {/* Desktop header */}
            <div className="w-full px-5 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <button
                onClick={() => (onBack ? onBack() : onClose())}
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
                  className="text-base md:text-lg font-semibold text-gray-900"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Subscription Cancellation
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

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 p-6 md:p-10">
              <div className="max-w-[760px]">{step === 1 && <StepOne />}</div>

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
          </ResponsiveDialog>
        </div>
      )}

      {/* ======== Mobile drawer (renders on mobile/tablet) ======== */}
      {!isDesktop && (
        <MUIDrawer
          open={visible}
          onClose={onClose}
          title="Subscription Cancellation"
          showGrabHandle={false}
          headerContent={<Stepper />}
          backButton={{ onBack: onBack ? onBack : onClose, label: "Back" }}
          maxHeight="min(75dvh,75vh)"
          stickyFooter={
            <button
              onClick={onContinue}
              disabled={!isStepOneValid}
              className={[
                "w-full h-[56px] rounded-2xl font-semibold transition-colors",
                isStepOneValid
                  ? "bg-[#5D3AF7] text-white hover:bg-[#4F2FF3]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed",
              ].join(" ")}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Continue
            </button>
          }
        >
          {step === 1 && <StepOne />}
        </MUIDrawer>
      )}
    </>
  );
}
