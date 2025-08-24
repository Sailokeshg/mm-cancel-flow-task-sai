"use client";

import React from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { SxProps } from "@mui/system";
import type { Theme } from "@mui/material/styles";


type Props = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: DialogProps["maxWidth"];
  fullWidth?: boolean;
  paperSx?: SxProps<Theme> | undefined;
  desktopOnly?: boolean;
};

const DESKTOP_MIN_WIDTH_PX = 1024;
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

  const isDesktop = useMediaQuery(`(min-width:${DESKTOP_MIN_WIDTH_PX}px)`);
  const isBelowDesktop = !isDesktop;

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
