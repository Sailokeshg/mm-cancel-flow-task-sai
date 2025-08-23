"use client";

import React from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface MUIDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpen?: () => void;
  title: string;
  children: React.ReactNode;
  headerContent?: React.ReactNode; // Additional content in header (like stepper)
  backButton?: {
    onBack: () => void;
    label?: string;
  };
  stickyFooter?: React.ReactNode;
  showGrabHandle?: boolean;
  maxHeight?: string;
}

// Styled components for custom styling
const StyledPaper = styled("div")(({ theme }) => ({
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  backgroundColor: "white",
  height: "75vh", // Fixed height to match Figma
  maxHeight: "75vh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}));

const GrabHandle = styled("div")(() => ({
  width: 48,
  height: 6,
  backgroundColor: "#9CA3AF", // gray-400 - more visible
  borderRadius: 3,
  margin: "12px auto 8px auto",
  cursor: "grab",
  "&:active": {
    cursor: "grabbing",
  },
}));

const HeaderContainer = styled(Box)(() => ({
  padding: "12px 16px",
  borderBottom: "1px solid #E5E7EB", // gray-200
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  minHeight: 48,
}));

const ContentContainer = styled(Box)(() => ({
  flex: 1,
  overflow: "auto",
  padding: "16px",
  paddingBottom: "32px", // Extra padding for sticky footer
  WebkitOverflowScrolling: "touch",
}));

const StickyFooter = styled(Box)(() => ({
  position: "sticky",
  bottom: 0,
  backgroundColor: "white",
  borderTop: "1px solid #E5E7EB", // gray-200
  padding: "12px 16px 16px 16px",
  paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
}));

const BackButtonContainer = styled(Box)(() => ({
  padding: "12px 16px",
  borderBottom: "1px solid #E5E7EB", // gray-200
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
  maxHeight = "90vh",
}: MUIDrawerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  
  // Detect iOS for performance optimizations
  const iOS =
    typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Don't render on desktop - only show on mobile
  if (!isMobile) {
    return null;
  }

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      variant="temporary"
      ModalProps={{
        keepMounted: true,
        sx: {
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
        },
      }}
      PaperProps={{
        sx: {
          backgroundColor: "transparent",
          boxShadow: "none",
          height: "auto",
          maxHeight: "75vh", // Reduced from 90vh to match Figma
          overflow: "visible",
        },
      }}
      sx={{
        "& .MuiDrawer-paper": {
          backgroundColor: "transparent",
          boxShadow: "none",
          height: "auto",
          maxHeight: "75vh",
          overflow: "visible",
        },
      }}
    >
      <Box sx={{ mx: 1, mb: 1 }}>
        <StyledPaper
          sx={{
            height: "75vh", // Fixed height to match Figma
            boxShadow: "0 -12px 40px rgba(0,0,0,0.25)",
            border: "1px solid #E5E7EB",
          }}
        >
          {/* Grab handle */}
          {showGrabHandle && <GrabHandle />}

          {/* Header */}
          <HeaderContainer>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 600,
                fontSize: "16px",
                color: "#111827", // gray-900
                textAlign: "center",
                flex: 1,
              }}
            >
              {title}
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9CA3AF", // gray-400
                "&:hover": {
                  color: "#4B5563", // gray-600
                },
              }}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
          </HeaderContainer>

          {/* Additional header content (like stepper) */}
          {headerContent && (
            <>
              <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #E5E7EB" }}>
                {headerContent}
              </Box>
            </>
          )}

          {/* Back button */}
          {backButton && (
            <BackButtonContainer>
              <Box
                component="button"
                onClick={backButton.onBack}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  background: "none",
                  border: "none",
                  color: "#374151", // gray-700
                  cursor: "pointer",
                  padding: 0,
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "14px",
                  "&:hover": {
                    color: "#111827", // gray-900
                  },
                }}
                aria-label="Back"
              >
                <ArrowBackIcon sx={{ fontSize: 20 }} />
                {backButton.label || "Back"}
              </Box>
            </BackButtonContainer>
          )}

          {/* Scrollable content */}
          <ContentContainer sx={{ pb: stickyFooter ? 10 : 4 }}>
            {children}
          </ContentContainer>

          {/* Sticky footer */}
          {stickyFooter && <StickyFooter>{stickyFooter}</StickyFooter>}
        </StyledPaper>
      </Box>
    </SwipeableDrawer>
  );
}
