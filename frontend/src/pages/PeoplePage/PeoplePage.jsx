import "./PeoplePage.css";
import PeopleTable from "../../components/people/PeopleTable";
import { useEffect, useState } from "react";
import { apiFetch } from "../../api";

export default function PeoplePage() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    apiFetch("/api/people")
      .then((r) => {
        if (!r.ok) return;
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setPeople(data);
      })
      .catch((e) => console.error("fetch failed:", e));
  }, []);

  return (
    <div className="people">
      <div className="people-header">
        <div>View and manage all people in the system.</div>

        <div className="people-header-buttons">
          <button className="people-header-button" type="button">
            <img
              className="people-header-button-img"
              src="/icons/import.svg"
              alt="import icon"
            ></img>
            <div className="people-header-button-text">Import</div>
          </button>

          <button
            className="people-header-button"
            style={{ backgroundColor: "#4338CA", border: "none" }}
            type="button"
          >
            <img
              className="people-header-button-img"
              src="/icons/add.svg"
              alt="add person"
            ></img>
            <div
              className="people-header-button-text"
              style={{ color: "white" }}
            >
              Add person
            </div>
          </button>
        </div>
      </div>

      <PeopleTable className="people-table" people={people}></PeopleTable>
    </div>
  );
}
