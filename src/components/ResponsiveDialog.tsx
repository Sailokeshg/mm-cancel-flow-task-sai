"use client";

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: false | "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  paperSx?: Record<string, unknown> | undefined;
  /** If true, don't render at all below 1024px (prevents portal on mobile). */
  desktopOnly?: boolean;
};

export default function ResponsiveDialog({
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
  // Tailwind-aligned breakpoints
  const isDesktop = useMediaQuery("(min-width:1024px)");
  const isMobile = !isDesktop;

  // If asked to be desktop-only, don't mount on mobile (prevents portal)
  if (desktopOnly && !isDesktop) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile} // fullscreen only under 1024px
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          m: isMobile ? 0 : 2,
          overflow: "hidden",
          ...paperSx,
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(50px) brightness(0.9)",
          WebkitBackdropFilter: "blur(50px) brightness(0.9)",
        },
      }}
      aria-labelledby={
        typeof title === "string" ? "responsive-dialog-title" : undefined
      }
    >
      {title && <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>}
      <DialogContent dividers>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}
