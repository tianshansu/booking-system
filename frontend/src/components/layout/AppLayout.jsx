import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import HeadBar from "./HeaderBar";
import { Outlet } from "react-router-dom";

const drawerWidth = 240;

export default function AppLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Left sidebar */}
      <Box
        component="aside"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
        }}
      >
        <Sidebar drawerWidth={drawerWidth} />
      </Box>

      {/* Right content area */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box component="header">
          <HeadBar />
        </Box>

        {/* Page content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
