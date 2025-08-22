"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;                // go back to Step 1
  onSubmit?: (feedback: string) => void; // called on Continue when valid
  totalSteps?: number;                // default 3
};

export default function CancellationFeedbackModal({
  visible,
  onClose,
  onBack,
  onSubmit,
  totalSteps = 3,
}: Props) {
  // ---- This screen is Step 2 of 3 ----
  const STEP_INDEX = 2;

  // Feedback state
  const [feedback, setFeedback] = useState("");
  const charCount = feedback.trim().length;
  const MIN = 25;
  const isValid = charCount >= MIN;

  // ======= Bottom sheet state (mobile) =======
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
    // open as FULL on mobile
    setTranslateY(0);
  }, [visible]);

  // Lock background scroll while open
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

  // Continue handler
  const handleContinue = () => {
    if (!isValid) return;
    if (onSubmit) onSubmit(feedback.trim());
    else console.log("Feedback:", feedback.trim());
    onClose();
  };

  // ======= Stepper UI (greens for progress like Figma) =======
  const Stepper = () => (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const idx = i + 1;
          const isDoneOrCurrent = idx <= STEP_INDEX;
          return (
            <span
              key={idx}
              className={[
                "h-2 rounded-full transition-[width,background-color]",
                idx === STEP_INDEX ? "w-8" : "w-5",
                isDoneOrCurrent ? "bg-green-500" : "bg-gray-300",
              ].join(" ")}
            />
          );
        })}
      </div>
      <span className="text-sm text-gray-600" style={{ fontFamily: "var(--font-dm-sans)" }}>
        Step {STEP_INDEX} of {totalSteps}
      </span>
    </div>
  );

  // ======= Drag helpers (header as handle) =======
  const onDragStart = (clientY: number) => {
    setDragging(true);
    startYRef.current = clientY;
    startTranslateRef.current = translateY;
  };
  const onDragMove = (clientY: number) => {
    if (startYRef.current == null) return;
    const dy = clientY - startYRef.current;
    const next = Math.max(0, Math.min(startTranslateRef.current + dy, snaps.CLOSED));
    setTranslateY(next);
  };
  const onDragEnd = () => {
    setDragging(false);
    startYRef.current = null;
    if (translateY > snaps.CLOSE_THRESHOLD) {
      onClose();
      return;
    }
    const target = Math.abs(translateY - snaps.FULL) < Math.abs(translateY - snaps.MID)
      ? snaps.FULL
      : snaps.MID;
    setTranslateY(target);
  };
  const handleTouchStart = (e: React.TouchEvent) => onDragStart(e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => onDragMove(e.touches[0].clientY);
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

  // ==== Shared left content (desktop body; mobile drawer body) ====
  const LeftContent = () => (
    <div className="max-w-[760px]">
      <h1
        className="text-[32px] md:text-[42px] font-semibold text-gray-800 leading-tight"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        What’s one thing you wish we could’ve helped you with?
      </h1>

      <p
        className="mt-4 text-[16px] md:text-[18px] text-gray-600 max-w-[560px]"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        We’re always looking to improve, your thoughts can help us make Migrate Mate more useful for others.*
      </p>

      {/* Textarea + counter */}
      <div className="mt-5">
        <div className="relative">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder=""
            className="w-full h-40 md:h-48 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 p-4 text-gray-800 placeholder-gray-400"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          />
          <div
            className="absolute bottom-2 right-3 text-sm text-gray-500"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Min {MIN} characters ({charCount}/{MIN})
          </div>
        </div>
      </div>

      {/* Divider + Continue (desktop) */}
      <hr className="hidden md:block mt-6 mb-4 border-gray-200" />
      <button
        onClick={handleContinue}
        disabled={!isValid}
        className={[
          "hidden md:block w-full py-3.5 rounded-2xl font-semibold transition-colors",
          isValid ? "bg-[#5D3AF7] text-white hover:bg-[#4F2FF3]" : "bg-gray-100 text-gray-400 cursor-not-allowed",
        ].join(" ")}
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Continue
      </button>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/30"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ===== Desktop modal ===== */}
      <div className="hidden lg:block w-full max-w-6xl mx-4 bg-white rounded-[24px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="w-full px-5 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <button
            onClick={() => (onBack ? onBack() : onClose())}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            aria-label="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Back
            </span>
          </button>

          <div className="flex items-center gap-4">
            <h3
              id="feedback-title"
              className="text-base md:text-lg font-semibold text-gray-900"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Subscription Cancellation
            </h3>
            <Stepper />
          </div>

          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600" aria-label="Close">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 p-6 md:p-10">
          <LeftContent />
          {/* Right: image */}
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
        className="lg:hidden fixed inset-x-0 bottom-0 z-[60]"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: dragging ? "none" : "transform 220ms cubic-bezier(.2,.8,.2,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-2 mb-2 rounded-t-[22px] bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.25)] border border-gray-200 overflow-hidden">
          {/* Header (drag handle area) */}
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
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm" style={{ fontFamily: "var(--font-dm-sans)" }}>
                Back
              </span>
            </button>
          </div>

          {/* Scrollable content */}
          <div className="max-h-[75vh] overflow-y-auto px-4 pt-4 pb-28" style={{ WebkitOverflowScrolling: "touch" }}>
            <h1
              className="text-[28px] font-semibold text-gray-800 leading-tight"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              What’s one thing you wish we could’ve helped you with?
            </h1>

            <p
              className="mt-4 text-[16px] text-gray-600"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              We’re always looking to improve, your thoughts can help us make Migrate Mate more useful for others.*
            </p>

            <div className="mt-5">
              <div className="relative">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full h-48 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 p-4 text-gray-800"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                />
                <div
                  className="absolute bottom-2 right-3 text-sm text-gray-500"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Min {MIN} characters ({charCount}/{MIN})
                </div>
              </div>
            </div>
          </div>

          {/* Sticky bottom Continue */}
          <div
            className="absolute inset-x-0 bottom-0 bg-white border-t border-gray-200 px-4 pb-4 pt-3"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
          >
            <button
              onClick={handleContinue}
              disabled={!isValid}
              className={[
                "w-full py-3.5 rounded-2xl font-semibold transition-colors",
                isValid ? "bg-[#5D3AF7] text-white hover:bg-[#4F2FF3]" : "bg-gray-100 text-gray-400 cursor-not-allowed",
              ].join(" ")}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
