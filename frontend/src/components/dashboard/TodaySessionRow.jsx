import { useState } from "react";
import "../../styles/popups.css";

export default function TodaySessionRow({
  session,
  onMarkCompleted,
  onMarkCanceled,
}) {
  const [showOptions, setShowOptions] = useState(false);

  const styles = {
    row: {
      display: "flex",
      alignItems: "center",
      padding: "20px",
      borderBottom: "1px solid #E5E7EB",
      justifyContent: "space-between",
    },
    time: {
      width: "60px",
    },
    info: {
      flex: 1,
    },
    icon: {
      height: 20,
    },
  }; // style

  return (
    <div style={styles.row}>
      <div style={styles.time}>{session.time}</div>
      <div style={styles.info}>
        <div style={{ fontWeight: 600 }}>{session.name}</div>
        <div style={{ color: "gray" }}>{session.patientName}</div>
        <div>{session.status === 0 ? "Scheduled" : "Completed"}</div>
      </div>
      <div className="actions">
        <button
          type="button"
          className="button"
          onClick={() => setShowOptions((prev) => !prev)}
        >
          <img src="/icons/more.svg" style={styles.icon} alt="more info"></img>
        </button>

        {showOptions && (
          <div className="menu">
            <button
              className="menu-items"
              onClick={() => {
                setShowOptions(false);
                onMarkCompleted(session.id);
              }}
            >
              Mark As Completed
            </button>
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
    // details in render
  );
}
