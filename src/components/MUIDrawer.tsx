"use client";

import React from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface MUIDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpen?: () => void;
  title: string;
  children: React.ReactNode;
  headerContent?: React.ReactNode; // stepper
  backButton?: { onBack: () => void; label?: string };
  stickyFooter?: React.ReactNode;
  showGrabHandle?: boolean;
  maxHeight?: string;
}

const useIsMobile = () => useMediaQuery("(max-width: 1023.98px)");

const GrabHandle = styled("div")(() => ({
  width: 44,
  height: 5,
  backgroundColor: "rgba(17, 24, 39, 0.18)",
  borderRadius: 999,
  margin: "10px auto 6px auto",
}));

/** Top bar: title left + close right */
const HeaderTop = styled(Box)(() => ({
  padding: "12px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minHeight: 52,
}));

const Content = styled(Box)(() => ({
  flex: 1,
  overflow: "auto",
  padding: "16px 20px 24px 20px",
  WebkitOverflowScrolling: "touch",
}));

const Footer = styled(Box)(() => ({
  position: "sticky",
  bottom: 0,
  backgroundColor: "white",
  borderTop: "1px solid #E5E7EB",
  padding: "12px 20px",
  paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
}));

export default function MUIDrawer({
  open,
  onClose,
  onOpen = () => {},
  title,
  children,
  headerContent,
  backButton,
  stickyFooter,
  showGrabHandle = true,
  maxHeight = "min(75dvh,75vh)",
}: MUIDrawerProps) {
  const isMobile = useIsMobile();
  if (!isMobile) return null;

  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      ModalProps={{
        keepMounted: true,
        sx: { "& .MuiBackdrop-root": { backgroundColor: "rgba(0,0,0,0.35)" } },
      }}
      PaperProps={{
        sx: {
          alignSelf: "flex-end",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          backgroundColor: "white",
          boxShadow: "0 -20px 60px rgba(0,0,0,0.25)",
          border: "1px solid #E5E7EB",
          height: "auto",
          maxHeight,
          overflow: "hidden",
        },
      }}
      sx={{
        "& .MuiDrawer-paper": {
          alignSelf: "flex-end",
          height: "auto",
          maxHeight,
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", maxHeight: "inherit" }}>
        {showGrabHandle && <GrabHandle />}

        {/* Row 1: Title (left) + Close (right) */}
        <HeaderTop>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 700,
              fontSize: "20px",
              letterSpacing: "-0.01em",
              color: "#111827",
            }}
          >
            {title}
          </Typography>

          <IconButton
            onClick={onClose}
            sx={{
              color: "#6B7280",
              "&:hover": { color: "#374151" },
            }}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
        </HeaderTop>

        {/* Row 2: Stepper (left aligned) */}
        {headerContent && (
          <Box sx={{ px: 2, py: 1.25, display: "flex", justifyContent: "flex-start" }}>
            {headerContent}
          </Box>
        )}

        {/* Row 3: Back button (left aligned) */}
        {backButton && (
          <Box sx={{ px: 2.5, py: 1.25 }}>
            <Box
              component="button"
              onClick={backButton.onBack}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                background: "none",
                border: "none",
                color: "#374151",
                cursor: "pointer",
                padding: 0,
                fontFamily: "var(--font-dm-sans)",
                fontSize: "14px",
                "&:hover": { color: "#111827" },
              }}
              aria-label="Back"
            >
              <ArrowBackIcon sx={{ fontSize: 20 }} />
              {backButton.label || "Back"}
            </Box>
          </Box>
        )}

        <Content sx={{ pb: stickyFooter ? 10 : 4 }}>{children}</Content>

        {stickyFooter && <Footer>{stickyFooter}</Footer>}
      </Box>
    </SwipeableDrawer>
  );
}
