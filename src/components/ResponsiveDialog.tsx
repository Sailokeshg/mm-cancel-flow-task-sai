"use client";

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: false | "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  paperSx?: any;
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
}: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 3,
          m: fullScreen ? 0 : 2,
          overflow: "hidden",
          ...paperSx,
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
