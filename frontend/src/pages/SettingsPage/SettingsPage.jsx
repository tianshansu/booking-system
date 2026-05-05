import { useEffect, useState } from "react";
import "./SettingsPage.css";
import { apiFetch } from "../../api";
import OverlayModal from "../../components/common/OverlayModal";

export default function SettingsPage() {
  const [email, setEmail] = useState([]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showMsg, setShowMsg] = useState(false);
  const [msg, setMsg] = useState("");

  const [showChangePswPanel, setShowChangePswPanel] = useState(false);

  // fetch page
  useEffect(() => {
    apiFetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setEmail(data.email);
      })
      .catch((e) => console.error("fetch failed:", e));
  }, []);

  const checkPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMsg("Passwords does not match!");
      setShowMsg(true);
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

      setMsg("Password changed successfully!");
      setShowMsg(true);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePswPanel(false);
    } catch (e) {
      setMsg(e.message);
      setShowMsg(true);
    }
  };

  return (
    <div className="settings">
      <div className="settings-group">
        <div className="settings-group-title">Account Info</div>
        <div className="settings-group-item">
          <div className="settings-group-name">Email:</div>
          <div className="settings-group-value">{email}</div>
        </div>
        <div className="settings-group-item">
          <div className="settings-group-name">Role:</div>
          <div className="settings-group-value">Admin</div>
        </div>
      </div>

      <div className="settings-group">
        <div className="settings-group-title">Security</div>
        <div className="settings-group-item">
          <button
            className="settings-group-name"
            onClick={() => setShowChangePswPanel(true)}
          >
            Change Password
          </button>
          {showChangePswPanel && (
            <OverlayModal
              open={showChangePswPanel}
              title={"Change Password"}
              onClose={() => setShowChangePswPanel(false)}
            >
              <div className="settings-group">
                <div className="settings-group-item">
                  <div className="settings-group-name">Current Password:</div>
                  <input
                    className="settings-group-input"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="settings-group-item">
                  <div className="settings-group-name">New Password:</div>
                  <input
                    className="settings-group-input"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="settings-group-item">
                  <div className="settings-group-name">Confirm Password:</div>
                  <input
                    className="settings-group-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button
                  className="settings-submit"
                  type="submit"
                  onClick={() => checkPassword()}
                >
                  Submit
                </button>
              </div>
            </OverlayModal>
          )}
        </div>
        {showMsg && <div className="toast-message">{msg}</div>}
      </div>
    </div>
  );
}
