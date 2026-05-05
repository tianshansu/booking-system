import { useState } from "react";
import "../../styles/popups.css";

export default function UpcomingSessionRow({ session, onMarkCanceled }) {
  const [showOptions, setShowOptions] = useState(false);
  const styles = {
    row: {
      display: "flex",
      padding: "20px",
      borderBottom: "1px solid #E5E7EB",
      justifyContent: "space-between",
    },
    dateTime: {
      display: "flex",
      gap: 10,
    },
    content: {
      display: "grid",
    },
    icon: {
      height: 20,
    },
    button: {
      background: "none",
      border: "none",
    },
  };

  return (
    <div style={styles.row}>
      <div style={styles.content}>
        <div style={styles.dateTime}>
          <div>{session.date}</div>
          <div style={{ color: "gray" }}>{session.time}</div>
        </div>
        <div style={{ fontWeight: 600 }}>{session.name}</div>
        <div style={{ color: "gray" }}>{session.patientName}</div>
      </div>
      <div className="actions">
        <button
          type="button"
          className="button"
          onClick={() => setShowOptions((prev) => !prev)}
          aria-label="View more options"
        >
          <img src="/icons/more.svg" style={styles.icon} alt="more info"></img>
        </button>

        {showOptions && (
          <div className="menu">
            <button
              className="menu-items"
              onClick={() => {
                setShowOptions(false);
                onMarkCanceled(session.id);
              }}
            >
              Mark As Canceled
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
