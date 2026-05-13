import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6B9583",
      dark: "#4F7667",
      light: "#E7F1EC",
    },
    background: {
      default: "#F5F5F3",
      paper: "#FFFFFF",
    },
  },

  typography: {
    fontFamily: `"Roboto", "Arial", sans-serif`,

    h4: {
      fontSize: "28px",
      fontWeight: 700,
      lineHeight: 1.3,
    },

    h5: {
      fontSize: "24px",
      fontWeight: 700,
      lineHeight: 1.3,
    },

    h6: {
      fontSize: "20px",
      fontWeight: 700,
      lineHeight: 1.35,
    },

    body1: {
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: 1.5,
    },

    body2: {
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: 1.5,
      color: "#636E72",
    },

    button: {
      fontSize: "14px",
      fontWeight: 600,
      textTransform: "none",
    },
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        },
      },
    },
  },
});

export default theme;
