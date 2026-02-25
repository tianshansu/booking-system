import "./SessionsTable.css";
import SessionsRow from "./SessionsRow";
import { sessions } from "../../data/mockSessions";

export default function SessionsTable() {
  return (
    <div className="sessions-table">
      <table className="sessions-table-table">
        <thead>
          <tr>
            <th scope="col" className="sessions-table-table-header">
              <input type="checkbox"></input>
            </th>
            <th scope="col" className="sessions-table-table-header">
              SESSION
            </th>
            <th scope="col" className="sessions-table-table-header">
              PATIENT
            </th>
            <th scope="col" className="sessions-table-table-header">
              STAFF
            </th>
            <th scope="col" className="sessions-table-table-header">
              STATUS
            </th>
            <th scope="col" className="sessions-table-table-header">
              DATE
            </th>
            <th scope="col" className="sessions-table-table-header">
              TIME
            </th>
            <th scope="col" className="sessions-table-table-header">
              DURATION
            </th>
            <th scope="col" className="sessions-table-table-header">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <SessionsRow key={session.id} session={session} />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={8} className="sessions-table-table-footer">
              <div className="sessions-table-table-footer-content">
                Showing 1-5 of 42 sessions
                <div className="sessions-table-table-footer-buttons">
                  <button
                    type="button"
                    className="sessions-table-table-footer-button"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="sessions-table-table-footer-button"
                  >
                    Next
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
