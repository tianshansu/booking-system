import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Card } from "@mui/material";

export default function SessionsTable({ sessions, onEdit, onDelete }) {
  const columns = [
    { field: "name", headerName: "SESSION", flex: 1.5 },
    { field: "patientName", headerName: "PATIENT", flex: 1 },
    { field: "staff", headerName: "STAFF", flex: 1 },
    {
      field: "status",
      headerName: "STATUS",
      flex: 0.8,
      valueFormatter: (value) => {
        if (value === 0) return "Scheduled";
        if (value === 1) return "Completed";
        if (value === 2) return "Canceled";
        return "";
      },
    },
    { field: "date", headerName: "DATE", flex: 1 },
    { field: "time", headerName: "TIME", flex: 1 },
    { field: "duration", headerName: "DURATION", flex: 0.8 },
    {
      field: "actions",
      headerName: "ACTIONS",
      flex: 1,
      minWidth: 160,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            height: "100%",
            width: "100%",
          }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={() => onEdit(params.row)}
          >
            Edit
          </Button>

          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => onDelete(params.row)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Card sx={{ height: 400, width: "100%", px: 2 }}>
      <DataGrid
        rows={sessions}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{
          border: 0,
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
          },

          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
          "& .MuiDataGrid-columnHeader:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-columnHeader:focus-within": {
            outline: "none",
          },
        }}
      />
    </Card>
  );
}
