import "./PeopleTable.css";
import PeopleRow from "./PeopleRow";
import { people } from "../../data/mockPeople";

export default function PeopleTable(){
    return(
        <div className="people-table">
            <table className="people-table-table">
                <thead>
                    <tr>
                        <th scope="col" className="people-table-table-header">
                            <input type="checkbox"></input>
                        </th>
                        <th scope="col" className="people-table-table-header">NAME</th>
                        <th scope="col" className="people-table-table-header">EMAIL</th>
                        <th scope="col" className="people-table-table-header">PHONE</th>
                        <th scope="col" className="people-table-table-header">STATUS</th>
                        <th scope="col" className="people-table-table-header">LAST SESSION</th>
                        <th scope="col" className="people-table-table-header">NOTES</th>
                        <th scope="col" className="people-table-table-header">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {people.map((person) => (
                        <PeopleRow key={person.id} person={person} />
                    ))}
                </tbody>
                <tfoot>
                </tfoot>
            </table>
        </div>
    )
}