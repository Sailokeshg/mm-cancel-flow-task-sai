"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

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
  // ======== Bottom sheet state (mobile) ========
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);
  const startTranslateRef = useRef<number>(0);
  const [translateY, setTranslateY] = useState(0);
  const [dragging, setDragging] = useState(false);

  // Snap points as fractions of viewport height
  const snaps = useMemo(() => {
    const h = typeof window !== "undefined" ? window.innerHeight : 800;
    return {
      FULL: 0,              // fully expanded (sticks to top of safe area)
      MID: Math.round(h * 0.38), // mid sheet
      CLOSED: Math.round(h * 0.88), // almost hidden (we'll treat as close)
      CLOSE_THRESHOLD: Math.round(h * 0.55), // below this on release => close
    };
  }, []);

  // Lock body scroll when visible
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  // Keyboard close
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

  // Reset position whenever we open
  useEffect(() => {
    if (visible) {
      // Start at MID on mobile
      setTranslateY(snaps.MID);
      setDragging(false);
    }
  }, [visible, snaps.MID]);

  if (!visible) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close when clicking the overlay (not the sheet)
    if (e.target === e.currentTarget) onClose();
  };

  // ---- Drag handlers (touch + mouse pointer) ----
  const onDragStart = (clientY: number) => {
    setDragging(true);
    startYRef.current = clientY;
    startTranslateRef.current = translateY;
  };
  const onDragMove = (clientY: number) => {
    if (startYRef.current == null) return;
    const dy = clientY - startYRef.current;
    // allow dragging up (negative dy) and down (positive dy)
    const next = Math.max(0, Math.min(startTranslateRef.current + dy, snaps.CLOSED));
    setTranslateY(next);
  };
  const onDragEnd = () => {
    setDragging(false);
    startYRef.current = null;

    // Snap logic
    if (translateY > snaps.CLOSE_THRESHOLD) {
      onClose();
      return;
    }
    // choose nearest of FULL or MID
    const target = Math.abs(translateY - snaps.FULL) < Math.abs(translateY - snaps.MID)
      ? snaps.FULL
      : snaps.MID;
    setTranslateY(target);
  };

  // helpers for event wiring
  const handleTouchStart = (e: React.TouchEvent) => onDragStart(e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    onDragMove(e.touches[0].clientY);
  };
  const handleTouchEnd = () => onDragEnd();

  const handleMouseDown = (e: React.MouseEvent) => {
    onDragStart(e.clientY);
    const onMove = (ev: MouseEvent) => onDragMove(ev.clientY);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      onDragEnd();
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/30"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-title"
      onClick={handleOverlayClick}
    >
      {/* ===== Desktop dialog (unchanged) ===== */}
      <div className="hidden lg:block relative w-full max-w-6xl mx-4 bg-white rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="w-full px-6 py-4 border-b border-gray-200 flex items-center justify-center">
          <h3
            id="cancel-title"
            className="text-lg font-semibold text-gray-900"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Subscription Cancellation
          </h3>

          <button
            onClick={onClose}
            className="absolute right-5 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body: two columns under the header */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 p-6 md:p-10">
          {/* Left copy */}
          <div className="flex flex-col justify-center">
            <div className="max-w-[1000px]">
              <h1 className="text-4xl md:text-4xl font-semibold text-gray-800 leading-tight -mt-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
                Hey mate,
                <br />
                Quick one before you go.
              </h1>

              <p className="text-4xl md:text-4xl font-semibold text-gray-800 mt-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
                <em>Have you found a job yet?</em>
              </p>

              <p className="text-gray-600 text-base md:text-[17px] leading-relaxed mt-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
                Whatever your answer, we just want to help you take the next step. With visa support, or by hearing how we can do better.
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

          {/* Right image */}
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
      </div>

      {/* ===== Mobile bottom sheet ===== */}
      <div
        ref={sheetRef}
        className="lg:hidden fixed inset-x-0 bottom-0 z-[60] pointer-events-auto"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: dragging ? "none" : "transform 220ms cubic-bezier(.2,.8,.2,1)",
        }}
        // Stop overlay close from clicks inside the sheet
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-2 mb-2 rounded-t-[28px] bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.25)] border border-gray-200 overflow-hidden">
          {/* Grab handle */}
          <div
            className="w-full pt-3 pb-2 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            aria-label="Drag handle"
          >
            <span className="h-1.5 w-12 rounded-full bg-gray-300" />
          </div>

          {/* Header (compact) */}
          <div className="px-4 pb-3 border-b border-gray-200 flex items-center justify-between">
            <h3
              id="cancel-title"
              className="text-base font-semibold text-gray-900"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Subscription Cancellation
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content area: scrollable */}
          <div className="max-h-[75vh] overflow-y-auto overscroll-contain px-4 pb-6">
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
              Hey mate,
              <br />
              Quick one before you go.
            </h1>

            <p
              className="text-[26px] font-semibold text-gray-800 mt-3 italic"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Have you found a job yet?
            </p>

            <p
              className="text-gray-600 text-[15px] leading-relaxed mt-3"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Whatever your answer, we just want to help you take the next step.
              With visa support, or by hearing how we can do better.
            </p>

            <hr className="my-5 border-t border-gray-200" />

            {/* Buttons */}
            <div className="space-y-4">
              <button
                onClick={onJobFound}
                className="w-full py-4 rounded-2xl border border-gray-300 bg-white shadow-sm hover:shadow-md hover:border-gray-400 transition-all text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Yes, I&apos;ve found a job
              </button>

              <button
                onClick={onStillLooking}
                className="w-full py-4 rounded-2xl border border-gray-300 bg-white shadow-sm hover:shadow-md hover:border-gray-400 transition-all text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Not yet – I&apos;m still looking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
