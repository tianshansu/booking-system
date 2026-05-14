import { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  ClickAwayListener,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function OverlayModal({ open, title, onClose, children }) {
  // make sure the outside content does not move
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  // only show when open is true
  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(0, 0, 0, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
      }}
    >
      <ClickAwayListener onClickAway={onClose}>
        <Card
          sx={{
            width: 500,
            maxWidth: "90vw",
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            p: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">{title}</Typography>
            <Button onClick={onClose}>
              <CloseIcon />
            </Button>
          </Box>

          <Box
            sx={{
              overflowY: "auto",
              pr: 1,
            }}
          >
            {children}
          </Box>
        </Card>
      </ClickAwayListener>
    </Box>
  );
}
