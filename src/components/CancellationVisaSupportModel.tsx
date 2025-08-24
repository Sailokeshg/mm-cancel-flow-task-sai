"use client";

import React, { useState } from "react";
import Image from "next/image";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DESKTOP_MIN_WIDTH_PX, FONT_DM_SANS_VAR } from "../lib/ui/constants";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "./MUIDrawer";

type Props = {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void; // go back to Step 2
  onComplete?: (companyProvidesLawyer: boolean) => void; // called when completed
  totalSteps?: number; // default 3
  foundViaYes?: boolean; // whether user found job via MigrateMate
};

function CancellationVisaSupportModal({
  visible,
  onClose,
  onBack,
  onComplete,
  totalSteps = 3,
  foundViaYes = true,
}: Props) {
  const isDesktop = useMediaQuery(`(min-width:${DESKTOP_MIN_WIDTH_PX}px)`);

  // ---- This screen is Step 3 of 3 ----
  const STEP_INDEX = 3;

  // Selection state
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [visaType, setVisaType] = useState<string>("");
  const isValid = answer !== null && visaType.trim().length > 0;

  if (!visible) return null;

  const handleComplete = () => {
    if (!isValid) return;
    if (onComplete && answer !== null) onComplete(answer);
  };

  // ======= Stepper UI (greens for progress like Figma) =======
  const Stepper = () => (
    <div className="flex items-center justify-start gap-3">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const idx = i + 1;
          const isDone = idx < STEP_INDEX;
          const isCurrent = idx === STEP_INDEX;
          return (
            <span
              key={idx}
              className={[
                "h-2 rounded-full transition-[width,background-color]",
                isCurrent ? "w-8" : "w-5",
                isDone ? "bg-green-500" : "bg-gray-300",
              ].join(" ")}
            />
          );
        })}
      </div>
      <span
        className="text-sm text-gray-600"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        Step {STEP_INDEX} of {totalSteps}
      </span>
    </div>
  );

  // ==== Left/main content (desktop body) ====
  const LeftContent = () => (
    <div className="max-w-[760px]">
      <h1
        className="text-4xl md:text-4xl font-semibold text-gray-800 leading-tight"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        {foundViaYes
          ? "We helped you land the job, now let’s help you secure your visa."
          : "You landed the job! That’s what we live for."}
      </h1>

      {/* one subtle divider per Figma */}
      <div className="mt-3 mb-4 h-px bg-gray-200" />

      <p
        className="text-gray-700 text-base md:text-[17px] leading-relaxed"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        Is your company providing an immigration lawyer to help with your visa?*
      </p>

      {/* Radio group */}
      <fieldset className="mt-4">
        <legend className="sr-only">Company provided immigration lawyer</legend>
        <div className="space-y-4">
          {answer !== false && (
            <label
              className="flex items-center gap-3 cursor-pointer"
              style={{ fontFamily: FONT_DM_SANS_VAR }}
            >
              <input
                type="radio"
                name="visa-lawyer"
                className="h-5 w-5 rounded-full border-gray-300 text-gray-900 focus:ring-gray-300"
                checked={answer === true}
                onChange={() => setAnswer(true)}
              />
              <span className="text-[16px] text-gray-800">Yes</span>
            </label>
          )}

          {answer !== true && (
            <label
              className="flex items-center gap-3 cursor-pointer"
              style={{ fontFamily: FONT_DM_SANS_VAR }}
            >
              <input
                type="radio"
                name="visa-lawyer"
                className="h-5 w-5 rounded-full border-gray-300 text-gray-900 focus:ring-gray-300"
                checked={answer === false}
                onChange={() => setAnswer(false)}
              />
              <span className="text-[16px] text-gray-800">No</span>
            </label>
          )}
        </div>
      </fieldset>

      {/* Additional text and visa input when No is selected */}
      {answer === false && (
        <div className="mt-6">
          <p
            className="text-gray-600 text-base md:text-[17px] leading-relaxed mb-4"
            style={{ fontFamily: FONT_DM_SANS_VAR }}
          >
            We can connect you with one of our trusted partners.
          </p>
          <label
            htmlFor="visa-type-no"
            className="block text-[16px] text-gray-800 mb-2"
            style={{ fontFamily: FONT_DM_SANS_VAR }}
          >
            Which visa would you like to apply for?*
          </label>
          <input
            id="visa-type-no"
            type="text"
            value={visaType}
            onChange={(e) => setVisaType(e.target.value)}
            className="w-full max-w-[560px] px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5D3AF7] focus:border-transparent"
            style={{ fontFamily: FONT_DM_SANS_VAR }}
          />
        </div>
      )}

      {/* Visa type input when Yes is selected */}
      {answer === true && (
        <div className="mt-6">
          <label
            htmlFor="visa-type-yes"
            className="block text-[16px] text-gray-800 mb-2"
            style={{ fontFamily: FONT_DM_SANS_VAR }}
          >
            What visa will you be applying for?*
          </label>
          <input
            id="visa-type-yes"
            type="text"
            value={visaType}
            minLength={2}
            onChange={(e) => {
              const val = e.target.value;
              if (val.length === 0 || val.length >= 2) {
                setVisaType(val);
              } else {
                setVisaType(val);
              }
            }}
            className="w-full max-w-[560px] px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5D3AF7] focus:border-transparent"
            style={{ fontFamily: FONT_DM_SANS_VAR }}
            required
            pattern=".{2,}"
            title="Please enter at least 2 characters"
          />
          {visaType.length > 0 && visaType.length < 2 && (
            <p
              className="text-red-500 text-sm mt-1"
              style={{ fontFamily: FONT_DM_SANS_VAR }}
            >
              Please enter at least 2 characters.
            </p>
          )}
        </div>
      )}

      {/* Divider + Complete (desktop) */}
      <hr className="hidden md:block my-6 border-gray-200" />
      <button
        onClick={handleComplete}
        disabled={!isValid}
        className={[
          "hidden md:block w-full max-w-[560px] py-4 rounded-2xl font-semibold transition-colors",
          isValid
            ? "bg-[#5D3AF7] text-white hover:bg-[#4F2FF3]"
            : "bg-gray-100 text-gray-400 cursor-not-allowed",
        ].join(" ")}
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        Complete cancellation
      </button>
    </div>
  );

  return (
    <>
      {/* ===== Desktop dialog (renders ONLY on desktop) ===== */}
      {isDesktop && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          role="dialog"
          aria-modal="true"
          aria-labelledby="visa-title"
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
              {/* Header with Back, Title + Stepper, Close */}
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
                    id="visa-title"
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

              {/* Body */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 p-6 md:p-10">
                <div className="max-w-[1000px]">
                  <LeftContent />
                </div>

                {/* Right image card */}
                <div className="flex items-start justify-center">
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl">
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
          </ResponsiveDialog>
        </div>
      )}

      {/* ===== Mobile drawer (renders on mobile/tablet) ===== */}
      {/* ===== Mobile drawer (renders on mobile/tablet) ===== */}
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
              onClick={handleComplete}
              disabled={!isValid}
              className={[
                "w-full h-[56px] rounded-2xl font-semibold transition-colors",
                isValid
                  ? "bg-[#5D3AF7] text-white hover:bg-[#4F2FF3]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed",
              ].join(" ")}
              style={{ fontFamily: FONT_DM_SANS_VAR }}
            >
              Complete cancellation
            </button>
          }
        >
          {/* Heading now matches desktop logic */}
          <h1
            className="text-[28px] font-semibold text-gray-800 leading-tight"
            style={{ fontFamily: FONT_DM_SANS_VAR }}
          >
            {foundViaYes
              ? "We helped you land the job, now let’s help you secure your visa."
              : "You landed the job! That’s what we live for."}
          </h1>

          {/* divider */}
          <div className="mt-3 mb-4 h-px bg-gray-200" />

          <p
            className="text-[16px] text-gray-700"
            style={{ fontFamily: FONT_DM_SANS_VAR }}
          >
            Is your company providing an immigration lawyer to help with your
            visa?*
          </p>

          <fieldset className="mt-4">
            <legend className="sr-only">
              Company provided immigration lawyer
            </legend>
            <div className="space-y-4">
              {answer !== false && (
                <label
                  className="flex items-center gap-3 cursor-pointer"
                  style={{ fontFamily: FONT_DM_SANS_VAR }}
                >
                  <input
                    type="radio"
                    name="visa-lawyer-mobile"
                    className="h-5 w-5 rounded-full border-gray-300 text-gray-900 focus:ring-gray-300"
                    checked={answer === true}
                    onChange={() => setAnswer(true)}
                  />
                  <span className="text-[16px] text-gray-800">Yes</span>
                </label>
              )}

              {answer !== true && (
                <label
                  className="flex items-center gap-3 cursor-pointer"
                  style={{ fontFamily: FONT_DM_SANS_VAR }}
                >
                  <input
                    type="radio"
                    name="visa-lawyer-mobile"
                    className="h-5 w-5 rounded-full border-gray-300 text-gray-900 focus:ring-gray-300"
                    checked={answer === false}
                    onChange={() => setAnswer(false)}
                  />
                  <span className="text-[16px] text-gray-800">No</span>
                </label>
              )}
            </div>
          </fieldset>

          {/* Visa input depending on selection */}
          {answer === false && (
            <div className="mt-4">
              <p
                className="text-[16px] text-gray-700 mb-4"
                style={{ fontFamily: FONT_DM_SANS_VAR }}
              >
                We can connect you with one of our trusted partners.
              </p>
              <label
                htmlFor="visa-type-mobile-no"
                className="block text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: FONT_DM_SANS_VAR }}
              >
                Which visa would you like to apply for?*
              </label>
              <input
                id="visa-type-mobile-no"
                type="text"
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5D3AF7] focus:border-transparent"
                style={{ fontFamily: FONT_DM_SANS_VAR }}
              />
            </div>
          )}

          {answer === true && (
            <div className="mt-4">
              <label
                htmlFor="visa-type-mobile"
                className="block text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: FONT_DM_SANS_VAR }}
              >
                What visa will you be applying for?*
              </label>
              <input
                id="visa-type-mobile"
                type="text"
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5D3AF7] focus:border-transparent"
                style={{ fontFamily: FONT_DM_SANS_VAR }}
              />
            </div>
          )}
        </MUIDrawer>
      )}
    </>
  );
}

export default React.memo(CancellationVisaSupportModal);
