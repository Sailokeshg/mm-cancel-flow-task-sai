"use client";

import React, { useState } from "react";
import Image from "next/image";
import OptionButton from "./OptionButton";

type Props = {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
};

export default function JobFoundModal({ visible, onClose, onBack }: Props) {
  // ---- Stepper (3 steps total). You can expose setters later as needed.
  const TOTAL_STEPS = 3;
  const [step, setStep] = useState<number>(1);
  const goToStep = (n: number) =>
    setStep(Math.min(Math.max(n, 1), TOTAL_STEPS));

  // ---- Form state (Step 1)
  const [foundVia, setFoundVia] = useState<string | null>(null);
  const [appliedCount, setAppliedCount] = useState<string | null>(null);
  const [emailedCount, setEmailedCount] = useState<string | null>(null);
  const [interviewedCount, setInterviewedCount] = useState<string | null>(null);

  if (!visible) return null;

  const onContinue = () => {
    // For now, just advance step or finish on last step.
    if (step < TOTAL_STEPS) {
      goToStep(step + 1);
      return;
    }
    // Submit + close (replace with API later)
    console.log({
      step,
      foundVia,
      appliedCount,
      emailedCount,
      interviewedCount,
    });
    onClose();
  };

  // ---- Stepper UI
  const Stepper = () => (
    <div className="flex items-center gap-3">
      <span className="sr-only">Progress</span>
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
          const idx = i + 1;
          const isActive = idx <= step;
          return (
            <span
              key={idx}
              className={[
                "h-2 rounded-full transition-colors",
                // make the active step a bit longer to mimic Figma’s pill bars
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

  // ---- Content for Step 1 (per Figma)
  const StepOne = () => (
    <>
      <h2
        className="text-[28px] md:text-[34px] font-semibold text-gray-800 leading-snug"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Congrats on the new role! 🎉
      </h2>

      <div className="mt-7 space-y-6">
        {/* Q1 */}
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

        {/* Q2 */}
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

        {/* Q3 */}
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

        {/* Q4 */}
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

      {/* Divider + Continue */}
      <hr className="mt-6 mb-4 border-gray-200" />
      <button
        onClick={onContinue}
        disabled={!foundVia}
        className={[
          "w-full py-3.5 rounded-2xl font-semibold transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-offset-1",
          foundVia
            ? "bg-[#5D3AF7] text-white hover:bg-[#4F2FF3] focus:ring-[#C8B8FF]"
            : "bg-gray-100 text-gray-400 cursor-not-allowed",
        ].join(" ")}
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Continue
      </button>
    </>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-found-title"
    >
      <div className="w-full max-w-6xl mx-4 bg-white rounded-[24px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="w-full px-5 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          {/* Left: Back */}
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

          {/* Center: Title + Stepper */}
          <div className="flex items-center gap-4">
            <h3
              id="job-found-title"
              className="text-base md:text-lg font-semibold text-gray-900"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Subscription Cancellation
            </h3>
            <Stepper />
          </div>

          {/* Right: Close */}
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
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

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 p-6 md:p-10">
          {/* Left: content (Step 1 for now) */}
          <div className="max-w-[760px]">
            {step === 1 && <StepOne />}
            {/* You can add Step 2/3 content later and switch with `step === 2/3` */}
          </div>

          {/* Right: tall image card */}
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
    </div>
  );
}
