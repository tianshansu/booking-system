import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    //don't refresh page
    e.preventDefault();

    try {
      // send email & password to backend
      const r = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!r) return;

      // proceed only if backend successfully returned
      if (!r.ok) {
        throw new Error(`Login failed (HTTP ${r.status})`);
      }

      // get json from backend
      const data = await r.json();

      // store token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      //navigate to dashboard page
      navigate("/");
    } catch (err) {
      console.error("login failed:", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        component="form"
        sx={{
          width: 420,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 4,
          py: 4,
          gap: 2,
        }}
        onSubmit={handleSubmit}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.8,
          }}
        >
          <Typography variant="h6" sx={{ color: "primary.main" }}>
            Booking System
          </Typography>
          <Typography variant="body2">Appointment Management Portal</Typography>
        </Box>
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          fullWidth
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username" //remember in browser
          required
        />
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password" //remember in browser
          required
        />

        <Button variant="contained" fullWidth type="submit">
          Login
        </Button>
      </Card>
    </Box>
  );
}
