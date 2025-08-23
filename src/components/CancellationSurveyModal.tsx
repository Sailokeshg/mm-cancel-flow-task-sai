"use client";

import React, { useState } from "react";
import Image from "next/image";
import OptionButton from "./OptionButton";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "./MUIDrawer";
import SubscriptionOfferModal from "./SubscriptionOfferModal";

type Props = {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  onSubmit: (feedback: {
    appliedCount: string;
    emailedCount: string;
    interviewedCount: string;
  }) => void;
  onAcceptOffer?: () => void; // For the discount offer
  onOfferModalShow?: () => void; // Callback when offer modal is shown
  onOfferModalClose?: () => void; // Callback when offer modal is closed
  step?: number;
  totalSteps?: number;
};

export default function CancellationSurveyModal({
  visible,
  onClose,
  onBack,
  onSubmit,
  onAcceptOffer,
  onOfferModalShow,
  onOfferModalClose,
  step = 2,
  totalSteps = 3,
}: Props) {
  // ======= Form state =======
  const [appliedCount, setAppliedCount] = useState<string | null>(null);
  const [emailedCount, setEmailedCount] = useState<string | null>(null);
  const [interviewedCount, setInterviewedCount] = useState<string | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);

  // Check if all questions are answered
  const isFormValid = Boolean(appliedCount && emailedCount && interviewedCount);

  if (!visible) return null;

  const handleContinue = () => {
    if (isFormValid) {
      onSubmit({
        appliedCount: appliedCount!,
        emailedCount: emailedCount!,
        interviewedCount: interviewedCount!,
      });
    }
  };

  const handleAcceptOffer = () => {
    setShowOfferModal(true);
    // Notify parent that offer modal is being shown so it can hide itself
    if (onOfferModalShow) {
      onOfferModalShow();
    }
  };

  const handleOfferModalClose = () => {
    setShowOfferModal(false);
    // Notify parent that offer modal is closed so it can show itself again
    if (onOfferModalClose) {
      onOfferModalClose();
    }
  };

  const handleLandDreamRole = () => {
    setShowOfferModal(false);
    if (onAcceptOffer) {
      onAcceptOffer();
    }
    // Also notify that offer modal is closed
    if (onOfferModalClose) {
      onOfferModalClose();
    }
  };

  // If the offer modal is showing, render it with proper z-index and hide the main modal
  if (showOfferModal) {
    return (
      <SubscriptionOfferModal
        visible={showOfferModal}
        onClose={handleOfferModalClose}
        onLandDreamRole={handleLandDreamRole}
      />
    );
  }

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

  // ======= Main content =======
  const Content = () => (
    <>
      <h2
        className="text-[28px] md:text-[34px] font-semibold text-gray-800 leading-snug"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Help us understand how you were using Migrate Mate.
      </h2>

      <div className="mt-6 space-y-6">
        <div>
          <p
            className="text-[15px] text-gray-700 mb-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            How many roles did you apply for through Migrate Mate?
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["0", "1 - 5", "6 - 20", "20+"].map((val) => (
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
            How many companies did you <u>email</u> directly?
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["0", "1-5", "6-20", "20+"].map((val) => (
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
            How many different companies did you <u>interview</u> with?
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["0", "1-2", "3-5", "5+"].map((val) => (
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
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed",
          ].join(" ")}
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Continue
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
          aria-labelledby="survey-title"
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
                  id="survey-title"
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
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed",
              ].join(" ")}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Continue
            </button>
          </div>
        }
      >
        <Content />
      </MUIDrawer>
    </>
  );
}
