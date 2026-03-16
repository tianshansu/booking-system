import "./SessionsTable.css";
import SessionsRow from "./SessionsRow";
// import { sessions } from "../../data/mockSessions";

export default function SessionsTable({
  sessions,
  onEdit,
  setCurrentPage,
  currentPage,
  totalPages,
}) {
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
            <SessionsRow key={session.id} session={session} onEdit={onEdit} />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={9} className="sessions-table-table-footer">
              <div className="sessions-table-table-footer-content">
                Showing page {currentPage} of {totalPages} pages
                <div className="sessions-table-table-footer-buttons">
                  <button
                    type="button"
                    className="sessions-table-table-footer-button"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="sessions-table-table-footer-button"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage === totalPages}
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
