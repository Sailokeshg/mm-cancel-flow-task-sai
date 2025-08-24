"use client";

import React, { useState } from "react";
import Image from "next/image";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DESKTOP_MIN_WIDTH_PX, FONT_DM_SANS_VAR } from "../lib/ui/constants";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "./MUIDrawer";
import CancellationSurveyModal from "./CancellationSurveyModal";

type Props = {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  onAccept: () => void;
  onDecline: () => void;
  step?: number;
  totalSteps?: number;
};

function JobSearchModal({
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

  const isDesktop = useMediaQuery(`(min-width:${DESKTOP_MIN_WIDTH_PX}px)`);

  const handleDecline = () => setShowSurveyModal(true);
  const handleSurveySubmit = (feedback: {
    appliedCount: string;
    emailedCount: string;
    interviewedCount: string;
  }) => {
    console.log("Survey feedback:", feedback);
  };
  const handleNextStep = (reason: string) => {
    console.log("Cancellation reason:", reason);
    // persist a cancellation draft with reason (user declined downsell)
    fetch("/api/cancellations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription_id: "550e8400-e29b-41d4-a716-446655440001",
        reason,
        accepted: false,
        accepted_downsell: false,
      }),
    }).catch((e) => console.error("persist reason failed", e));

    setShowSurveyModal(false);
    onDecline();
  };
  const handleAcceptOffer = () => {
    setShowSurveyModal(false);
    onAccept();
  };
  const handleSurveyBack = () => setShowSurveyModal(false);
  const handleOfferModalShow = () => setHideForOfferModal(true);
  const handleOfferModalClose = () => setHideForOfferModal(false);

  if (!visible) return null;

  // When the nested offer flow is active render only the survey modal (it contains its own offer step).
  if (hideForOfferModal) {
    return (
      <CancellationSurveyModal
        visible={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        onBack={handleSurveyBack}
        onSubmit={handleSurveySubmit}
        onNextStep={handleNextStep}
        onAcceptOffer={handleAcceptOffer}
        onOfferModalShow={handleOfferModalShow}
        onOfferModalClose={handleOfferModalClose}
        step={2}
        totalSteps={3}
      />
    );
  }

  const Stepper = () => (
    <div className="flex items-center justify-start gap-3">
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
                isActive ? "bg-gray-400" : "bg-gray-200",
              ].join(" ")}
            />
          );
        })}
      </div>
      <span
        className="text-sm text-gray-600"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        Step {step} of {totalSteps}
      </span>
    </div>
  );

  const OfferCard = () => (
    <div className="rounded-[20px] border border-[#C9B7FF] bg-[#EFE4FF]/70 p-4 md:p-5 shadow-sm">
      <h3
        className="text-[26px] md:text-[28px] font-semibold text-gray-900 leading-[1.15]"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        Here’s <u>50% off</u> until you find a job.
      </h3>

      <div className=" flex items-center justify-center gap-5">
        <div
          className="text-[26px] md:text-[28px] font-extrabold text-[#5D3AF7]"
          style={{ fontFamily: FONT_DM_SANS_VAR }}
        >
          $12.50<span className="font-semibold">/month</span>
        </div>
        <div className="text-gray-500 line-through text-[18px] md:text-[20px]">
          $25/month
        </div>
      </div>

      <button
        onClick={onAccept}
        className="mt-5 w-full h-[56px] rounded-2xl font-semibold text-white bg-[#28B463] hover:bg-[#24A259] transition-colors"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        Get 50% off
      </button>

      <p className=" text-[15px] italic text-gray-600 text-center" style={{ fontFamily: FONT_DM_SANS_VAR }}>
        You won’t be charged until your next billing date.
      </p>
    </div>
  );

  const LeftContent = () => (
    <div className="max-w-[760px]">
      <h1
        className="text-[44px] font-semibold text-gray-800 leading-[1.1] "
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        We built this to help you land the job, this makes it a little easier.
      </h1>

      <p
        className="mt-3 text-[20px] text-gray-600"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        We&apos;ve been there and we&apos;re here to help you.
      </p>

      <div className="mt-6">
        <OfferCard />
      </div>

      <button
        onClick={handleDecline}
        className="hidden md:block mt-6 w-full h-[56px] rounded-2xl border border-gray-300 bg-white text-gray-800 font-semibold hover:bg-gray-50 transition-colors"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        No thanks
      </button>
    </div>
  );

  return (
    <>
  {/* Desktop (>=1024px): Dialog */}
      {isDesktop && (
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
            desktopOnly
            title={
              <div className="flex items-center justify-between w-full">
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
                  <span className="text-sm" style={{ fontFamily: FONT_DM_SANS_VAR }}>
                    Back
                  </span>
                </button>
                <div className="flex items-center gap-4">
                  <h3
                    id="offer-title"
                    className="text-lg font-semibold text-gray-900"
                    style={{ fontFamily: FONT_DM_SANS_VAR }}
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
            }
          >
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
      )}

  {/* Mobile (<1024px): Bottom sheet */}
      {!isDesktop && (
        <MUIDrawer
          open={visible}
          onClose={onClose}
          title="Subscription Cancellation"
          headerContent={<Stepper />}
          backButton={{ onBack: onBack ? onBack : onClose, label: "Back" }}
          stickyFooter={
            <button
              onClick={handleDecline}
              className="w-full h-[56px] rounded-2xl border border-gray-300 bg-white text-gray-800 font-semibold hover:bg-gray-50 transition-colors"
              style={{ fontFamily: FONT_DM_SANS_VAR }}
            >
              No thanks
            </button>
          }
          maxHeight="min(75dvh,75vh)"
        >
          <h1
            className="text-[32px] font-semibold text-gray-800 leading-[1.15]"
            style={{ fontFamily: FONT_DM_SANS_VAR }}
          >
            We built this to help you land the job, this makes it a little
            easier.
          </h1>
          <p
            className="mt-3 text-[17px] text-gray-600"
            style={{ fontFamily: FONT_DM_SANS_VAR }}
          >
            We&apos;ve been there and we&apos;re here to help you.
          </p>
          <div className="mt-6">
            <OfferCard />
          </div>
        </MUIDrawer>
      )}

      {/* -------- Survey Modal (follow-up step) -------- */}
      <CancellationSurveyModal
        visible={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        onBack={handleSurveyBack}
        onSubmit={handleSurveySubmit}
        onNextStep={handleNextStep}
        onAcceptOffer={handleAcceptOffer}
        onOfferModalShow={handleOfferModalShow}
        onOfferModalClose={handleOfferModalClose}
        step={2}
        totalSteps={3}
      />
    </>
  );
}

export default React.memo(JobSearchModal);
