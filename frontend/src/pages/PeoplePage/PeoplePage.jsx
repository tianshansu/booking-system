import "./PeoplePage.css";
import "../../styles/form.css";
import "../../styles/popups.css";
import PeopleTable from "../../components/People/PeopleTable";
import Searchbar from "../../components/common/Searchbar";
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../api";

export default function PeoplePage() {
  const [people, setPeople] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // show 5 people on each page

  // pop-ups
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msg, setMsg] = useState("");

  // people fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState(0);
  const [role, setRole] = useState("patient");

  const [formTitle, setFormTitle] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPersonId, setEditingPersonId] = useState(null);

  // role tabs
  const [roleTab, setRoleTab] = useState("patient");

  // search bar
  const [search, setSearch] = useState("");

  // fetch people
  const fetchPeople = useCallback(async () => {
    apiFetch(
      `/api/people?limit=${limit}&page=${currentPage}&role=${roleTab}&search=${search}`,
    )
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setPeople(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      })
      .catch((e) => console.error("fetch failed:", e));
  }, [currentPage, roleTab, search]);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

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
      response = await apiFetch("/api/people/add-person", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          name,
          email,
          phone,
          notes,
        }),
      });
    }

    await response.json();

    // set msg
    if (response.ok) {
      isEditMode
        ? setMsg("Person edited successfully")
        : setMsg("Person added successfully");
    } else {
      isEditMode
        ? setMsg("Failed to edit person")
        : setMsg("Failed to add person");
    }

    // refresh people list
    await fetchPeople();

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

    await response.json();

    // set msg
    if (response.ok) {
      await fetchPeople();
      roleTab === "patient"
        ? setMsg("Patient deleted successfully")
        : setMsg("Staff deleted successfully");
    } else {
      roleTab === "patient"
        ? setMsg("Failed to delete patient")
        : setMsg("Failed to delete staff");
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

    setFormTitle("Add New Person");
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

    setFormTitle("Edit Existing Person");
    setShowAddForm(true);
  };

  return (
    <div className="people">
      <div className="people-header">
        <div className="people-header-element">
          View and manage all people in the system.
          <div className="people-role-search">
            {/* role selection - patient in default */}
            <div className="people-role-tabs">
              <button
                type="button"
                className={
                  roleTab === "patient" ? "role-tab active" : "role-tab"
                }
                onClick={() => setRoleTab("patient")}
              >
                Patient
              </button>
              <button
                type="button"
                className={roleTab === "staff" ? "role-tab active" : "role-tab"}
                onClick={() => setRoleTab("staff")}
              >
                Staff
              </button>
            </div>

            <Searchbar
              placeholder="Name, email or phone"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

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
            <div className="app-modal">
              <div className="app-form-title">{formTitle}</div>
              <form onSubmit={handleSubmit}>
                <div className="app-form-input-row">
                  <div className="app-form-input-row-label">Name:</div>
                  <input
                    className="app-form-input-row-value"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></input>
                </div>
                <div className="app-form-input-row">
                  <div className="app-form-input-row-label">Email:</div>
                  <input
                    className="app-form-input-row-value"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                </div>
                <div className="app-form-input-row">
                  <div className="app-form-input-row-label">Phone:</div>
                  <input
                    className="app-form-input-row-value"
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  ></input>
                </div>
                {/* show status only in edit mode */}
                {isEditMode && (
                  <div className="app-form-input-row">
                    <div className="app-form-input-row-label">Status:</div>

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
                {!isEditMode && (
                  <div className="app-form-input-row">
                    <div className="app-form-input-row-label">Role:</div>
                    <label>
                      <input
                        type="radio"
                        name="role"
                        value={"patient"}
                        checked={role === "patient"}
                        onChange={() => setRole("patient")}
                      />
                      Patient
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="role"
                        value={"staff"}
                        checked={role === "staff"}
                        onChange={() => setRole("staff")}
                      />
                      Staff
                    </label>
                  </div>
                )}

                <div className="app-form-input-row">
                  <div className="app-form-input-row-label">Notes:</div>
                  <input
                    className="app-form-input-row-value"
                    type="text"
                    placeholder="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></input>
                </div>
                <div className="app-form-buttons">
                  <button onClick={() => setShowAddForm(false)} type="button">
                    Cancel
                  </button>
                  <button type="submit">Submit</button>
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
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      ></PeopleTable>
    </div>
  );
}
