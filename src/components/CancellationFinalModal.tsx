"use client";

import React from "react";
import Image from "next/image";
import useMediaQuery from "@mui/material/useMediaQuery";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "./MUIDrawer";
import { DESKTOP_MIN_WIDTH_PX, FONT_DM_SANS_VAR } from "../lib/ui/constants";

type Props = {
  visible: boolean;
  onClose: () => void;
  totalSteps?: number; // default 3
};

function CancellationFinalModal({ visible, onClose, totalSteps = 3 }: Props) {
  const isDesktop = useMediaQuery(`(min-width:${DESKTOP_MIN_WIDTH_PX}px)`);

  if (!visible) return null;

  // Stepper (all steps complete)
  const Stepper = () => (
    <div className="flex items-center justify-start gap-3">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span key={i} className="h-2 w-5 rounded-full bg-green-500" />
        ))}
      </div>
      <span
        className="text-sm text-gray-600"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        Completed
      </span>
    </div>
  );

  // Desktop content
  const ContentDesktop = () => (
    <>
      <h1
        className="text-4xl font-semibold text-gray-800 leading-tight"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        Sorry to see you go, mate.
      </h1>

      <h2
        className="text-base md:text-[17px] font-semibold text-gray-800 leading-relaxed mt-4"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        Thanks for being with us, and you&apos;re always welcome back.
      </h2>

      <div className="mt-6 space-y-3">
        <p
          className="text-[15px] text-gray-700 leading-relaxed"
          style={{ fontFamily: FONT_DM_SANS_VAR }}
        >
          Your subscription is set to end on XX date.
          <br />
          You&apos;ll still have full access until then. No further charges
          after that.
        </p>

        <p
          className="text-[15px] text-gray-600 leading-relaxed"
          style={{ fontFamily: FONT_DM_SANS_VAR }}
        >
          Changed your mind? You can reactivate anytime before your end date.
        </p>
      </div>

      <button
        onClick={onClose}
        className="w-full max-w-[560px] py-4 rounded-2xl font-semibold bg-[#5D3AF7] text-white hover:bg-[#4F2FF3] transition-colors mt-6"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        Back to Jobs
      </button>
    </>
  );

  // Mobile content
  const ContentMobile = () => (
    <>
      {/* Image card */}
      <div className="mt-2 w-full rounded-2xl overflow-hidden shadow-[0_6px_18px_rgba(0,0,0,0.08)] border border-gray-200">
        <div className="relative w-full aspect-[16/9] sm:aspect-[4/3]">
          <Image
            src="/empire-state-compressed.jpg"
            alt="New York City skyline with Empire State Building"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Headings + copy */}
      <h1
        className="text-[32px] font-semibold text-gray-800 leading-[1.15] mt-5"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        Sorry to see you go, mate.
      </h1>

      <h2
        className="text-[18px] font-semibold text-gray-800 leading-relaxed mt-3"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        Thanks for being with us, and you’re always welcome back.
      </h2>

      <div className="mt-5 space-y-3">
        <p
          className="text-[15px] text-gray-700 leading-relaxed"
          style={{ fontFamily: FONT_DM_SANS_VAR }}
        >
          Your subscription is set to end on XX date. You’ll still have full
          access until then. No further charges after that.
        </p>

        <p
          className="text-[15px] text-gray-600 leading-relaxed"
          style={{ fontFamily: FONT_DM_SANS_VAR }}
        >
          Changed your mind? You can reactivate anytime before your end date.
        </p>
      </div>
    </>
  );

  return (
    <>
  {/* Desktop dialog */}
      {isDesktop && (
        <div
          className="fixed inset-0 z-[10] flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="final-completion-title"
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
              <div className="w-full flex items-center justify-between">
                <button
                  onClick={onClose}
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
                    id="final-completion-title"
                    className="text-base md:text-lg font-semibold text-gray-900"
                    style={{ fontFamily: FONT_DM_SANS_VAR }}
                  >
                    Subscription Cancelled
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
                  <ContentDesktop />
                </div>
              </div>

              <div className="flex items-start justify-center">
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl">
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

  {/* Mobile drawer */}
      {!isDesktop && (
        <MUIDrawer
          open={visible}
          onClose={onClose}
          title="Subscription Cancelled"
          showGrabHandle={false}
          headerContent={<Stepper />}
          /* no back button on final step, just the X */
          maxHeight="min(75dvh,75vh)"
          stickyFooter={
            <button
              onClick={onClose}
              className="w-full h-[56px] rounded-2xl font-semibold bg-[#5D3AF7] text-white hover:bg-[#4F2FF3] transition-colors"
              style={{ fontFamily: FONT_DM_SANS_VAR }}
            >
              Back to Jobs
            </button>
          }
        >
          <ContentMobile />
        </MUIDrawer>
      )}
    </>
  );
}

export default React.memo(CancellationFinalModal);
