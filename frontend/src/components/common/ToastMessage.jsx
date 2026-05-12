import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function ToastMessage({ open, message, type, onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={type} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
