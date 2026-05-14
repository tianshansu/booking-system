import { Divider, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";

export default function ListPanel(props) {
  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Box sx={{ px: 1, py: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {props.title}
        </Typography>
        <Typography variant="body1">{props.subtitle}</Typography>
      </Box>
      <Divider />

      <List>{props.children}</List>

      {props.footer && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {props.footer}
        </Box>
      )}
    </Box>
  );
}
