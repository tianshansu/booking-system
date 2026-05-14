import { Card, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function Searchbar({ placeholder, value, onChange }) {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        px: 1.5,
        mt: 1.5,
        minWidth: 200,
      }}
    >
      <SearchIcon sx={{ color: "primary.main" }} />
      <TextField
        variant="standard"
        type="text"
        slotProps={{
          input: {
            disableUnderline: true,
          },
        }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </Card>
  );
}
