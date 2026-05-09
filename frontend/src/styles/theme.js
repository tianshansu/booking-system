import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5D7C6B",
      light: "#8B9D8F",
      dark: "#3F594A",
    },
    secondary: {
      main: "#C8A97E",
    },
    background: {
      default: "#F7F8F5",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2D2D2D",
      secondary: "#6B7280",
    },
  },

  shape: {
    borderRadius: 14,
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "8px 18px",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
  },
});

export default theme;
