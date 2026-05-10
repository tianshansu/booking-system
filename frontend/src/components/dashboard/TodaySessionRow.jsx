import { useState } from "react";
import "../../styles/popups.css";
import { Box, Button, IconButton, ListItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ClickAwayListener from "@mui/material/ClickAwayListener";

export default function TodaySessionRow({
  session,
  onMarkCompleted,
  onMarkCanceled,
}) {
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
      <Box sx={{ width: "60px" }}>{session.time}</Box>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ fontWeight: 600 }}>{session.name}</Box>
        <Box sx={{ color: "gray" }}>{session.patientName}</Box>
        <Box>{session.status === 0 ? "Scheduled" : "Completed"}</Box>
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
                  onMarkCompleted(session.id);
                }}
              >
                Mark As Completed
              </Button>
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
