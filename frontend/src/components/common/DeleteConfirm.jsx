import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function DeleteConfirm({ open, text, onCancel, onConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="delete-confirm-title"
      aria-describedby="delete-confirm-description"
    >
      <DialogTitle id="delete-confirm-title">Confirm Delete</DialogTitle>

      <DialogContent>
        <DialogContentText id="delete-confirm-description">
          {text}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>

        <Button onClick={onConfirm} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
