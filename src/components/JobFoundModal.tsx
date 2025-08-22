"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import Image from "next/image";
import OptionButton from "./OptionButton";
import CancellationFeedbackModal from "./CancellationFeedbackModal";

type Props = {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
};

export default function JobFoundModal({ visible, onClose, onBack }: Props) {
  // ======= Steps (3 total) =======
  const TOTAL_STEPS = 3;
  const [step, setStep] = useState(1);
  const goToStep = (n: number) =>
    setStep(Math.min(Math.max(n, 1), TOTAL_STEPS));

  // ======= Form state (Step 1) =======
  const [foundVia, setFoundVia] = useState<string | null>(null);
  const [appliedCount, setAppliedCount] = useState<string | null>(null);
  const [emailedCount, setEmailedCount] = useState<string | null>(null);
  const [interviewedCount, setInterviewedCount] = useState<string | null>(null);

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
    // open as full on mobile
    setTranslateY(0);
  }, [visible]);

  // lock body scroll when dialog is open
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

  // When the user advances to step 2, render the feedback modal only to avoid
  // stacking the JobFoundModal UI underneath it (causes the mobile overlap).
  if (step === 2) {
    return (
      <CancellationFeedbackModal
        visible={true}
        onBack={() => goToStep(1)}
        onClose={() => goToStep(3)}
        onSubmit={(feedback) => {
          console.log("cancellation feedback:", feedback);
        }}
      />
    );
  }

  const onContinue = () => {
    if (step < TOTAL_STEPS) {
      goToStep(step + 1);
      return;
    }
    console.log({
      step,
      foundVia,
      appliedCount,
      emailedCount,
      interviewedCount,
    });
    onClose();
  };

  // ======= Stepper UI =======
  const Stepper = () => (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
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
        Step {step} of {TOTAL_STEPS}
      </span>
    </div>
  );

  // ======= Step 1 content =======
  const StepOne = () => (
    <>
      <h2
        className="text-[28px] md:text-[34px] font-semibold text-gray-800 leading-snug"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Congrats on the new role! 🎉
      </h2>

      <div className="mt-6 space-y-6">
        <div>
          <p
            className="text-[15px] text-gray-700 mb-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Did you find this job with MigrateMate?*
          </p>
          <div className="grid grid-cols-2 gap-4">
            <OptionButton
              label="Yes"
              active={foundVia === "yes"}
              onClick={() => setFoundVia("yes")}
            />
            <OptionButton
              label="No"
              active={foundVia === "no"}
              onClick={() => setFoundVia("no")}
            />
          </div>
        </div>

        <div>
          <p
            className="text-[15px] text-gray-700 mb-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            How many roles did you <u>apply</u> for through Migrate Mate?*
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["0", "1–5", "6–20", "20+"].map((val) => (
              <OptionButton
                key={val}
                label={val}
                active={appliedCount === val}
                onClick={() => setAppliedCount(val)}
              />
            ))}
          </div>
        </div>

        <div>
          <p
            className="text-[15px] text-gray-700 mb-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            How many companies did you <u>email</u> directly?*
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["0", "1–5", "6–20", "20+"].map((val) => (
              <OptionButton
                key={val}
                label={val}
                active={emailedCount === val}
                onClick={() => setEmailedCount(val)}
              />
            ))}
          </div>
        </div>

        <div>
          <p
            className="text-[15px] text-gray-700 mb-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            How many different companies did you <u>interview</u> with?*
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["0", "1–2", "3–5", "5+"].map((val) => (
              <OptionButton
                key={val}
                label={val}
                active={interviewedCount === val}
                onClick={() => setInterviewedCount(val)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="h-4" />
      {/* Divider + Continue (desktop) */}
      <hr className="hidden lg:block mt-6 mb-4 border-gray-200" />
      <button
        onClick={onContinue}
        disabled={!foundVia}
        className={[
          "hidden lg:block w-full py-3.5 rounded-2xl font-semibold transition-colors",
          foundVia
            ? "bg-[#5D3AF7] text-white hover:bg-[#4F2FF3]"
            : "bg-gray-100 text-gray-400 cursor-not-allowed",
        ].join(" ")}
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Continue
      </button>
    </>
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/30"
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-found-title"
      onClick={(e) => {
        // click outside closes
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ======== Desktop dialog (unchanged from your final) ======== */}
      <div className="hidden lg:block w-full max-w-6xl mx-4 bg-white rounded-[24px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] border border-gray-200 overflow-hidden">
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
              id="job-found-title"
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
          <div className="max-w-[760px]">{step === 1 && <StepOne />}</div>

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

      {/* ======== Mobile bottom sheet drawer ======== */}
      <div
        ref={sheetRef}
        className="lg:hidden fixed inset-x-0 bottom-0 z-[60]"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: dragging
            ? "none"
            : "transform 220ms cubic-bezier(.2,.8,.2,1)",
        }}
        onClick={(e) => e.stopPropagation()} // prevent overlay close when tapping sheet
      >
        <div className="mx-2 mb-2 rounded-t-[22px] bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.25)] border border-gray-200 overflow-hidden">
          {/* Header (acts as drag handle) */}
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

            {/* Stepper row */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-2">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
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
                Step {step} of {TOTAL_STEPS}
              </span>
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
            {step === 1 && <StepOne />}
          </div>

          {/* Sticky bottom action bar */}
          <div
            className="absolute inset-x-0 bottom-0 bg-white border-t border-gray-200 px-4 pb-4 pt-3"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
            }}
          >
            <button
              onClick={onContinue}
              disabled={!foundVia}
              className={[
                "w-full py-3.5 rounded-2xl font-semibold transition-colors",
                foundVia
                  ? "bg-[#5D3AF7] text-white hover:bg-[#4F2FF3]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed",
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
