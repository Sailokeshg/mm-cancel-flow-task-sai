"use client";

import React, { useState } from "react";
import Image from "next/image";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DESKTOP_MIN_WIDTH_PX, FONT_DM_SANS_VAR } from "../../lib/ui/constants";
import OptionButton from "../buttons/OptionButton";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "../ui/MUIDrawer";
import SubscriptionOfferModal from "./SubscriptionOfferModal";
import CancellationReasonModal from "./CancellationReasonModal";
import CancellationFinalModal from "./CancellationFinalModal";

type Props = {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  onSubmit: (feedback: {
    appliedCount: string;
    emailedCount: string;
    interviewedCount: string;
  }) => void;
  onAcceptOffer?: () => void;
  onOfferModalShow?: () => void;
  onOfferModalClose?: () => void;
  onNextStep?: (reason: string) => void;
  step?: number;
  totalSteps?: number;
};

function CancellationSurveyModal({
  visible,
  onClose,
  onBack,
  onSubmit,
  onAcceptOffer,
  onOfferModalShow,
  onOfferModalClose,
  onNextStep,
  step = 2,
  totalSteps = 3,
}: Props) {
  // ======= Form state =======
  const [appliedCount, setAppliedCount] = useState<string | null>(null);
  const [emailedCount, setEmailedCount] = useState<string | null>(null);
  const [interviewedCount, setInterviewedCount] = useState<string | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [submittedReason, setSubmittedReason] = useState<string | null>(null);

  const isDesktop = useMediaQuery(`(min-width:${DESKTOP_MIN_WIDTH_PX}px)`);

  const isFormValid = Boolean(appliedCount && emailedCount && interviewedCount);

  if (!visible) return null;

  const handleContinue = () => {
    if (!isFormValid) return;
    onSubmit({
      appliedCount: appliedCount!,
      emailedCount: emailedCount!,
      interviewedCount: interviewedCount!,
    });
    setShowReasonModal(true);
  };

  const handleAcceptOffer = () => {
    setShowOfferModal(true);
    onOfferModalShow?.();
  };

  const handleOfferModalClose = () => {
    setShowOfferModal(false);
    onOfferModalClose?.();
  };

  const handleLandDreamRole = () => {
    setShowOfferModal(false);
    onAcceptOffer?.();
    onOfferModalClose?.();
  };

  const handleReasonSubmit = (reason: string) => {
    setSubmittedReason(reason);
    setShowReasonModal(false);
    setShowFinalModal(true);
  };

  const handleReasonBack = () => setShowReasonModal(false);

  const handleReasonAcceptOffer = () => onAcceptOffer?.();

  const handleFinalModalClose = () => {
    setShowFinalModal(false);
    if (submittedReason && onNextStep) onNextStep(submittedReason);
    setSubmittedReason(null);
    onClose();
  };

  // ======== Early returns for nested modals ========
  if (showReasonModal) {
    return (
      <CancellationReasonModal
        visible={showReasonModal}
        onClose={onClose}
        onBack={handleReasonBack}
        onSubmit={handleReasonSubmit}
        onAcceptOffer={handleReasonAcceptOffer}
        step={3}
        totalSteps={totalSteps}
      />
    );
  }

  if (showFinalModal) {
    return (
      <CancellationFinalModal
        visible={showFinalModal}
        onClose={handleFinalModalClose}
        totalSteps={totalSteps}
      />
    );
  }

  if (showOfferModal) {
    return (
      <SubscriptionOfferModal
        visible={showOfferModal}
        onClose={handleOfferModalClose}
        onLandDreamRole={handleLandDreamRole}
      />
    );
  }

  // ======= Stepper UI (left-aligned by default) =======
  const Stepper = () => (
    <div className="flex items-center justify-start gap-3">
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
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        Step {step} of {totalSteps}
      </span>
    </div>
  );

  // ======= Content (Desktop) =======
  const ContentDesktop = () => (
    <>
      <h2
        className="text-[28px] md:text-[34px] font-semibold text-gray-800 leading-snug"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        Help us understand how you were using Migrate Mate.
      </h2>

      <DesktopQuestions />

      <div className="mt-8">
        {/* Discount offer button */}
        <button
          onClick={handleAcceptOffer}
          className="w-full py-3.5 rounded-2xl font-semibold text-white bg-[#28B463] hover:bg-[#24A259] transition-colors flex items-center justify-center gap-2"
          style={{ fontFamily: FONT_DM_SANS_VAR }}
        >
          <span>Get 50% off</span>
          <span className="text-lg">|</span>
          <span className="text-lg font-bold">$12.50</span>
          <span className="text-sm line-through text-green-200 ml-1">$25</span>
        </button>

        {/* Continue button - desktop */}
        <button
          onClick={handleContinue}
          disabled={!isFormValid}
          className={[
            "hidden lg:block w-full mt-4 py-3.5 rounded-2xl font-semibold transition-colors",
            isFormValid
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed",
          ].join(" ")}
          style={{ fontFamily: FONT_DM_SANS_VAR }}
        >
          Continue
        </button>
      </div>
    </>
  );

  // ======= Content (Mobile — matches Figma) =======
  const ContentMobile = () => (
    <>
      <h2
        className="text-[28px] font-semibold text-gray-800 leading-snug"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        What’s the main reason for cancelling?
      </h2>

      {/* subtle divider under the heading, as in your screenshot */}
      <div className="mt-3 mb-4 h-px bg-gray-200" />

      <MobileQuestions />
    </>
  );

  // ======= Questions grid (shared helpers) =======
  function DesktopQuestions() {
    return (
      <div className="mt-6 space-y-6">
        <Question
          label="How many roles did you apply for through Migrate Mate?"
          options={["0", "1 - 5", "6 - 20", "20+"]}
          value={appliedCount}
          onChange={setAppliedCount}
        />
        <Question
          label={
            <>
              How many companies did you <u>email</u> directly?
            </>
          }
          options={["0", "1-5", "6-20", "20+"]}
          value={emailedCount}
          onChange={setEmailedCount}
        />
        <Question
          label={
            <>
              How many different companies did you <u>interview</u> with?
            </>
          }
          options={["0", "1-2", "3-5", "5+"]}
          value={interviewedCount}
          onChange={setInterviewedCount}
        />
      </div>
    );
  }

  function MobileQuestions() {
    return (
      <div className="mt-2 space-y-6">
        <Question
          label="How many roles did you apply for through Migrate Mate?"
          options={["0", "1 - 5", "6 - 20", "20+"]}
          value={appliedCount}
          onChange={setAppliedCount}
          mobile
        />
        <Question
          label={
            <>
              How many companies did you <u>email</u> directly?
            </>
          }
          options={["0", "1-5", "6-20", "20+"]}
          value={emailedCount}
          onChange={setEmailedCount}
          mobile
        />
        <Question
          label={
            <>
              How many different companies did you <u>interview</u> with?
            </>
          }
          options={["0", "1-2", "3-5", "5+"]}
          value={interviewedCount}
          onChange={setInterviewedCount}
          mobile
        />
      </div>
    );
  }

  function Question({
    label,
    options,
    value,
    onChange,
    mobile = false,
  }: {
    label: React.ReactNode;
    options: string[];
    value: string | null;
    onChange: (v: string) => void;
    mobile?: boolean;
  }) {
    return (
      <div>
        <p
          className="text-[15px] text-gray-700 mb-2"
          style={{ fontFamily: FONT_DM_SANS_VAR }}
        >
          {label}
        </p>
        <div
          className={[
            // Figma shows 4 across even on mobile
            mobile
              ? "grid grid-cols-4 gap-3"
              : "grid grid-cols-2 md:grid-cols-4 gap-3",
          ].join(" ")}
        >
          {options.map((val) => (
            <OptionButton
              key={val}
              label={val}
              active={value === val}
              onClick={() => onChange(val)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ======== Desktop dialog (MUI) ======== */}
      {isDesktop && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          role="dialog"
          aria-modal="true"
          aria-labelledby="survey-title"
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
                  style={{ fontFamily: FONT_DM_SANS_VAR }}
                >
                  Back
                </span>
              </button>

              <div className="flex items-center gap-4">
                <h3
                  id="survey-title"
                  className="text-base md:text-lg font-semibold text-gray-900"
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

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 p-6 md:p-10">
              <div className="max-w-[760px]">
                <ContentDesktop />
              </div>

              <div className="flex items-start justify-center">
                <div className="relative w-full h-[480px] md:h-[560px] rounded-3xl overflow-hidden shadow-md border border-gray-200">
                  <Image
                    src="/empire-state-compressed.jpg"
                    alt="New York City skyline with Empire State Building"
                    fill
                    className="object-cover"
                    priority
                    sizes={`(min-width:${DESKTOP_MIN_WIDTH_PX}px) 560px, 100vw`}
                  />
                </div>
              </div>
            </div>
          </ResponsiveDialog>
        </div>
      )}

      {/* ======== Mobile drawer (<1024px) ======== */}
      {!isDesktop && (
        <MUIDrawer
          open={visible}
          onClose={onClose}
          title="Subscription Cancellation"
          showGrabHandle
          headerContent={<Stepper />}
          backButton={{ onBack: onBack ? onBack : onClose, label: "Back" }}
          maxHeight="min(75dvh,75vh)"
          stickyFooter={
            <div className="space-y-3">
              <button
                onClick={handleAcceptOffer}
                className="w-full h-[56px] rounded-2xl font-semibold text-white bg-[#28B463] hover:bg-[#24A259] transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: FONT_DM_SANS_VAR }}
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
                  "w-full h-[56px] rounded-2xl font-semibold transition-colors",
                  isFormValid
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed",
                ].join(" ")}
                style={{ fontFamily: FONT_DM_SANS_VAR }}
              >
                Continue
              </button>
            </div>
          }
        >
          <ContentMobile />
        </MUIDrawer>
      )}
    </>
  );
}

export default React.memo(CancellationSurveyModal);
