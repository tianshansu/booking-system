import Box from "@mui/material/Box";

export default function PageContainer({ children }) {
  return (
    <Box
      sx={{
        display: "grid",
        minHeight: "100vh",
        alignContent: "start",
        gap: 2,
      }}
    >
      {children}
    </Box>
  );
}
