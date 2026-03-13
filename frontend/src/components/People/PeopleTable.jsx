import "./PeopleTable.css";
import PeopleRow from "./PeopleRow";

export default function PeopleTable({ people, onDelete, onEdit, currentPage, totalPages, setCurrentPage }) {
  return (
    <div className="people-table">
      <table className="people-table-table">
        <thead>
          <tr>
            <th scope="col" className="people-table-table-header">
              <input type="checkbox"></input>
            </th>
            <th scope="col" className="people-table-table-header">
              NAME
            </th>
            <th scope="col" className="people-table-table-header">
              EMAIL
            </th>
            <th scope="col" className="people-table-table-header">
              PHONE
            </th>
            <th scope="col" className="people-table-table-header">
              STATUS
            </th>
            <th scope="col" className="people-table-table-header">
              LAST SESSION
            </th>
            <th scope="col" className="people-table-table-header">
              NOTES
            </th>
            <th scope="col" className="people-table-table-header">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <PeopleRow
              key={person.id}
              person={person}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={8} className="people-table-table-footer">
              <div className="people-table-table-footer-content">
                Showing page {currentPage} of {totalPages} pages
                <div className="people-table-table-footer-buttons">
                  <button
                    type="button"
                    className="people-table-table-footer-button"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="people-table-table-footer-button"
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
