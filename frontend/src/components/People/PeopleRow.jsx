import "./PeopleRow.css";

export default function PeopleRow({person}){
    return(
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
                <button type="button">
                    <img src="/icons/more.svg" alt="more info"></img>
                </button>
            </td>
        </tr>
    )
}