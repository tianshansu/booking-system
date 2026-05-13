import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";

const TITLE_MAP = {
  "/": "Dashboard",
  "/people": "People",
  "/sessions": "Sessions",
  "/settings": "Settings",
  "/help": "Help & Support",
};

const SUBTITLE_MAP = {
  "/": "Welcome back!",
  "/people": "Manage clients and records",
  "/sessions": "Manage sessions",
  "/settings": "Manage your account",
  "/help":
    "Find answers to common questions or get in touch with our support team",
};

export default function HeaderBar() {
  const location = useLocation();
  const path = location.pathname;

  const title = TITLE_MAP[path] ?? "Dashboard";
  const subtitle = SUBTITLE_MAP[path] ?? "Welcome back!";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid #E5E7EB",
        py: 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: 72,
          px: 3,
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h5">{title}</Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
