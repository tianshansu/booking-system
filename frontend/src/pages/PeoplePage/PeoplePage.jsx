import "./PeoplePage.css";
import PeopleTable from "../../components/people/PeopleTable";
import { useEffect, useState } from "react";
import { apiFetch } from "../../api";

export default function PeoplePage() {
  const [people, setPeople] = useState([]);

  // pop-ups
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msg, setMsg] = useState("");

  // patient fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState(0);

  const [formTitle, setFormTitle] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPersonId, setEditingPersonId] = useState(null);

  useEffect(() => {
    apiFetch("/api/people")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setPeople(data);
      })
      .catch((e) => console.error("fetch failed:", e));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let response;

    if (isEditMode) {
      response = await apiFetch(`/api/people/${editingPersonId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          status,
          notes,
        }),
      });
    } else {
      // send req & get res
      response = await apiFetch("/api/people/add-patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          notes,
        }),
      });
    }

    const data = await response.json();

    // set msg
    if (response.ok) {
      isEditMode
        ? setMsg("Patient edited successfully")
        : setMsg("Patient added successfully");
    } else {
      isEditMode
        ? setMsg("Failed to edit patient")
        : setMsg("Failed to add patient");
    }

    // refresh people list
    const listResponse = await apiFetch("/api/people");
    if (listResponse.ok) {
      const listData = await listResponse.json();
      setPeople(listData);
    }
    setShowMsg(true);

    setTimeout(() => {
      setShowMsg(false);
    }, 1000);

    //close the form
    setShowAddForm(false);

    //show msg
  };

  const handleDelete = async (personId) => {
    // send req & get res
    const response = await apiFetch(`/api/people/${personId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    // set msg
    if (response.ok) {
      setPeople((prev) => prev.filter((person) => person.id !== personId));
      setMsg("Patient deleted successfully");
    } else {
      setMsg("Failed to delete patient");
    }
    setShowMsg(true);

    setTimeout(() => {
      setShowMsg(false);
    }, 1000);
  };

  const openAddForm = () => {
    setIsEditMode(false);

    setEditingPersonId(null);
    setName("");
    setEmail("");
    setPhone("");
    setStatus(0);
    setNotes("");

    setFormTitle("Add New Patient");
    setShowAddForm(true);
  };

  const openEditForm = (person) => {
    setIsEditMode(true);

    setEditingPersonId(person.id);
    setName(person.name || "");
    setEmail(person.email || "");
    setPhone(person.phone || "");
    setStatus(person.status === "Active" ? 0 : 1);
    setNotes(person.notes);

    setFormTitle("Edit Existing Patient");
    setShowAddForm(true);
  };

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
            onClick={openAddForm}
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

          {showAddForm && (
            <div className="modal">
              <div className="form-title">{formTitle}</div>
              <form onSubmit={handleSubmit}>
                <div className="form-input-row">
                  <div className="form-input-row-label">Name:</div>
                  <input
                    className="form-input-row-value"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></input>
                </div>
                <div className="form-input-row">
                  <div className="form-input-row-label">Email:</div>
                  <input
                    className="form-input-row-value"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                </div>
                <div className="form-input-row">
                  <div className="form-input-row-label">Phone:</div>
                  <input
                    className="form-input-row-value"
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  ></input>
                </div>
                {/* show status only in edit mode */}
                {isEditMode && (
                  <div className="form-input-row">
                    <div className="form-input-row-label">Status:</div>

                    <label>
                      <input
                        type="radio"
                        name="status"
                        value={0}
                        checked={status === 0}
                        onChange={() => setStatus(0)}
                      />
                      Active
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="status"
                        value={1}
                        checked={status === 1}
                        onChange={() => setStatus(1)}
                      />
                      Inactive
                    </label>
                  </div>
                )}
                <div className="form-input-row">
                  <div className="form-input-row-label">Notes:</div>
                  <input
                    className="form-input-row-value"
                    type="text"
                    placeholder="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></input>
                </div>
                <div className="form-button">
                  <button type="submit">Submit</button>
                  <button onClick={() => setShowAddForm(false)} type="button">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          {showMsg && <div className="toast-message">{msg}</div>}
        </div>
      </div>

      <PeopleTable
        className="people-table"
        people={people}
        onDelete={handleDelete}
        onEdit={openEditForm}
      ></PeopleTable>
    </div>
  );
}
