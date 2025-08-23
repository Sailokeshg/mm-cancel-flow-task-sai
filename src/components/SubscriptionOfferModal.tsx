"use client";

import React from "react";
import Image from "next/image";
import ResponsiveDialog from "./ResponsiveDialog";
import MUIDrawer from "./MUIDrawer";

type Props = {
  visible: boolean;
  onClose: () => void;
  onLandDreamRole: () => void;
};

export default function SubscriptionOfferModal({
  visible,
  onClose,
  onLandDreamRole,
}: Props) {
  if (!visible) return null;

  return (
    <>
      {/* ===== Desktop dialog (MUI) ===== */}
      <div className="hidden lg:block">
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
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
            fullWidth={true}
            paperSx={{ borderRadius: 6 }}
          >
            <div className="relative">
              {/* Header: centered title with absolute close button */}
              <div className="w-full px-6 py-4 border-b border-gray-200 flex items-center justify-center">
                <h3
                  className="text-lg font-semibold text-gray-900"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Subscription
                </h3>

                <button
                  onClick={onClose}
                  className="absolute right-5 top-4 text-gray-400 hover:text-gray-600 transition-colors"
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

              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
                <div className="flex flex-col justify-center p-6 md:pl-10 md:pr-6 md:py-8">
                  <div className="max-w-[1000px]">
                    <h1
                      className="text-4xl md:text-4xl font-semibold text-gray-800 leading-tight -mt-4"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      Great choice, mate!
                    </h1>

                    <p
                      className="text-4xl md:text-4xl font-semibold text-gray-800 mt-3"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      You&apos;re still on the path to your dream role.{" "}
                      <span className="text-[#8B5CF6]">
                        Let&apos;s make it happen together!
                      </span>
                    </p>

                    <div
                      className="text-gray-600 text-base md:text-[17px] leading-relaxed mt-4 space-y-1"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      <p>You&apos;ve got XX days left on your current plan.</p>
                      <p>
                        Starting from XX date, your monthly payment will be
                        $12.50.
                      </p>
                    </div>

                    <p
                      className="text-gray-500 text-sm md:text-[15px] italic mt-3"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      You can cancel anytime before then.
                    </p>

                    <div className="mt-6">
                      <button
                        onClick={onLandDreamRole}
                        className="w-full py-4 rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-offset-2"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        Land your dream role
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center p-6 md:py-8 md:pl-0 md:pr-2">
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl lg:rounded-l-2xl lg:rounded-r-lg">
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
            </div>
          </ResponsiveDialog>
        </div>
      </div>

      {/* ===== Mobile drawer ===== */}
      <MUIDrawer
        open={visible}
        onClose={onClose}
        title="Subscription"
        showGrabHandle={true}
      >
        {/* Image */}
        <div className="mt-4 w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200">
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

        {/* Text */}
        <h1
          className="text-[28px] font-semibold text-gray-800 leading-tight mt-5"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Great choice, mate!
        </h1>

        <p
          className="text-[26px] font-semibold text-gray-800 mt-3"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          You&apos;re still on the path to your dream role.{" "}
          <span className="text-[#8B5CF6]">
            Let&apos;s make it happen together!
          </span>
        </p>

        <div
          className="text-gray-600 text-[15px] leading-relaxed mt-4 space-y-1"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          <p>You&apos;ve got XX days left on your current plan.</p>
          <p>Starting from XX date, your monthly payment will be $12.50.</p>
        </div>

        <p
          className="text-gray-500 text-[13px] italic mt-3"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          You can cancel anytime before then.
        </p>

        {/* Button */}
        <div className="mt-6">
          <button
            onClick={onLandDreamRole}
            className="w-full py-4 rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-offset-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Land your dream role
          </button>
        </div>
      </MUIDrawer>
    </>
  );
}
