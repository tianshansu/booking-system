import { Box, Typography } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import EventNoteIcon from "@mui/icons-material/EventNote";

export default function RecentActivityListRow({ activity }) {
  function formatTimeAgo(dateString) {
    const diffHours = Math.floor(
      (Date.now() - new Date(dateString)) / (1000 * 60 * 60),
    );

    if (diffHours < 1) return "just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  }

  function getActivityIcon(message) {
    const text = message.toLowerCase();

    if (text.includes("completed")) {
      return <EventAvailableIcon />;
    }

    if (text.includes("canceled")) {
      return <EventBusyIcon />;
    }

    return <EventNoteIcon />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        px: 2,
        py: 1,
        borderBottom: "1px solid #E5E7EB",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {getActivityIcon(activity.message)}
      </Box>
      <Box>
        <Typography>{activity.message}</Typography>
        <Typography>{formatTimeAgo(activity.createdAt)}</Typography>
      </Box>
    </Box>
  );
}
