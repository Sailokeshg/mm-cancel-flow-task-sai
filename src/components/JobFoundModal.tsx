"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import OptionButton from "./OptionButton";
import CancellationFeedbackModal from "./CancellationFeedbackModal";
import CancellationVisaSupportModal from "./CancellationVisaSupportModel";
import CancellationCompletionModal from "./CancellationCompletionModal";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "./MUIDrawer";

type Props = {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
};

export default function JobFoundModal({ visible, onClose, onBack }: Props) {
  // ======= Steps (now 4 total to include completion) =======
  const TOTAL_STEPS = 4;
  const [step, setStep] = useState(1);
  const [foundVia, setFoundVia] = useState<string | null>(null);

  const goToStep = (n: number) =>
    setStep(Math.min(Math.max(n, 1), TOTAL_STEPS)); // Now handles 4 steps

  // ======= Form state (Step 1) =======
  const [appliedCount, setAppliedCount] = useState<string | null>(null);
  const [emailedCount, setEmailedCount] = useState<string | null>(null);
  const [interviewedCount, setInterviewedCount] = useState<string | null>(null);

  // Reset to step 1 and clear form when modal becomes visible
  useEffect(() => {
    if (visible) {
      setStep(1);
      setFoundVia(null);
      setAppliedCount(null);
      setEmailedCount(null);
      setInterviewedCount(null);
    }
  }, [visible]);

  // validity for step 1: require answers for all questions
  const isStepOneValid = Boolean(
    foundVia && appliedCount && emailedCount && interviewedCount
  );

  if (!visible) return null;

  // When the user advances to step 2, render the feedback modal only to avoid
  // stacking the JobFoundModal UI underneath it (causes the mobile overlap).
  if (step === 2) {
    return (
      <CancellationFeedbackModal
        visible={true}
        onBack={() => goToStep(1)}
        onClose={onClose}
        onSubmit={(feedback) => {
          console.log("cancellation feedback:", feedback);
          // Always go to step 3 (visa support) regardless of MigrateMate answer
          goToStep(3);
        }}
      />
    );
  }

  // When the user advances to step 3, render the visa support modal
  // Show visa support modal for both "Yes" and "No" answers, but with different text
  if (step === 3) {
    return (
      <CancellationVisaSupportModal
        visible={true}
        onBack={() => goToStep(2)}
        onClose={onClose}
        onComplete={(companyProvidesLawyer) => {
          console.log("Company provides lawyer:", companyProvidesLawyer);
          // Go to completion screen instead of closing
          goToStep(4);
        }}
        foundViaYes={foundVia === "yes"} // Pass this to customize the text content
        totalSteps={TOTAL_STEPS}
      />
    );
  }

  // When the user advances to step 4, render the completion modal
  if (step === 4) {
    return (
      <CancellationCompletionModal
        visible={true}
        onClose={onClose}
        totalSteps={TOTAL_STEPS}
      />
    );
  }

  const onContinue = () => {
    if (step === 1 && isStepOneValid) {
      goToStep(2); // Go to feedback modal
      return;
    }
    // Steps 2 and 3 are handled by their respective modals
  };

  // ======= Stepper UI =======
  const Stepper = () => (
    <div className="flex items-center gap-3">
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

      <div className="mt-6 space-y-6">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

      <div className="h-4" />
      {/* Divider + Continue (desktop) */}
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
      {/* ======== Desktop dialog (MUI) ======== */}
      <div className="hidden lg:block">
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          role="dialog"
          aria-modal="true"
          aria-labelledby="job-found-title"
          onClick={(e) => {
            // click outside closes
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
            {/* Desktop header: back (left), centered title+stepper, close (right) */}
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
      </div>

      {/* ======== Mobile drawer ======== */}
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
        stickyFooter={
          <button
            onClick={onContinue}
            disabled={!isStepOneValid}
            className={[
              "w-full py-3.5 rounded-2xl font-semibold transition-colors",
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
    </>
  );
}
