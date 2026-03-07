import "./PeopleRow.css";

export default function PeopleRow({ person, onDelete }) {
  return (
    <tr className="people-row">
      <td className="people-row-cell people-row-checkbox">
        <input type="checkbox"></input>
      </td>
      <td className="people-row-cell people-row-name">
        <p>{person.name}</p>
      </td>
      <td className="people-row-cell people-row-email">
        <p>{person.email}</p>
      </td>
      <td className="people-row-cell people-row-phone">
        <p>{person.phone}</p>
      </td>
      <td className="people-row-cell people-row-status">
        <p>{person.status}</p>
      </td>
      <td className="people-row-cell people-row-last-session">
        <p>{person.lastSession}</p>
      </td>
      <td className="people-row-cell people-row-notes">
        <p>{person.notes}</p>
      </td>
      <td className="people-row-cell people-row-actions">
        <button
          type="button"
          className="people-row-action-button"
          style={{ color: "#4338CA" }}
        >
          Edit
        </button>
        <button
          type="button"
          className="people-row-action-button"
          style={{ color: "#DC2626" }}
          onClick={() => onDelete(person.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
