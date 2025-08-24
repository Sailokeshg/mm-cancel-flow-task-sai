"use client";

import React from "react";
import Image from "next/image";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  DESKTOP_MIN_WIDTH_PX,
  FONT_DM_SANS_VAR,
  BACKDROP_RGBA,
  BACKDROP_BLUR,
} from "../../lib/ui/constants";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "../ui/MUIDrawer";
import ModalHeader from "../ui/ModalHeader";
import PrimaryButton from "../buttons/PrimaryButton";

type Props = {
  visible: boolean;
  onClose: () => void;
  onJobFound: () => void;
  onStillLooking: () => void;
};

export default function CancellationModal({
  visible,
  onClose,
  onJobFound,
  onStillLooking,
}: Props) {
  // Tailwind-aligned breakpoint: desktop >= DESKTOP_MIN_WIDTH_PX
  const isDesktop = useMediaQuery(`(min-width:${DESKTOP_MIN_WIDTH_PX}px)`);

  if (!visible) return null;

  return (
    <>
      {/* Desktop dialog */}
      {isDesktop && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center "
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-title"
          style={{
            backgroundColor: BACKDROP_RGBA,
            backdropFilter: BACKDROP_BLUR,
            WebkitBackdropFilter: BACKDROP_BLUR,
          }}
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
            desktopOnly // prevents portal on mobile
            title={
              <ModalHeader
                title="Subscription Cancellation"
                onClose={onClose}
              />
            }
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 p-6 md:p-10">
              <div className="flex flex-col justify-center">
                <div className="max-w-[1000px]">
                  <h1
                    className="text-4xl md:text-4xl font-semibold text-gray-800 leading-tight -mt-4"
                    style={{ fontFamily: FONT_DM_SANS_VAR }}
                  >
                    Hey mate,
                    <br />
                    Quick one before you go.
                  </h1>

                  <p
                    className="text-4xl md:text-4xl font-semibold text-gray-800 mt-4"
                    style={{ fontFamily: FONT_DM_SANS_VAR }}
                  >
                    <em>Have you found a job yet?</em>
                  </p>

                  <p
                    className="text-gray-700 text-base md:text-[16px] leading-relaxed mt-4"
                    style={{ fontFamily: FONT_DM_SANS_VAR }}
                  >
                    Whatever your answer, we just want to help you take the next
                    step. With visa support, or by hearing how we can do better.
                  </p>

                  <hr className="my-6 border-t border-gray-200" />

                  <div className="space-y-4">
                    <PrimaryButton
                      onClick={onJobFound}
                      className="max-w-[560px]"
                      variant="ghost"
                    >
                      Yes, I&apos;ve found a job
                    </PrimaryButton>

                    <PrimaryButton
                      onClick={onStillLooking}
                      className="max-w-[560px]"
                      variant="ghost"
                    >
                      Not yet – I&apos;m still looking
                    </PrimaryButton>
                  </div>
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
                    sizes="(min-width:1024px) 560px, 100vw"
                  />
                </div>
              </div>
            </div>
          </ResponsiveDialog>
        </div>
      )}

      {/* Mobile bottom sheet */}
      {!isDesktop && (
        <MUIDrawer
          open={visible}
          onClose={onClose}
          title="Subscription Cancellation"
          showGrabHandle
          maxHeight="min(75dvh,75vh)"
        >
          {/* Image card */}
          <div className="w-full rounded-3xl overflow-hidden shadow-[0_6px_18px_rgba(0,0,0,0.08)] border border-gray-200 mt-3">
            <div className="relative w-full aspect-[16/9]">
              <Image
                src="/empire-state-compressed.jpg"
                alt="New York City skyline with Empire State Building"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </div>
          </div>

          {/* Copy */}
          <h1
            className="mt-5 text-[32px] leading-[1.12] font-semibold text-gray-800 tracking-[-0.01em]"
            style={{ fontFamily: FONT_DM_SANS_VAR }}
          >
            Hey mate,
            <br />
            Quick one before you go.
          </h1>

          <p
            className="mt-3 text-[28px] leading-[1.1] font-semibold italic text-gray-800 tracking-[-0.01em]"
            style={{ fontFamily: FONT_DM_SANS_VAR }}
          >
            Have you found a job yet?
          </p>

          <p
            className="mt-3 text-[16px] leading-[1.6] text-gray-600"
            style={{ fontFamily: FONT_DM_SANS_VAR }}
          >
            Whatever your answer, we just want to help you take the next step.
            With visa support, or by hearing how we can do better.
          </p>

          <div className="my-5 h-px bg-gray-200" />

          {/* Buttons */}
          <div className="space-y-4 pb-2">
            <button
              onClick={onJobFound}
              className="w-full h-[56px] rounded-2xl border border-gray-300 bg-white shadow-sm hover:shadow-md hover:border-gray-400 transition-all text-gray-800 font-semibold text-[18px]"
              style={{ fontFamily: FONT_DM_SANS_VAR }}
            >
              Yes, I&apos;ve found a job
            </button>

            <button
              onClick={onStillLooking}
              className="w-full h-[56px] rounded-2xl border border-gray-300 bg-white shadow-sm hover:shadow-md hover:border-gray-400 transition-all text-gray-800 font-semibold text-[18px]"
              style={{ fontFamily: FONT_DM_SANS_VAR }}
            >
              Not yet – I&apos;m still looking
            </button>
          </div>
        </MUIDrawer>
      )}
    </>
  );
}
