import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#F5F5F3",
      paper: "#FFFFFF",
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
