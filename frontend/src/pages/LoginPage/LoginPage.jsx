import "./LoginPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    //don't refresh page
    e.preventDefault();

    try {
      // send email & password to backend
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

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
    <div className="login-page">
      <form className="login-content" onSubmit={handleSubmit}>
        <div className="login-title">Login</div>
        <div className="login-content-text">
          <div className="login-content-text-row">
            <div className="login-label">Username</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username" //remember in browser
              required
            />
          </div>
          <div className="login-content-text-row">
            <div className="login-label">Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password" //remember in browser
              required
            />
          </div>
        </div>
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
