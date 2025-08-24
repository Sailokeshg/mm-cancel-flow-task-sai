"use client";

import React from "react";
import Image from "next/image";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DESKTOP_MIN_WIDTH_PX, FONT_DM_SANS_VAR } from "../../lib/ui/constants";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "../ui/MUIDrawer";

type Props = {
  visible: boolean;
  onClose: () => void;
  onLandDreamRole: () => void;
};

function SubscriptionOfferModal({ visible, onClose, onLandDreamRole }: Props) {
  const isDesktop = useMediaQuery(`(min-width:${DESKTOP_MIN_WIDTH_PX}px)`);

  if (!visible) return null;

  return (
    <>
      {/* ===== Desktop dialog (>=1024px) ===== */}
      {isDesktop && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="subscription-title"
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
              <div className="w-full flex items-center justify-center relative">
                <h3
                  id="subscription-title"
                  className="text-lg font-semibold text-gray-900"
                  style={{ fontFamily: FONT_DM_SANS_VAR }}
                >
                  Subscription Continued
                </h3>
                <button
                  onClick={onClose}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
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
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
              {/* Left: copy + CTA */}
              <div className="flex flex-col justify-center p-6 md:pl-10 md:pr-6 md:py-8">
                <div className="max-w-[1000px]">
                  <h1
                    className="text-4xl font-semibold text-gray-800 leading-tight -mt-4"
                    style={{ fontFamily: FONT_DM_SANS_VAR }}
                  >
                    Great choice, mate!
                  </h1>

                  <p
                    className="text-4xl font-semibold text-gray-800 mt-3"
                    style={{ fontFamily: FONT_DM_SANS_VAR }}
                  >
                    You&apos;re still on the path to your dream role.{" "}
                    <span className="text-[#8B5CF6]">
                      Let&apos;s make it happen together!
                    </span>
                  </p>

                  <div
                    className="text-gray-600 text-base md:text-[17px] leading-relaxed mt-4 space-y-1"
                    style={{ fontFamily: FONT_DM_SANS_VAR }}
                  >
                    <p>You&apos;ve got XX days left on your current plan.</p>
                    <p>
                      Starting from XX date, your monthly payment will be
                      $12.50.
                    </p>
                  </div>

                  <p
                    className="text-gray-500 text-sm md:text-[15px] italic mt-3"
                    style={{ fontFamily: FONT_DM_SANS_VAR }}
                  >
                    You can cancel anytime before then.
                  </p>

                  <div className="mt-6">
                    <button
                      onClick={onLandDreamRole}
                      className="w-full h-[56px] rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-offset-2"
                      style={{ fontFamily: FONT_DM_SANS_VAR }}
                    >
                      Land your dream role
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: image */}
              <div className="flex items-center justify-center p-6 md:py-8 md:pl-0 md:pr-2">
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src="/empire-state-compressed.jpg"
                    alt="New York City skyline with Empire State Building"
                    fill
                    className="object-cover"
                    priority
                    sizes="(min-width:1024px) 450px, 100vw"
                  />
                </div>
              </div>
            </div>
          </ResponsiveDialog>
        </div>
      )}

      {/* ===== Mobile drawer (<1024px) ===== */}
      {!isDesktop && (
        <div style={{ zIndex: 60 }}>
          <MUIDrawer
            open={visible}
            onClose={onClose}
            title="Subscription Continued"
            showGrabHandle
            maxHeight="min(75dvh,75vh)"
            /* Figma shows the big purple CTA pinned near bottom */
            stickyFooter={
              <button
                onClick={onLandDreamRole}
                className="w-full h-[56px] rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all text-white font-semibold"
                style={{ fontFamily: FONT_DM_SANS_VAR }}
              >
                Land your dream role
              </button>
            }
          >
            {/* Image card */}
            <div className="mt-2 w-full rounded-3xl overflow-hidden shadow-[0_6px_18px_rgba(0,0,0,0.08)] border border-gray-200">
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

            {/* Copy */}
            <h1
              className="text-[32px] font-semibold text-gray-800 leading-[1.15] mt-5"
              style={{ fontFamily: FONT_DM_SANS_VAR }}
            >
              Great choice, mate!
            </h1>

            <p
              className="text-[28px] font-semibold text-gray-800 mt-3 leading-[1.2]"
              style={{ fontFamily: FONT_DM_SANS_VAR }}
            >
              You&apos;re still on the path to your dream role.{" "}
              <span className="text-[#8B5CF6]">
                Let&apos;s make it happen together!
              </span>
            </p>

            <div
              className="text-gray-600 text-[15px] leading-relaxed mt-4 space-y-1"
              style={{ fontFamily: FONT_DM_SANS_VAR }}
            >
              <p>You&apos;ve got XX days left on your current plan.</p>
              <p>Starting from XX date, your monthly payment will be $12.50.</p>
            </div>

            <p
              className="text-gray-500 text-[13px] italic mt-3"
              style={{ fontFamily: FONT_DM_SANS_VAR }}
            >
              You can cancel anytime before then.
            </p>
          </MUIDrawer>
        </div>
      )}
    </>
  );
}

export default React.memo(SubscriptionOfferModal);
