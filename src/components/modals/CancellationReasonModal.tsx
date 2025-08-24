"use client";

import React, { useState } from "react";
import Image from "next/image";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DESKTOP_MIN_WIDTH_PX, FONT_DM_SANS_VAR } from "../../lib/ui/constants";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "../ui/MUIDrawer";
import ModalStepper from "../ui/ModalStepper";
import ModalHeader from "../ui/ModalHeader";
import PrimaryButton from "../buttons/PrimaryButton";

type Props = {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  onSubmit?: (reason: string) => void;
  onAcceptOffer?: () => void;
  onShowFinalModal?: () => void;
  step?: number;
  totalSteps?: number;
};

function CancellationReasonModal({
  visible,
  onClose,
  onBack,
  onSubmit,
  onAcceptOffer,
  onShowFinalModal,
  step = 3,
  totalSteps = 3,
}: Props) {
  // State
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState<string>("");

  const isDesktop = useMediaQuery(`(min-width:${DESKTOP_MIN_WIDTH_PX}px)`);

  const isFormValid = Boolean(
    selectedReason &&
      (selectedReason === "too-expensive"
        ? maxPrice.trim().length > 0
        : selectedReason === "platform-not-helpful"
        ? feedbackText.trim().length >= 25
        : selectedReason === "not-enough-jobs"
        ? feedbackText.trim().length >= 25
        : selectedReason === "decided-not-to-move"
        ? feedbackText.trim().length >= 25
        : selectedReason === "other"
        ? feedbackText.trim().length >= 25
        : true)
  );

  if (!visible) return null;

  // Handlers
  const handleContinue = () => {
    if (!isFormValid || !onSubmit) return;

    const reasonData =
      selectedReason === "too-expensive"
        ? `${selectedReason}:${maxPrice}`
        : selectedReason === "platform-not-helpful"
        ? `${selectedReason}:${feedbackText}`
        : selectedReason === "not-enough-jobs"
        ? `${selectedReason}:${feedbackText}`
        : selectedReason === "decided-not-to-move"
        ? `${selectedReason}:${feedbackText}`
        : selectedReason === "other"
        ? `${selectedReason}:${feedbackText}`
        : selectedReason!;

    onSubmit(reasonData);
    onShowFinalModal?.();
  };

  const handleAcceptOffer = () => onAcceptOffer?.();

  // Use shared ModalStepper for step UI

  // Radio option
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
            <div className="w-2 h-2 rounded-full bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          )}
        </div>
      </div>
      <span
        className="text-[15px] text-gray-700 group-hover:text-gray-900"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        {label}
      </span>
    </label>
  );

  // Shared dynamic blocks (used by both desktop & mobile)
  const DynamicBlocks = () => {
    if (selectedReason === "platform-not-helpful") {
      return (
        <>
          <div className="mt-6 space-y-4">
            <RadioOption
              value="platform-not-helpful"
              label="Platform not helpful"
            />
          </div>

          <div className="mt-2">
            <p
              className="text-[15px] text-gray-700"
              style={{ fontFamily: FONT_DM_SANS_VAR }}
            >
              What can we change to make the platform more helpful?*
            </p>

            <div className="flex justify-start">
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
                style={{ fontFamily: FONT_DM_SANS_VAR }}
              />
              <div className="absolute bottom-3 right-4">
                <p className="text-sm text-gray-500">
                  Min 25 characters ({feedbackText.trim().length}/25)
                </p>
              </div>
            </div>
          </div>
        </>
      );
    }

    if (selectedReason === "not-enough-jobs") {
      return (
        <>
          <div className="mt-6 space-y-4">
            <RadioOption
              value="not-enough-jobs"
              label="Not enough relevant jobs"
            />
          </div>

          <div className="mt-2">
            <p
              className="text-[15px] text-gray-700"
              style={{ fontFamily: FONT_DM_SANS_VAR }}
            >
              In which way can we make the jobs more relevant?*
            </p>

            <div className="relative mt-3">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full h-40 p-4 pb-8 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-800 resize-none"
                style={{ fontFamily: FONT_DM_SANS_VAR }}
              />
              <div className="absolute bottom-3 right-4">
                <p className="text-sm text-gray-500">
                  Min 25 characters ({feedbackText.trim().length}/25)
                </p>
              </div>
            </div>
          </div>
        </>
      );
    }

    if (selectedReason === "decided-not-to-move") {
      return (
        <>
          <div className="mt-6 space-y-4">
            <RadioOption
              value="decided-not-to-move"
              label="Decided not to move"
            />
          </div>

          <div className="mt-2">
            <p
              className="text-[15px] text-gray-700"
              style={{ fontFamily: FONT_DM_SANS_VAR }}
            >
              What changed for you to decide to not move?*
            </p>

            <div className="relative mt-3">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full h-40 p-4 pb-8 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-800 resize-none"
                style={{ fontFamily: FONT_DM_SANS_VAR }}
              />
              <div className="absolute bottom-3 right-4">
                <p className="text-sm text-gray-500">
                  Min 25 characters ({feedbackText.trim().length}/25)
                </p>
              </div>
            </div>
          </div>
        </>
      );
    }

    if (selectedReason === "too-expensive") {
      return (
        <>
          <div className="mt-6 space-y-4">
            <RadioOption value="too-expensive" label="Too expensive" />
          </div>

          <div className="mt-6">
            <p
              className="text-[15px] text-gray-700 mb-3"
              style={{ fontFamily: FONT_DM_SANS_VAR }}
            >
              What would be the maximum you would be willing to pay?*
            </p>
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-[15px]"
                style={{ fontFamily: FONT_DM_SANS_VAR }}
              >
                $
              </span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-800"
                style={{ fontFamily: FONT_DM_SANS_VAR }}
              />
            </div>
          </div>
        </>
      );
    }

    if (selectedReason === "other") {
      return (
        <>
          <div className="mt-6 space-y-4">
            <RadioOption value="other" label="Other" />
          </div>

          <div className="mt-2">
            <p
              className="text-[15px] text-gray-700"
              style={{ fontFamily: FONT_DM_SANS_VAR }}
            >
              What would have helped you the most?*
            </p>

            <div className="relative mt-3">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full h-40 p-4 pb-8 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-800 resize-none"
                style={{ fontFamily: FONT_DM_SANS_VAR }}
              />
              <div className="absolute bottom-3 right-4">
                <p className="text-sm text-gray-500">
                  Min 25 characters ({feedbackText.trim().length}/25)
                </p>
              </div>
            </div>
          </div>
        </>
      );
    }

    // initial list
    return (
      <div className="mt-6 space-y-4">
        <RadioOption value="too-expensive" label="Too expensive" />
        <RadioOption
          value="platform-not-helpful"
          label="Platform not helpful"
        />
        <RadioOption value="not-enough-jobs" label="Not enough relevant jobs" />
        <RadioOption value="decided-not-to-move" label="Decided not to move" />
        <RadioOption value="other" label="Other" />
      </div>
    );
  };

  // Desktop content
  const ContentDesktop = () => (
    <>
      <h2
        className="text-[36px] font-semibold text-gray-800 leading-snug"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        What&apos;s the main reason for cancelling?
      </h2>

      <p
        className="mt-1 text-[16px] text-gray-700"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        Please take a minute to let us know why:
      </p>

      {/* initial validation message shown on desktop when none picked */}
      {!selectedReason && (
        <p
          className="mt-6 text-[15px] text-red-500"
          style={{ fontFamily: FONT_DM_SANS_VAR }}
        >
          To help us understand your experience, please select a reason for
          cancelling*
        </p>
      )}

      <DynamicBlocks />

      <div className="mt-8">
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

        <button
          onClick={handleContinue}
          disabled={!isFormValid}
          className={[
            "hidden lg:block w-full mt-4 py-3.5 rounded-2xl font-semibold transition-colors",
            isFormValid
              ? "bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200"
              : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed",
          ].join(" ")}
          style={{ fontFamily: FONT_DM_SANS_VAR }}
        >
          Complete cancellation
        </button>
      </div>
    </>
  );

  // Mobile content
  const ContentMobile = () => (
    <>
      <h2
        className="text-[28px] font-semibold text-gray-800 leading-snug"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        What’s the main reason for cancelling?
      </h2>

      <p
        className="mt-1 text-[15px] text-gray-700"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        Please take a minute to let us know why:
      </p>

      {/* thin divider */}
      <div className="mt-3 mb-3 h-px bg-gray-200" />

      {/* red validation note until a reason is chosen */}
      {!selectedReason && (
        <p
          className="text-[15px] text-red-500"
          style={{ fontFamily: FONT_DM_SANS_VAR }}
        >
          To help us understand your experience, please select a reason for
          cancelling*
        </p>
      )}

      <DynamicBlocks />
    </>
  );

  return (
    <>
      {/* Desktop (>=1024px) */}
      {isDesktop && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reason-title"
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
              <ModalHeader
                title={
                  <div className="flex items-center gap-4">
                    <span
                      className="text-base md:text-lg font-semibold text-gray-900"
                      style={{ fontFamily: FONT_DM_SANS_VAR }}
                    >
                      Subscription Cancellation
                    </span>
                    <ModalStepper totalSteps={totalSteps} stepIndex={step} />
                  </div>
                }
                onClose={onClose}
                onBack={onBack ? onBack : undefined}
              />
            }
          >
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
                    sizes="(min-width:1024px) 560px, 100vw"
                  />
                </div>
              </div>
            </div>
          </ResponsiveDialog>
        </div>
      )}

      {/* Mobile (<1024px) */}
      {!isDesktop && (
        <MUIDrawer
          open={visible}
          onClose={onClose}
          title="Subscription Cancellation"
          showGrabHandle={false}
          headerContent={
            <ModalStepper totalSteps={totalSteps} stepIndex={step} />
          }
          backButton={{ onBack: onBack ? onBack : onClose, label: "Back" }}
          maxHeight="min(75dvh,75vh)"
          stickyFooter={
            <div className="mt-8">
              <PrimaryButton onClick={handleAcceptOffer} variant="success">
                <span>Get 50% off</span>
                <span className="text-lg">|</span>
                <span className="text-lg font-bold">$12.50</span>
                <span className="text-sm line-through text-green-200 ml-1">
                  $25
                </span>
              </PrimaryButton>

              <button
                onClick={handleContinue}
                disabled={!isFormValid}
                className={[
                  "w-full mt-4 py-3.5 rounded-2xl font-semibold transition-colors",
                  isFormValid
                    ? "bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200"
                    : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed",
                ].join(" ")}
                style={{ fontFamily: FONT_DM_SANS_VAR }}
              >
                Complete cancellation
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

export default React.memo(CancellationReasonModal);
