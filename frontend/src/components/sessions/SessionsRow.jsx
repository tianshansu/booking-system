import "./SessionsRow.css";

export default function SessionsRow({ session }) {
  return (
    <tr className="sessions-row">
      <td className="sessions-row-cell sessions-row-checkbox">
        <input type="checkbox"></input>
      </td>
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
        <p>{session.status}</p>
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
        >
          Edit
        </button>
        <button
          type="button"
          className="sessions-row-action-button"
          style={{ color: "#DC2626" }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
