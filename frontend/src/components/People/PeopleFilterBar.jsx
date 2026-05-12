import { Box, Button, Card, NativeSelect } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

export default function PeopleFilterBar({
  onFilterStatus,
  filterStatus,
  onFilterName,
  filterName,
  onClear,
}) {
  return (
    <Box>
      <Card
        sx={{
          display: "flex",
          justifyContent: "space-between",
          bgcolor: "white",
          border: "1px solid #E5E7EB",
          py: 1.5,
          px: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", px: 2 }}>
          <FilterAltIcon sx={{ color: "primary.main" }} />
          <div>Filter by:</div>
          <NativeSelect
            sx={{
              bgcolor: "background.paper",
              minWidth: 120,
            }}
            onChange={(e) => onFilterStatus(e.target.value)}
            value={filterStatus}
            size="small"
          >
            <option value="">Status: All</option>
            <option value="0">Active</option>
            <option value="1">Inactive</option>
          </NativeSelect>
        </Box>
        <Box sx={{ alignItems: "center" }}>
          <Button onClick={onClear}>Clear filters</Button>
        </Box>
      </Card>
    </Box>
  );
}
