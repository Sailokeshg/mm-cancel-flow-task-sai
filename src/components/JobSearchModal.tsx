"use client";

import React, { useState } from "react";
import Image from "next/image";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "./MUIDrawer";
import CancellationSurveyModal from "./CancellationSurveyModal";

type Props = {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  onAccept: () => void; // CTA: Get 50% off
  onDecline: () => void; // Ghost: No thanks
  step?: number; // optional external step control (defaults 1)
  totalSteps?: number; // optional (defaults 3)
};

export default function JobSearchModal({
  visible,
  onClose,
  onBack,
  onAccept,
  onDecline,
  step = 1,
  totalSteps = 3,
}: Props) {
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [hideForOfferModal, setHideForOfferModal] = useState(false);

  const handleDecline = () => {
    setShowSurveyModal(true);
  };

  const handleSurveySubmit = (feedback: {
    appliedCount: string;
    emailedCount: string;
    interviewedCount: string;
  }) => {
    console.log("Survey feedback:", feedback);
    setShowSurveyModal(false);
    onDecline(); // Call the original onDecline
  };

  const handleAcceptOffer = () => {
    setShowSurveyModal(false);
    onAccept(); // Call the original onAccept
  };

  const handleSurveyBack = () => {
    setShowSurveyModal(false);
  };

  const handleOfferModalShow = () => {
    setHideForOfferModal(true);
  };

  const handleOfferModalClose = () => {
    setHideForOfferModal(false);
  };

  if (!visible) return null;

  // If offer modal is being shown, only render the survey modal (which contains the offer modal)
  if (hideForOfferModal) {
    return (
      <CancellationSurveyModal
        visible={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        onBack={handleSurveyBack}
        onSubmit={handleSurveySubmit}
        onAcceptOffer={handleAcceptOffer}
        onOfferModalShow={handleOfferModalShow}
        onOfferModalClose={handleOfferModalClose}
        step={2}
        totalSteps={3}
      />
    );
  }

  // ===== Stepper =====
  const Stepper = () => (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
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
        Step {step} of {totalSteps}
      </span>
    </div>
  );

  // ===== Offer card =====
  const OfferCard = () => (
    <div className="rounded-2xl border border-[#C9B7FF] bg-[#EFE4FF]/70 p-4 md:p-5  justify-center shadow-sm">
      <h3
        className="text-[22px] md:text-[26px] font-semibold text-gray-900"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Here’s <u>50% off</u> until you find a job.
      </h3>

      <div className="mt-3 flex items-center justify-center gap-6">
        <div
          className="text-[22px] md:text-[24px] font-extrabold text-[#5D3AF7]"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          $12.50<span className="font-semibold">/month</span>
        </div>
        <div className="text-gray-500 line-through text-[16px] md:text-[18px]">
          $25 /month
        </div>
      </div>

      <button
        onClick={onAccept}
        className="mt-4 w-full py-3 rounded-2xl font-semibold text-white bg-[#28B463] hover:bg-[#24A259] transition-colors"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Get 50% off
      </button>

      <p
        className="mt-3 text-sm italic text-gray-600 text-center"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        You won’t be charged until your next billing date.
      </p>
    </div>
  );

  // ===== Left content =====
  const LeftContent = () => (
    <div className="max-w-[760px]">
      <h1
        className="text-[32px] md:text-[44px] font-semibold text-gray-800 leading-tight -mt-4"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        We built this to help you land the job, this makes it a little easier.
      </h1>

      <p
        className="mt-3 text-[18px] md:text-[22px] text-gray-600"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        We&apos;ve been there and we&apos;re here to help you.
      </p>

      <div className="mt-6">
        <OfferCard />
      </div>

      {/* Desktop ghost button */}
      <button
        onClick={handleDecline}
        className="hidden md:block mt-6 w-full py-3.5 rounded-2xl border border-gray-300 bg-white text-gray-800 font-semibold hover:bg-gray-50 transition-colors"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        No thanks
      </button>
    </div>
  );

  return (
    <>
      {/* ===== Desktop modal (MUI) ===== */}
      <div className="hidden lg:block">
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          role="dialog"
          aria-modal="true"
          aria-labelledby="offer-title"
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
              <div className="flex flex-col justify-center">
                <div className="max-w-[1000px]">
                  <LeftContent />
                </div>
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

      {/* ===== Mobile drawer ===== */}
      <MUIDrawer
        open={visible}
        onClose={onClose}
        title="Subscription Cancellation"
        headerContent={<Stepper />}
        backButton={{
          onBack: onBack ? onBack : onClose,
          label: "Back",
        }}
        stickyFooter={
          <button
            onClick={handleDecline}
            className="w-full py-3.5 rounded-2xl border border-gray-300 bg-white text-gray-800 font-semibold hover:bg-gray-50 transition-colors"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            No thanks
          </button>
        }
      >
        <h1
          className="text-[28px] font-semibold text-gray-800 leading-tight"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          We built this to help you land the job, this makes it a little easier.
        </h1>

        <p
          className="mt-3 text-[17px] text-gray-600"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          We&apos;ve been there and we&apos;re here to help you.
        </p>

        <div className="mt-6">
          <OfferCard />
        </div>
      </MUIDrawer>

      {/* Survey Modal */}
      <CancellationSurveyModal
        visible={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        onBack={handleSurveyBack}
        onSubmit={handleSurveySubmit}
        onAcceptOffer={handleAcceptOffer}
        onOfferModalShow={handleOfferModalShow}
        onOfferModalClose={handleOfferModalClose}
        step={2}
        totalSteps={3}
      />
    </>
  );
}
