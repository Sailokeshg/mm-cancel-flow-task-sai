"use client";

import React from "react";
import Image from "next/image";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "./MUIDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";

type Props = {
  visible: boolean;
  onClose: () => void;
  totalSteps?: number; // default 3
  repName?: string;
  repEmail?: string;
  repAvatarUrl?: string;
  headline?: string;
  messageLead?: string;
  messageBody?: string;
  messageFooter?: string; // supports _underline_ segments
};

export default function CancellationCompletionModal({
  visible,
  onClose,
  totalSteps = 3,
  repName = "Mihailo Bozic",
  repEmail = "mihailo@migratemate.co",
  repAvatarUrl = "/mihailo-profile.jpeg",
  headline = "Your cancellation’s all sorted, mate, no more charges.",
  messageLead = "I'll be reaching out soon to help with the visa side of things.",
  messageBody = "We’ve got your back, whether it’s questions, paperwork, or just figuring out your options.",
  messageFooter = "Keep an eye on your inbox, I’ll be in touch _shortly_.",
}: Props) {
  // Render desktop dialog ONLY at >= 1024px
  const isDesktop = useMediaQuery("(min-width:1024px)");

  if (!visible) return null;

  const underlineFromUnderscores = (text: string) =>
    text.split(/(_[^_]+_)/g).map((segment, i) => {
      if (segment.startsWith("_") && segment.endsWith("_")) {
        return (
          <span key={i} className="underline">
            {segment.slice(1, -1)}
          </span>
        );
      }
      return <React.Fragment key={i}>{segment}</React.Fragment>;
    });

  const Stepper = () => (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span key={i} className="h-2 w-5 rounded-full bg-green-500 transition-colors" />
        ))}
      </div>
      <span className="text-sm text-gray-600" style={{ fontFamily: "var(--font-dm-sans)" }}>
        Completed
      </span>
    </div>
  );

  const LeftContent = () => (
    <div className="max-w-[760px]">
      <h1
        className="text-4xl md:text-4xl font-semibold text-gray-800 leading-tight"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        {headline}
      </h1>

      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-6 max-w-[620px]">
        <div className="flex items-center gap-4">
          {repAvatarUrl ? (
            <div className="relative h-14 w-14 rounded-full overflow-hidden">
              <Image src={repAvatarUrl} alt={repName} fill className="object-cover" />
            </div>
          ) : (
            <div
              className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-lg"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {repName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800" style={{ fontFamily: "var(--font-dm-sans)" }}>
              {repName}
            </span>
            <span className="text-xs text-gray-500" style={{ fontFamily: "var(--font-dm-sans)" }}>
              {repEmail}
            </span>
          </div>
        </div>

        <div className="mt-6 ml-[72px] space-y-4 text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)" }}>
          <p className="text-gray-800 font-medium">{messageLead}</p>
          <p className="text-gray-600">{messageBody}</p>
          <p className="text-gray-600">{underlineFromUnderscores(messageFooter)}</p>
        </div>
      </div>

      <hr className="hidden md:block my-8 border-gray-200" />
      <button
        onClick={onClose}
        className="hidden md:block w-full max-w-[560px] py-4 rounded-2xl font-semibold bg-[#5D3AF7] text-white hover:bg-[#4F2FF3] transition-colors"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Finish
      </button>
    </div>
  );

  return (
    <>
      {/* DESKTOP: only render when isDesktop === true */}
      {isDesktop && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          role="dialog"
          aria-modal="true"
          aria-labelledby="completion-title"
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
              <div className="w-full px-5 md:px-6 py-4 border-b border-gray-200 flex items-center justify-center">
                <div className="flex items-center gap-4">
                  <h3
                    id="completion-title"
                    className="text-base md:text-lg font-semibold text-gray-900"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
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
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 p-6 md:p-10">
                <div className="max-w-[1000px]">
                  <LeftContent />
                </div>

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
              className="w-full h-[56px] rounded-2xl font-semibold bg-[#5D3AF7] text-white hover:bg-[#4F2FF3] transition-colors"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Finish
            </button>
          }
        >
          <h1
            className="text-[30px] font-semibold text-gray-800 leading-[1.15]"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {headline}
          </h1>

          <div className="mt-5 bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              {repAvatarUrl ? (
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image src={repAvatarUrl} alt={repName} fill className="object-cover" />
                </div>
              ) : (
                <div
                  className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {repName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {repName}
                </span>
                <span className="text-xs text-gray-500" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {repEmail}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)" }}>
              <p className="text-gray-800 font-medium">{messageLead}</p>
              <p className="text-gray-600">{messageBody}</p>
              <p className="text-gray-600">{underlineFromUnderscores(messageFooter)}</p>
            </div>
          </div>
        </MUIDrawer>
      )}
    </>
  );
}
