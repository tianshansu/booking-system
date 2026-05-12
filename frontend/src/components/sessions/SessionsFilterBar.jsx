import { Box, Button, Card, NativeSelect } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

export default function SessionsFilterBar({
  onFilterStatus,
  filterStatus,
  onFilterStaff,
  filterStaff,
  onFilterSortTime,
  filterSortTime,
  staffOptions,
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
            onChange={(e) => onFilterStatus(e.target.value)}
            value={filterStatus}
          >
            <option value="">Status: All</option>
            <option value="0">Scheduled</option>
            <option value="1">Completed</option>
            <option value="2">Canceled</option>
          </NativeSelect>

          <NativeSelect
            onChange={(e) => onFilterStaff(e.target.value)}
            value={filterStaff}
          >
            <option value="">Staff: All</option>
            {staffOptions.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name}
              </option>
            ))}
          </NativeSelect>
        </Box>
        <Box>
          <Button onClick={onClear}>Clear filters</Button>
        </Box>
      </Card>
    </Box>
  );
}
