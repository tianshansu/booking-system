import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Card } from "@mui/material";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";

export default function PeopleTable({ people, onDelete, onEdit }) {
  const [selectedNote, setSelectedNote] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);

  const columns = [
    { field: "name", headerName: "NAME", flex: 1 },
    { field: "email", headerName: "EMAIL", flex: 1.7 },
    { field: "phone", headerName: "PHONE", flex: 1 },
    { field: "status", headerName: "STATUS", flex: 0.8 },
    { field: "lastSession", headerName: "LAST SESSION", flex: 1 },
    {
      field: "notes",
      headerName: "NOTES",
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <Typography
          noWrap
          sx={{
            cursor: "pointer",
            width: "100%",
            color: params.value ? "text.primary" : "text.disabled",
          }}
          onClick={() => {
            setSelectedNote(params.value || "No notes.");
            setNoteOpen(true);
          }}
        >
          {params.value || "-"}
        </Typography>
      ),
    },
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
        rows={people}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{
          border: 0,
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
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
      <Dialog
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Notes</DialogTitle>
        <DialogContent>
          <Typography sx={{ whiteSpace: "pre-wrap" }}>
            {selectedNote}
          </Typography>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
