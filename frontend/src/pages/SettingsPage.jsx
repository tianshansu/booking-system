import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import PageContainer from "../components/common/PageContainer";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, Button, Card, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import ToastMessage from "../components/common/ToastMessage";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // update info
  const [newName, setNewName] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const closeToast = () => {
    setToast({
      ...toast,
      open: false,
    });
  };

  // fetch page
  const fetchPage = () => {
    apiFetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setEmail(data.email);
        setName(data.name);
        setNewName(data.name);
      })
      .catch((e) => console.error("fetch failed:", e));
  };
  useEffect(() => {
    fetchPage();
  }, []);

  // change account info
  const saveChange = async () => {
    try {
      const r = await apiFetch("/api/auth/change-info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
        }),
      });

      const data = await r.json();

      if (!r.ok) {
        throw new Error(data.error || `HTTP ${r.status}`);
      }

      setToast({
        open: true,
        message: "Changes saved",
        type: "success",
      });

      fetchPage();
    } catch (e) {
      setToast({
        open: true,
        message: e.message,
        type: "error",
      });
    }
  };

  const checkPassword = async () => {
    if (newPassword !== confirmPassword) {
      setToast({
        open: true,
        message: "Passwords does not match!",
        type: "error",
      });

      return;
    }

    try {
      const r = await apiFetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await r.json();

      if (!r.ok) {
        throw new Error(data.error || `HTTP ${r.status}`);
      }

      setToast({
        open: true,
        message: "Password changed successfully!",
        type: "success",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      setToast({
        open: true,
        message: e.message,
        type: "error",
      });
    }
  };

  return (
    <PageContainer>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "100%", sm: 360 },
            height: { xs: "100%", sm: 120 },
            px: 3,
            py: 2,
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Account Profile
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <AccountCircleIcon sx={{ fontSize: 60, color: "primary.main" }} />
            <Box>
              <Typography sx={{ fontWeight: 600 }}>{name}</Typography>
              <Typography>{email}</Typography>
            </Box>
          </Box>
        </Card>

        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "100%", sm: 360 },
            px: 3,
            py: 2,
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Account Information
          </Typography>
          <Box
            component="form"
            sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              value={email}
              InputProps={{
                readOnly: true,
              }}
            />
            <Button variant="contained" onClick={saveChange}>
              Save Changes
            </Button>
          </Box>
        </Card>
      </Box>

      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", sm: 736 },
          px: 3,
          py: 2,
          gap: 1,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Change Password
        </Typography>

        <Box
          component="form"
          sx={{ display: "flex", gap: 2 }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-basic"
            label="Current Password"
            variant="outlined"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="New Password"
            variant="outlined"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Box>
        <Button
          variant="contained"
          sx={{ width: { xs: "100%", sm: 200 } }}
          onClick={() => checkPassword()}
        >
          Save Changes
        </Button>
      </Card>

      <ToastMessage
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />
    </PageContainer>
  );
}
