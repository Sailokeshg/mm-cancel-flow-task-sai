"use client";

import React from "react";
import Image from "next/image";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "./MUIDrawer";

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
  // Tailwind-aligned breakpoint: desktop >= 1024px
  const isDesktop = useMediaQuery("(min-width:1024px)");

  if (!visible) return null;

  return (
    <>
      {/* ===== Desktop dialog (renders ONLY on >=1024px) ===== */}
      {isDesktop && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center "
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-title"
           style={{
    backgroundColor: "rgba(255,255,255,0.55)",       
    backdropFilter: "blur(50px) brightness(0.9)",    
    WebkitBackdropFilter: "blur(50px) brightness(0.9)"
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
            desktopOnly // <-- prevents portal on mobile if someone reuses this
            title={
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingRight: 56,
                }}
              >
                <h3
                  id="cancel-title"
                  className="text-lg font-semibold text-gray-900 flex justify-center"
                  style={{ fontFamily: "var(--font-dm-sans)", margin: 0 }}
                >
                  Subscription Cancellation
                </h3>

                <IconButton
                  onClick={onClose}
                  aria-label="Close"
                  size="small"
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 2,
                    color: "#6B7280",
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            }
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 p-6 md:p-10">
              <div className="flex flex-col justify-center">
                <div className="max-w-[1000px]">
                  <h1
                    className="text-4xl md:text-4xl font-semibold text-gray-800 leading-tight -mt-4"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Hey mate,
                    <br />
                    Quick one before you go.
                  </h1>

                  <p
                    className="text-4xl md:text-4xl font-semibold text-gray-800 mt-4"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    <em>Have you found a job yet?</em>
                  </p>

                  <p
                    className="text-gray-700 text-base md:text-[16px] leading-relaxed mt-4"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Whatever your answer, we just want to help you take the next
                    step. With visa support, or by hearing how we can do better.
                  </p>

                  <hr className="my-6 border-t border-gray-200" />

                  <div className="space-y-4">
                    <button
                      onClick={onJobFound}
                      className="w-full max-w-[560px] py-4 rounded-2xl border border-gray-300 bg-white shadow-sm hover:shadow-md hover:border-gray-400 transition-all text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      Yes, I&apos;ve found a job
                    </button>

                    <button
                      onClick={onStillLooking}
                      className="w-full max-w-[560px] py-4 rounded-2xl border border-gray-300 bg-white shadow-sm hover:shadow-md hover:border-gray-400 transition-all text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      Not yet – I&apos;m still looking
                    </button>
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

      {/* ===== Mobile bottom sheet (renders ONLY on <1024px) ===== */}
      {!isDesktop && (
        <MUIDrawer
          open={visible}
          onClose={onClose}
          title="Subscription Cancellation"
          showGrabHandle
          maxHeight="min(75dvh,75vh)"
        >
          {/* Image Card (top) */}
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
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Hey mate,
            <br />
            Quick one before you go.
          </h1>

          <p
            className="mt-3 text-[28px] leading-[1.1] font-semibold italic text-gray-800 tracking-[-0.01em]"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Have you found a job yet?
          </p>

          <p
            className="mt-3 text-[16px] leading-[1.6] text-gray-600"
            style={{ fontFamily: "var(--font-dm-sans)" }}
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
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Yes, I&apos;ve found a job
            </button>

            <button
              onClick={onStillLooking}
              className="w-full h-[56px] rounded-2xl border border-gray-300 bg-white shadow-sm hover:shadow-md hover:border-gray-400 transition-all text-gray-800 font-semibold text-[18px]"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Not yet – I&apos;m still looking
            </button>
          </div>
        </MUIDrawer>
      )}
    </>
  );
}
