import "./SessionsRow.css";

export default function SessionsRow({ session, onEdit, onDelete }) {
  return (
    <tr className="sessions-row">
      {/* <td className="sessions-row-cell sessions-row-checkbox">
        <input type="checkbox"></input>
      </td> */}
      <td className="sessions-row-cell">
        <p>{session.title}</p>
      </td>
      <td className="sessions-row-cell">
        <p>{session.patientName}</p>
      </td>
      <td className="sessions-row-cell">
        <p>{session.staff}</p>
      </td>
      <td className="sessions-row-cell">
        <p>
          {session.status === 0
            ? "Scheduled"
            : session.status === 1
              ? "Completed"
              : "Canceled"}
        </p>
      </td>
      <td className="sessions-row-cell">
        <p>{session.date}</p>
      </td>
      <td className="sessions-row-cell">
        <p>{session.time}</p>
      </td>
      <td className="sessions-row-cell">
        <p>{session.duration}</p>
      </td>
      <td className="sessions-row-cell sessions-row-actions">
        <button
          type="button"
          className="sessions-row-action-button"
          style={{ color: "#4338CA" }}
          onClick={() => {
            onEdit(session);
          }}
        >
          Edit
        </button>
        <button
          type="button"
          className="sessions-row-action-button"
          style={{ color: "#DC2626" }}
          onClick={() => onDelete(session.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
