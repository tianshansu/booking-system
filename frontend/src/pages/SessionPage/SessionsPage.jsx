import "./SessionsPage.css";
import SessionsFilterBar from "../../components/sessions/SessionsFilterBar";
import SessionsTable from "../../components/sessions/SessionsTable";
import { useEffect, useState } from "react";
import { apiFetch } from "../../api";

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    apiFetch("/api/sessions")
      .then((r) => {
        if (!r.ok) return;
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setSessions(data);
      })
      .catch((e) => console.error("fetch failed:", e));
  }, []);

  return (
    <>
      <div className="sessions">
        <div className="sessions-header">
          <div>View and manage all sessions in the system.</div>
          <div className="sessions-header-buttons">
            <button className="sessions-header-button" type="button">
              <img
                className="sessions-header-button-img"
                src="/icons/import.svg"
                alt="import icon"
              ></img>
              <div className="sessions-header-button-text">Export</div>
            </button>

            <div className="sessions-header-buttons">
              <button
                className="sessions-header-button"
                style={{ backgroundColor: "#4338CA", border: "none" }}
                type="button"
              >
                <img
                  className="sessions-header-button-img"
                  src="/icons/add.svg"
                  alt="add session"
                ></img>
                <div
                  className="sessions-header-button-text"
                  style={{ color: "white" }}
                >
                  Add session
                </div>
              </button>
            </div>
          </div>
        </div>
        <SessionsFilterBar />
        <SessionsTable sessions={sessions} />
      </div>
    </>
  );
}
