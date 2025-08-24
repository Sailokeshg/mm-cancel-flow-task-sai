"use client";

import React from "react";
import Image from "next/image";
import { DESKTOP_MIN_WIDTH_PX, FONT_DM_SANS_VAR } from "../lib/ui/constants";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "./MUIDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";

type Props = {
  visible: boolean;
  onClose: () => void;
  totalSteps?: number; // default 3
  headline?: string;
  body?: string;
  imageUrl?: string;
};

function CancellationProcessedModal({
  visible,
  onClose,
  totalSteps = 3,
  headline = "All done, your cancellation’s been processed.",
  body = "We’re stoked to hear you’ve landed a job and sorted your visa. Big congrats from the team. 🙌",
  imageUrl = "/empire-state-compressed.jpg",
}: Props) {
  const isDesktop = useMediaQuery(`(min-width:${DESKTOP_MIN_WIDTH_PX}px)`);

  if (!visible) return null;

  const Stepper = () => (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            className="h-2 w-5 rounded-full bg-green-500 transition-colors"
          />
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

  const LeftContent = () => (
    <div className="max-w-[760px]">
      <h1
        className="text-4xl md:text-4xl font-semibold text-gray-800 leading-tight"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        {headline}
      </h1>

      <p
        className="mt-4 text-[18px] text-gray-700 leading-relaxed max-w-[620px]"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        {body}
      </p>

      <hr className="hidden md:block my-8 border-gray-200" />
      <button
        onClick={onClose}
        className="hidden md:block w-full max-w-[560px] py-4 rounded-2xl font-semibold bg-[#8B5CF6] text-white hover:bg-[#7C3AED] transition-colors"
        style={{ fontFamily: FONT_DM_SANS_VAR }}
      >
        Finish
      </button>
    </div>
  );

  return (
    <>
      {/* ===== Desktop (>=1024px) ===== */}
      {isDesktop && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          role="dialog"
          aria-modal="true"
          aria-labelledby="processed-title"
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
              {/* Header */}
              <div className="w-full px-5 md:px-6 py-4 border-b border-gray-200 flex items-center justify-center">
                <div className="flex items-center gap-4">
                  <h3
                    id="processed-title"
                    className="text-base md:text-lg font-semibold text-gray-900"
                    style={{ fontFamily: FONT_DM_SANS_VAR }}
                  >
                    Subscription Cancelled
                  </h3>
                  <Stepper />
                </div>

                <button
                  onClick={onClose}
                  className="absolute right-5 top-4 p-1.5 text-gray-400 hover:text-gray-600"
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
                <div className="flex flex-col justify-center">
                  <LeftContent />
                </div>

                <div className="flex items-start justify-center">
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl">
                    <Image
                      src={imageUrl}
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

      {/* ===== Mobile (<1024px) ===== */}
      {!isDesktop && (
        <MUIDrawer
          open={visible}
          onClose={onClose}
          title="Subscription Cancelled"
          showGrabHandle={false}
          headerContent={<Stepper />}
          stickyFooter={
            <button
              onClick={onClose}
              className="w-full h-[56px] rounded-2xl font-semibold bg-[#8B5CF6] text-white hover:bg-[#7C3AED] transition-colors"
              style={{ fontFamily: FONT_DM_SANS_VAR }}
            >
              Finish
            </button>
          }
        >
          {/* Image card on top */}
          <div className="mt-2 w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <div className="relative w-full aspect-[16/9] sm:aspect-[4/3]">
              <Image
                src={imageUrl}
                alt="City skyline"
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          <h1
            className="mt-5 text-[28px] font-semibold text-gray-800 leading-[1.2]"
            style={{ fontFamily: FONT_DM_SANS_VAR }}
          >
            {headline}
          </h1>

          <p
            className="mt-3 text-[16px] text-gray-700 leading-relaxed"
            style={{ fontFamily: FONT_DM_SANS_VAR }}
          >
            {body}
          </p>
        </MUIDrawer>
      )}
    </>
  );
}

export default React.memo(CancellationProcessedModal);
