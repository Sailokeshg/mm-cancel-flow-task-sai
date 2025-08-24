"use client";

import React from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { SxProps } from "@mui/system";
import type { Theme } from "@mui/material/styles";

/**
 * Props for ResponsiveDialog
 * - behavior is unchanged from previous implementation
 */
type Props = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: DialogProps["maxWidth"];
  fullWidth?: boolean;
  paperSx?: SxProps<Theme> | undefined;
  /** If true, don't render at all below DESKTOP_MIN_WIDTH (prevents portal on mobile). */
  desktopOnly?: boolean;
};

// Keep UI-related constants near the top so they're easy to adjust and test.
const DESKTOP_MIN_WIDTH_PX = 1024; // Tailwind 'lg' alignment
const ARIA_TITLE_ID = "responsive-dialog-title";
const BACKDROP_RGBA = "rgba(255,255,255,0.55)";
const BACKDROP_BLUR = "blur(50px) brightness(0.9)";

function ResponsiveDialog({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "lg",
  fullWidth = true,
  paperSx,
  desktopOnly = false,
}: Props) {
  // Tailwind-aligned breakpoint check. Kept as px string to avoid coupling
  // to a theme implementation but still be easy to change.
  const isDesktop = useMediaQuery(`(min-width:${DESKTOP_MIN_WIDTH_PX}px)`);
  const isBelowDesktop = !isDesktop;

  // If asked to be desktop-only, don't mount on smaller viewports (prevents portal mounting)
  if (desktopOnly && isBelowDesktop) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isBelowDesktop}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      PaperProps={{
        sx: {
          // Use small-radius on desktop, flush on mobile to match a full-screen feel
          borderRadius: isBelowDesktop ? 0 : 3,
          m: isBelowDesktop ? 0 : 2,
          overflow: "hidden",
          ...paperSx,
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: BACKDROP_RGBA,
          backdropFilter: BACKDROP_BLUR,
          WebkitBackdropFilter: BACKDROP_BLUR,
        },
      }}
      aria-labelledby={typeof title === "string" ? ARIA_TITLE_ID : undefined}
    >
      {title && <DialogTitle id={ARIA_TITLE_ID}>{title}</DialogTitle>}
      <DialogContent dividers>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}

export default React.memo(ResponsiveDialog);
