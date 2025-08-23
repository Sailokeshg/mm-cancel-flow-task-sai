"use client";

import React, { useState } from "react";
import Image from "next/image";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "./MUIDrawer";

type Props = {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  onSubmit?: (reason: string) => void;
  onAcceptOffer?: () => void; // For the discount offer
  step?: number;
  totalSteps?: number;
};

export default function CancellationReasonModal({
  visible,
  onClose,
  onBack,
  onSubmit,
  onAcceptOffer,
  step = 3,
  totalSteps = 3,
}: Props) {
  // ======= Form state =======
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState<string>("");

  // Check if a reason is selected and any conditional fields are valid
  const isFormValid = Boolean(
    selectedReason &&
      (selectedReason === "too-expensive"
        ? maxPrice.trim().length > 0
        : selectedReason === "platform-not-helpful"
        ? feedbackText.trim().length >= 25
        : true)
  );

  if (!visible) return null;

  const handleContinue = () => {
    if (isFormValid && onSubmit) {
      const reasonData =
        selectedReason === "too-expensive"
          ? `${selectedReason}:${maxPrice}`
          : selectedReason === "platform-not-helpful"
          ? `${selectedReason}:${feedbackText}`
          : selectedReason!;
      onSubmit(reasonData);
    }
  };

  const handleAcceptOffer = () => {
    if (onAcceptOffer) {
      onAcceptOffer();
    }
  };

  // ======= Stepper UI =======
  const Stepper = () => (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const idx = i + 1;
          const isCompleted = idx < step;
          const isCurrent = idx === step;
          return (
            <span
              key={idx}
              className={[
                "h-2 rounded-full transition-colors",
                isCurrent ? "w-6" : "w-5",
                isCompleted
                  ? "bg-green-500"
                  : isCurrent
                  ? "bg-gray-500"
                  : "bg-gray-300",
              ].join(" ")}
            />
          );
        })}
      </div>
      <span
        className="text-sm text-gray-600"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Step {step} of {totalSteps}
      </span>
    </div>
  );

  // ======= Radio button component =======
  const RadioOption = ({ value, label }: { value: string; label: string }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input
          type="radio"
          name="cancellation-reason"
          value={value}
          checked={selectedReason === value}
          onChange={() => setSelectedReason(value)}
          className="sr-only"
        />
        <div
          className={[
            "w-5 h-5 rounded-full border-2 transition-colors",
            selectedReason === value
              ? "border-gray-800 bg-gray-800"
              : "border-gray-300 group-hover:border-gray-400",
          ].join(" ")}
        >
          {selectedReason === value && (
            <div className="w-2 h-2 rounded-full bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          )}
        </div>
      </div>
      <span
        className="text-[15px] text-gray-700 group-hover:text-gray-900"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        {label}
      </span>
    </label>
  );

  // ======= Main content =======
  const Content = () => (
    <>
      <h2
        className="text-[36px] md:text-[36px] font-semibold text-gray-800 leading-snug"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        What&apos;s the main reason for cancelling?
      </h2>

      <p
        className="mt-1 text-[16px] text-gray-700"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Please take a minute to let us know why:
      </p>

      {/* Radio options; some reasons show only their option with conditional input */}
      {selectedReason !== "platform-not-helpful" &&
        selectedReason !== "too-expensive" && (
          <p
            className="mt-6 text-[15px] text-red-500"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            To help us understand your experience, please select a reason for
            cancelling*
          </p>
        )}

      {/* If platform-not-helpful selected, only show that option plus textarea */}
      {selectedReason === "platform-not-helpful" ? (
        <>
          <div className="mt-6 space-y-4">
            <RadioOption
              value="platform-not-helpful"
              label="Platform not helpful"
            />
          </div>

          <div className="mt-2">
            <p
              className="text-[15px] text-gray-700 "
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              What can we change to make the platform more helpful?*
            </p>

            {/* validation message moved to top-right under the question */}
            <div className=" flex justify-start">
              <p
                className={`text-sm ${
                  feedbackText.trim().length < 25
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {feedbackText.trim().length < 25
                  ? "Please enter at least 25 characters so we can understand your feedback*"
                  : ""}
              </p>
            </div>

            <div className="relative mt-3">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full h-40 p-4 pb-8 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-800 resize-none"
                style={{ fontFamily: "var(--font-dm-sans)" }}
                placeholder="Please enter at least 25 characters so we can understand your feedback"
              />

              <div className="absolute bottom-3 right-4">
                <p className="text-sm text-gray-500">
                  Min 25 characters ({feedbackText.trim().length}/25)
                </p>
              </div>
            </div>
          </div>
        </>
      ) : selectedReason === "too-expensive" ? (
        <>
          <div className="mt-6 space-y-4">
            <RadioOption value="too-expensive" label="Too expensive" />
          </div>

          {/* Conditional input for "too expensive" */}
          <div className="mt-6">
            <p
              className="text-[15px] text-gray-700 mb-3"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              What would be the maximum you would be willing to pay?*
            </p>
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-[15px]"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                $
              </span>
              <input
                type="text"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-800"
                style={{ fontFamily: "var(--font-dm-sans)" }}
                placeholder=""
              />
            </div>
          </div>
        </>
      ) : (
        <div className="mt-6 space-y-4">
          <RadioOption value="too-expensive" label="Too expensive" />
          <RadioOption
            value="platform-not-helpful"
            label="Platform not helpful"
          />
          <RadioOption
            value="not-enough-jobs"
            label="Not enough relevant jobs"
          />
          <RadioOption
            value="decided-not-to-move"
            label="Decided not to move"
          />
          <RadioOption value="other" label="Other" />
        </div>
      )}

      <div className="mt-8">
        {/* Discount offer button */}
        <button
          onClick={handleAcceptOffer}
          className="w-full py-3.5 rounded-2xl font-semibold text-white bg-[#28B463] hover:bg-[#24A259] transition-colors flex items-center justify-center gap-2"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          <span>Get 50% off</span>
          <span className="text-lg">|</span>
          <span className="text-lg font-bold">$12.50</span>
          <span className="text-sm line-through text-green-200 ml-1">$25</span>
        </button>

        {/* Continue button - show on desktop */}
        <button
          onClick={handleContinue}
          disabled={!isFormValid}
          className={[
            "hidden lg:block w-full mt-4 py-3.5 rounded-2xl font-semibold transition-colors",
            isFormValid
              ? "bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200"
              : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed",
          ].join(" ")}
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Complete cancellation
        </button>
      </div>
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
          aria-labelledby="reason-title"
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
                  id="reason-title"
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
              <div className="max-w-[760px]">
                <Content />
              </div>

              <div className="flex items-start justify-center">
                <div className="relative w-full h-[480px] md:h-[560px] rounded-3xl overflow-hidden shadow-md border border-gray-200">
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
          <div className="space-y-3">
            <button
              onClick={handleAcceptOffer}
              className="w-full py-3.5 rounded-2xl font-semibold text-white bg-[#28B463] hover:bg-[#24A259] transition-colors flex items-center justify-center gap-2"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              <span>Get 50% off</span>
              <span className="text-lg">|</span>
              <span className="text-lg font-bold">$12.50</span>
              <span className="text-sm line-through text-green-200 ml-1">
                $25
              </span>
            </button>
            <button
              onClick={handleContinue}
              disabled={!isFormValid}
              className={[
                "w-full py-3.5 rounded-2xl font-semibold transition-colors",
                isFormValid
                  ? "bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200"
                  : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed",
              ].join(" ")}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Complete cancellation
            </button>
          </div>
        }
      >
        <Content />
      </MUIDrawer>
    </>
  );
}
