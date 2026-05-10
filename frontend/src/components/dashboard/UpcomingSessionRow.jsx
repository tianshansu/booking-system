import { useState } from "react";
import "../../styles/popups.css";
import { Box, Button, IconButton, ListItem } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function UpcomingSessionRow({ session, onMarkCanceled }) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <ListItem
      sx={{
        display: "flex",
        alignItems: "center",
        px: 4,
        borderBottom: "1px solid #E5E7EB",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "grid" }}>
        <Box sx={{ display: "flex", gap: 10 }}>
          <div>{session.date}</div>
          <div style={{ color: "gray" }}>{session.time}</div>
        </Box>
        <div style={{ fontWeight: 600 }}>{session.name}</div>
        <div style={{ color: "gray" }}>{session.patientName}</div>
      </Box>

      <ClickAwayListener onClickAway={() => setShowOptions(false)}>
        <Box sx={{ position: "relative" }}>
          <IconButton onClick={() => setShowOptions((prev) => !prev)}>
            <MoreVertIcon />
          </IconButton>

          {showOptions && (
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                right: 0,
                zIndex: 10,
                minWidth: 180,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                boxShadow: 3,
                py: 1,
              }}
            >
              <Button
                onClick={() => {
                  setShowOptions(false);
                  onMarkCanceled(session.id);
                }}
              >
                Mark As Canceled
              </Button>
            </Box>
          )}
        </Box>
      </ClickAwayListener>
    </ListItem>
  );
}
