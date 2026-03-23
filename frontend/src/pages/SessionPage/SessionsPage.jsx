import "./SessionsPage.css";
import "../../styles/form.css";
import "../../styles/popups.css";
import SessionsFilterBar from "../../components/sessions/SessionsFilterBar";
import SessionsTable from "../../components/sessions/SessionsTable";
import Searchbar from "../../components/common/Searchbar";
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../api";

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [showMsg, setShowMsg] = useState(false);
  const [msg, setMsg] = useState("");

  // form contents
  const [formTitle, setFormTitle] = useState("");
  const [patientsOptions, setPatientsOptions] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);
  const [sessionName, setSessionName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [status, setStatus] = useState(0);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  // search bar
  const [search, setSearch] = useState("");

  //filter
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStaffId, setFilterStaffId] = useState("");

  const fetchSessions = useCallback(async () => {
    apiFetch(
      `/api/sessions?limit=${limit}&page=${currentPage}&status=${filterStatus}&staffId=${filterStaffId}&search=${search}`,
    )
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setSessions(data.data || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch((e) => console.error("fetch failed:", e));
  }, [currentPage, filterStatus, filterStaffId, search]);

  useEffect(() => {
    fetchSessions();

    apiFetch("/api/people/patients/options")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setPatientsOptions(data);
      })
      .catch((e) => console.error("fetch failed:", e));

    apiFetch("/api/people/staff/options")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setStaffOptions(data);
      })
      .catch((e) => console.error("fetch failed:", e));
  }, [fetchSessions, search]);

  // open add session form
  const openAddForm = () => {
    setIsEditMode(false);

    setFormTitle("Add A New Session");
    setSessionName("");
    setPatientId("");
    setStaffId("");
    setStatus(0);
    setStartAt("");
    setEndAt("");

    setShowForm(true);
  };

  // open edit form
  const openEditForm = (session) => {
    setIsEditMode(true);

    setEditingSessionId(session.id);

    setFormTitle("Edit A Session");
    setSessionName(session.name);
    setPatientId(session.patientId);
    setStaffId(session.staffId);
    setStatus(session.status);
    setStartAt(session.startAt);
    setEndAt(session.endAt);

    setShowForm(true);
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    let response;

    if (isEditMode) {
      response = await apiFetch(`/api/sessions/${editingSessionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionName,
          patientId,
          staffId,
          status,
          startAt,
          endAt,
        }),
      });
    } else {
      // send req & get res
      response = await apiFetch("/api/sessions/add-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionName,
          patientId,
          staffId,
          startAt,
          endAt,
        }),
      });
    }

    await response.json();

    if (response.ok) {
      isEditMode
        ? setMsg("Session edited successfully")
        : setMsg("Session added successfully");
    } else {
      isEditMode
        ? setMsg("Failed to edit session")
        : setMsg("Failed to add session");
    }

    //refresh
    await fetchSessions();

    setShowMsg(true);
    setTimeout(() => {
      setShowMsg(false);
    }, 1000);

    //close the form
    setShowForm(false);
  };

  // delete a session
  const handleDelete = async (sessionId) => {
    const response = await apiFetch(`/api/sessions/${sessionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    await response.json();

    if (response.ok) {
      setMsg("Session deleted successfully");
    } else {
      setMsg("Failed to delete session");
    }
    //refresh
    await fetchSessions();

    setShowMsg(true);
    setTimeout(() => {
      setShowMsg(false);
    }, 1000);
  };

  // filter clear
  const handleFilterClear = () => {
    // reset filter
    setFilterStatus("");
    setFilterStaffId("");
  };

  return (
    <>
      <div className="sessions">
        <div className="sessions-header">
          <div className="sessions-header-element">
            <div>View and manage all sessions in the system.</div>
            <div className="sessions-search-filter">
              <Searchbar
                placeholder="Session name, patient or staff name"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          <div className="sessions-header-buttons">
            <button className="sessions-header-button" type="button">
              <img
                className="sessions-header-button-img"
                src="/icons/import.svg"
                alt="import icon"
              ></img>
              <div className="sessions-header-button-text">Export</div>
            </button>

            <div className="sessions-header-buttons">
              <button
                className="sessions-header-button"
                style={{ backgroundColor: "#4338CA", border: "none" }}
                type="button"
                onClick={openAddForm}
              >
                <img
                  className="sessions-header-button-img"
                  src="/icons/add.svg"
                  alt="add session"
                ></img>
                <div
                  className="sessions-header-button-text"
                  style={{ color: "white" }}
                >
                  Add session
                </div>
              </button>

              {/* add session form */}
              {showForm && (
                <div className="app-modal">
                  <div className="app-form-title">{formTitle}</div>
                  <form onSubmit={handleSubmit}>
                    <div className="app-form-input-row">
                      <div className="app-form-input-row-label">Name:</div>
                      <input
                        className="app-form-input-row-value"
                        type="text"
                        placeholder="Session Name"
                        value={sessionName}
                        onChange={(e) => setSessionName(e.target.value)}
                      ></input>
                    </div>
                    <div className="app-form-input-row">
                      <div className="app-form-input-row-label">Patient:</div>
                      <select
                        className="app-form-input-row-value"
                        onChange={(e) => setPatientId(e.target.value)}
                        value={patientId}
                      >
                        <option>Please select a patient</option>
                        {patientsOptions.map((patient) => (
                          <option key={patient.id} value={patient.id}>
                            {patient.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="app-form-input-row">
                      <div className="app-form-input-row-label">Staff:</div>
                      <select
                        className="app-form-input-row-value"
                        onChange={(e) => setStaffId(e.target.value)}
                        value={staffId}
                      >
                        <option>Please select a staff</option>
                        {staffOptions.map((staff) => (
                          <option key={staff.id} value={staff.id}>
                            {staff.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* show status */}
                    {isEditMode && (
                      <div className="app-form-input-row">
                        <div className="app-form-input-row-label">Status:</div>
                        <div className="app-form-input-row-value">
                          <label>
                            <input
                              type="radio"
                              name="status"
                              value={0}
                              checked={status === 0}
                              onChange={() => setStatus(0)}
                            ></input>
                            Scheduled
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="status"
                              value={1}
                              checked={status === 1}
                              onChange={() => setStatus(1)}
                            ></input>
                            Completed
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="status"
                              value={2}
                              checked={status === 2}
                              onChange={() => setStatus(2)}
                            ></input>
                            Canceled
                          </label>
                        </div>
                      </div>
                    )}
                    <div className="app-form-input-row">
                      <div className="app-form-input-row-label">Start At:</div>
                      <input
                        type="datetime-local"
                        onChange={(e) => setStartAt(e.target.value)}
                        value={startAt}
                      ></input>
                    </div>
                    <div className="app-form-input-row">
                      <div className="app-form-input-row-label">End At:</div>
                      <input
                        type="datetime-local"
                        onChange={(e) => setEndAt(e.target.value)}
                        value={endAt}
                      ></input>
                    </div>
                    <div className="app-form-buttons">
                      <button type="button" onClick={() => setShowForm(false)}>
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
        </div>
        <SessionsFilterBar
          onFilterStatus={setFilterStatus}
          filterStatus={filterStatus}
          onFilterStaff={setFilterStaffId}
          filterStaff={filterStaffId}
          staffOptions={staffOptions}
          onClear={handleFilterClear}
        />
        <SessionsTable
          sessions={sessions}
          onEdit={openEditForm}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
