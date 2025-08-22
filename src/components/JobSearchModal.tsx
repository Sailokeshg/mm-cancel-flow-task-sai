"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";

type Props = {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  onAccept: () => void; // CTA: Get 50% off
  onDecline: () => void; // Ghost: No thanks
  step?: number; // optional external step control (defaults 1)
  totalSteps?: number; // optional (defaults 3)
};

export default function JobSearchModal({
  visible,
  onClose,
  onBack,
  onAccept,
  onDecline,
  step = 1,
  totalSteps = 3,
}: Props) {
  // ===== Mobile bottom-sheet state =====
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);
  const startTranslateRef = useRef<number>(0);
  const [translateY, setTranslateY] = useState(0);
  const [dragging, setDragging] = useState(false);

  const snaps = useMemo(() => {
    const h = typeof window !== "undefined" ? window.innerHeight : 800;
    return {
      FULL: 0,
      MID: Math.round(h * 0.35),
      CLOSED: Math.round(h * 0.9),
      CLOSE_THRESHOLD: Math.round(h * 0.6),
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    // open full on mobile
    setTranslateY(0);
  }, [visible]);

  // lock background scroll
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  // ESC to close
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  if (!visible) return null;

  // ===== Drag handlers =====
  const onDragStart = (clientY: number) => {
    setDragging(true);
    startYRef.current = clientY;
    startTranslateRef.current = translateY;
  };
  const onDragMove = (clientY: number) => {
    if (startYRef.current == null) return;
    const dy = clientY - startYRef.current;
    const next = Math.max(
      0,
      Math.min(startTranslateRef.current + dy, snaps.CLOSED)
    );
    setTranslateY(next);
  };
  const onDragEnd = () => {
    setDragging(false);
    startYRef.current = null;

    if (translateY > snaps.CLOSE_THRESHOLD) {
      onClose();
      return;
    }
    const target =
      Math.abs(translateY - snaps.FULL) < Math.abs(translateY - snaps.MID)
        ? snaps.FULL
        : snaps.MID;
    setTranslateY(target);
  };

  const handleTouchStart = (e: React.TouchEvent) =>
    onDragStart(e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) =>
    onDragMove(e.touches[0].clientY);
  const handleTouchEnd = () => onDragEnd();
  const handleMouseDown = (e: React.MouseEvent) => {
    onDragStart(e.clientY);
    const move = (ev: MouseEvent) => onDragMove(ev.clientY);
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      onDragEnd();
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  // ===== Stepper =====
  const Stepper = () => (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const idx = i + 1;
          const isActive = idx <= step;
          return (
            <span
              key={idx}
              className={[
                "h-2 rounded-full transition-colors",
                idx === step ? "w-6" : "w-5",
                isActive ? "bg-gray-500" : "bg-gray-300",
              ].join(" ")}
            />
          );
        })}
      </div>
      <span
        className="text-sm text-gray-600"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Step {step} of {totalSteps}
      </span>
    </div>
  );

  // ===== Offer card =====
  const OfferCard = () => (
    <div className="rounded-2xl border border-[#C9B7FF] bg-[#EFE4FF]/70 p-4 md:p-5 shadow-sm">
      <h3
        className="text-[22px] md:text-[26px] font-semibold text-gray-900"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Here’s <u>50% off</u> until you find a job.
      </h3>

      <div className="mt-3 flex items-baseline gap-6">
        <div
          className="text-[22px] md:text-[24px] font-extrabold text-[#5D3AF7]"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          $12.50<span className="font-semibold">/month</span>
        </div>
        <div className="text-gray-500 line-through text-[16px] md:text-[18px]">
          $25 /month
        </div>
      </div>

      <button
        onClick={onAccept}
        className="mt-4 w-full py-3 rounded-2xl font-semibold text-white bg-[#28B463] hover:bg-[#24A259] transition-colors"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Get 50% off
      </button>

      <p
        className="mt-3 text-sm italic text-gray-600 text-center"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        You won’t be charged until your next billing date.
      </p>
    </div>
  );

  // ===== Left content =====
  const LeftContent = () => (
    <div className="max-w-[760px]">
      <h1
        className="text-[32px] md:text-[44px] font-semibold text-gray-800 leading-tight"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        We built this to help you land the job, this makes it a little easier.
      </h1>

      <p
        className="mt-3 text-[18px] md:text-[22px] text-gray-600"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        We’ve been there and we’re here to help you.
      </p>

      <div className="mt-6">
        <OfferCard />
      </div>

      {/* Desktop ghost button */}
      <button
        onClick={onDecline}
        className="hidden md:block mt-6 w-full py-3.5 rounded-2xl border border-gray-300 bg-white text-gray-800 font-semibold hover:bg-gray-50 transition-colors"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        No thanks
      </button>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/30"
      role="dialog"
      aria-modal="true"
      aria-labelledby="offer-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ===== Desktop modal ===== */}
      <div className="hidden lg:block relative w-full max-w-6xl mx-4 bg-white rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] border border-gray-200 overflow-hidden">
        {/* Header */}
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
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Back
            </span>
          </button>

          <div className="flex items-center gap-4">
            <h3
              id="offer-title"
              className="text-base md:text-lg font-semibold text-gray-900"
              style={{ fontFamily: "var(--font-dm-sans)" }}
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
          <LeftContent />

          {/* Right: image card */}
          <div className="flex items-start justify-center">
            <div className="relative w-full h-[480px] md:h-[560px] rounded-3xl overflow-hidden shadow-md border border-gray-200">
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

      {/* ===== Mobile bottom-sheet drawer ===== */}
      <div
        ref={sheetRef}
        className="lg:hidden fixed inset-x-0 bottom-0 z-[60] pointer-events-auto"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: dragging
            ? "none"
            : "transform 220ms cubic-bezier(.2,.8,.2,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-2 mb-2 rounded-t-[28px] bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.25)] border border-gray-200 overflow-hidden">
          {/* Header (drag handle) */}
          <div
            className="px-4 pt-4 pb-3 border-b border-gray-200"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            role="button"
            aria-label="Drag to close"
          >
            <div className="flex items-center justify-between">
              <h3
                className="text-base font-semibold text-gray-900 mx-auto"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Subscription Cancellation
              </h3>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
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

            <div className="mt-3">
              <Stepper />
            </div>
          </div>

          {/* Back row */}
          <div className="px-4 py-3 border-b border-gray-200">
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
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Back
              </span>
            </button>
          </div>

          {/* Scrollable content */}
          <div
            className="max-h-[75vh] overflow-y-auto px-4 pt-4 pb-28"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <h1
              className="text-[28px] font-semibold text-gray-800 leading-tight"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              We built this to help you land the job, this makes it a little
              easier.
            </h1>

            <p
              className="mt-3 text-[17px] text-gray-600"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              We’ve been there and we’re here to help you.
            </p>

            <div className="mt-6">
              <OfferCard />
            </div>
          </div>

          {/* Sticky bottom: No thanks */}
          <div
            className="absolute inset-x-0 bottom-0 bg-white border-t border-gray-200 px-4 pb-4 pt-3"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
            }}
          >
            <button
              onClick={onDecline}
              className="w-full py-3.5 rounded-2xl border border-gray-300 bg-white text-gray-800 font-semibold hover:bg-gray-50 transition-colors"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              No thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
