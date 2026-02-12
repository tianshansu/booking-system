import "./PeoplePage.css";
import PeopleTable from "../../components/People/PeopleTable";

export default function PeoplePage(){
    return(
        <div className="people">
            <div className="people-header">
                <div>View and manage all people in the system.</div>

                <div className="people-header-buttons">
                    <button className="people-header-button" type="button">
                        <img className="people-header-button-img" src="/icons/import.svg" alt='import icon'></img>
                        <div className="people-header-button-text">Import</div>
                    </button>

                    <button className="people-header-button" style={{backgroundColor:"#4338CA", border:"none"}} type="button">
                        <img className="people-header-button-img" src="/icons/add.svg" alt='add person'></img>
                        <div className="people-header-button-text" style={{color:"white"}}>Add person</div>
                    </button>
                </div>
                
            </div>

            <PeopleTable className="people-table"></PeopleTable>
            
        </div>
    )
}