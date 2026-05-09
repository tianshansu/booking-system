import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { NavLink } from "react-router-dom";

const mainNavItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: <DashboardIcon />,
  },
  {
    label: "People",
    path: "/people",
    icon: <PeopleIcon />,
  },
  {
    label: "Sessions",
    path: "/sessions",
    icon: <EventIcon />,
  },
];

const footerNavItems = [
  {
    label: "Settings",
    path: "/settings",
    icon: <SettingsIcon />,
  },
];

export default function Sidebar() {
  return (
    <Box
      component="nav"
      sx={{
        height: "100vh",
        bgcolor: "background.paper",
        borderRight: "1px solid #E5E7EB",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Sidebar title */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CalendarMonthIcon fontSize="small" />
        </Box>

        <Box>
          <Typography variant="h6" color="text.primary">
            Booking System
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Admin Portal
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Main navigation */}
      <List sx={{ px: 1.5, py: 2 }}>
        {mainNavItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            end={item.path === "/"}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              color: "text.secondary",

              "& .MuiListItemIcon-root": {
                color: "text.secondary",
              },

              "&.active": {
                bgcolor: "primary.main",
                color: "white",

                "& .MuiListItemIcon-root": {
                  color: "white",
                },
              },

              "&:hover": {
                bgcolor: "primary.light",
                color: "white",

                "& .MuiListItemIcon-root": {
                  color: "white",
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      {/* Push footer to bottom */}
      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      {/* Footer navigation */}
      <List sx={{ px: 1.5, py: 2 }}>
        {footerNavItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              color: "text.secondary",

              "& .MuiListItemIcon-root": {
                color: "text.secondary",
              },

              "&.active": {
                bgcolor: "primary.main",
                color: "white",

                "& .MuiListItemIcon-root": {
                  color: "white",
                },
              },

              "&:hover": {
                bgcolor: "primary.light",
                color: "white",

                "& .MuiListItemIcon-root": {
                  color: "white",
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}

        <ListItemButton
          sx={{
            borderRadius: 2,
            color: "text.secondary",

            "& .MuiListItemIcon-root": {
              color: "text.secondary",
            },

            "&:hover": {
              bgcolor: "primary.light",
              color: "white",

              "& .MuiListItemIcon-root": {
                color: "white",
              },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Help" />
        </ListItemButton>
      </List>
    </Box>
  );
}
