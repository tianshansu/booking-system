import SessionsFilterBar from "../components/sessions/SessionsFilterBar";
import SessionsTable from "../components/sessions/SessionsTable";
import Searchbar from "../components/common/Searchbar";
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api";
import PageContainer from "../components/common/PageContainer";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddIcon from "@mui/icons-material/Add";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import DeleteConfirm from "../components/common/DeleteConfirm";
import ToastMessage from "../components/common/ToastMessage";
import AiAssistant from "../components/aiAssistant/AiAssistant";

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);

  // form contents
  const [formTitle, setFormTitle] = useState("");
  const [patientsOptions, setPatientsOptions] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);
  const [sessionName, setSessionName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [status, setStatus] = useState(0);
  const [startAt, setStartAt] = useState(null);
  const [endAt, setEndAt] = useState(null);

  // search bar
  const [search, setSearch] = useState("");

  //filter
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStaffId, setFilterStaffId] = useState("");
  const [filterSortTime, setFilterSortTime] = useState("");

  // states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // delete confirm
  const [selectedSession, setSelectedSession] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // toast msg
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const closeToast = () => {
    setToast({
      ...toast,
      open: false,
    });
  };

  const fetchSessions = useCallback(async () => {
    try {
      // set is loading
      setLoading(true);
      setError("");

      const r = await apiFetch(
        `/api/sessions/all?status=${filterStatus}&staffId=${filterStaffId}&search=${search}&sortTime=${filterSortTime}`,
      );

      if (!r.ok) {
        throw new Error(`HTTP ${r.status}`);
      }

      const data = await r.json();

      setSessions(data.data || []);
    } catch (e) {
      console.error("fetch failed:", e);
      setError("Failed to load sessions.");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterStaffId, search, filterSortTime]);

  // export to csv
  const handleExport = async () => {
    let response = await apiFetch(
      `/api/sessions/export?status=${filterStatus}&staffId=${filterStaffId}&search=${search}`,
      {
        method: "GET",
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sessions.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

    setToast({
      open: true,
      message: "Sessions exported successfully",
      type: "success",
    });
  };

  // open add session form
  const openAddForm = () => {
    setIsEditMode(false);

    setFormTitle("Add A New Session");
    setSessionName("");
    setPatientId("");
    setStaffId("");
    setStatus(0);
    setStartAt(null);
    setEndAt(null);

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
    setStartAt(session.startAt ? dayjs(session.startAt) : null);
    setEndAt(session.endAt ? dayjs(session.endAt) : null);

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
        ? setToast({
            open: true,
            message: "Session edited successfully",
            type: "success",
          })
        : setToast({
            open: true,
            message: "Session added successfully",
            type: "success",
          });
    } else {
      isEditMode
        ? setToast({
            open: true,
            message: "Failed to edit session",
            type: "error",
          })
        : setToast({
            open: true,
            message: "Failed to add session",
            type: "error",
          });
    }

    //refresh
    await fetchSessions();

    //close the form
    setShowForm(false);
  };

  // handle delete confirm
  const handleOpenDeleteConfirm = (session) => {
    setSelectedSession(session);
    setShowDeleteConfirm(true);
  };

  // handle delete cancel
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedSession(null);
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
      setToast({
        open: true,
        message: "Session deleted successfully",
        type: "success",
      });
    } else {
      setToast({
        open: true,
        message: "Failed to delete session",
        type: "success",
      });
    }
    //refresh
    await fetchSessions();

    setShowDeleteConfirm(false);
    setSelectedSession(null);
  };

  // filter clear
  const handleFilterClear = () => {
    setFilterStatus("");
    setFilterStaffId("");

    setFilterSortTime("");
  };

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
  }, [fetchSessions]);

  return (
    <PageContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gap: "10px",
          }}
        >
          <Typography>View and manage all sessions in the system.</Typography>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
            }}
          >
            <Searchbar
              placeholder="Session name, patient or staff name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
          }}
        >
          <Button
            variant="outlined"
            sx={{ height: 40 }}
            type="button"
            onClick={handleExport}
          >
            <FileDownloadIcon />
            <Typography>Download</Typography>
          </Button>

          <Box>
            <Button
              variant="contained"
              sx={{ height: 40 }}
              type="button"
              onClick={openAddForm}
            >
              <AddIcon />
              <Typography>Add session</Typography>
            </Button>

            {/* add session form */}
            <Dialog open={showForm} onClose={() => setShowForm(false)}>
              <DialogTitle>{formTitle}</DialogTitle>
              <DialogContent>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    minWidth: 400,
                  }}
                >
                  <TextField
                    label="Session Name"
                    type="text"
                    value={sessionName}
                    required
                    fullWidth
                    variant="standard"
                    onChange={(e) => setSessionName(e.target.value)}
                  ></TextField>

                  {/* patient name selection */}
                  <Autocomplete
                    disablePortal
                    options={patientsOptions}
                    onChange={(event, newValue) => {
                      setPatientId(newValue ? newValue.id : "");
                    }}
                    value={
                      patientsOptions.find(
                        (patient) => patient.id === patientId,
                      ) || null
                    }
                    sx={{ width: "100% " }}
                    getOptionLabel={(patient) => patient.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Patient Name"
                        variant="standard"
                      />
                    )}
                  />

                  {/* staff name selection */}
                  <Autocomplete
                    disablePortal
                    options={staffOptions}
                    onChange={(event, newValue) => {
                      setStaffId(newValue ? newValue.id : "");
                    }}
                    value={
                      staffOptions.find((staff) => staff.id === staffId) || null
                    }
                    sx={{ width: "100%" }}
                    getOptionLabel={(staff) => staff.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Staff Name"
                        variant="standard"
                      />
                    )}
                  />

                  {/* show status */}
                  {isEditMode && (
                    <FormControl>
                      <FormLabel>Status:</FormLabel>
                      <RadioGroup row>
                        <FormControlLabel
                          control={<Radio />}
                          label="Scheduled"
                          value={0}
                          checked={status === 0}
                          onChange={() => setStatus(0)}
                        />

                        <FormControlLabel
                          control={<Radio />}
                          label="Completed"
                          value={1}
                          checked={status === 1}
                          onChange={() => setStatus(1)}
                        />

                        <FormControlLabel
                          control={<Radio />}
                          label="Canceled"
                          value={2}
                          checked={status === 2}
                          onChange={() => setStatus(2)}
                        />
                      </RadioGroup>
                    </FormControl>
                  )}

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateTimePicker"]}>
                      <DateTimePicker
                        label="Start At"
                        value={startAt}
                        onChange={(newValue) => setStartAt(newValue)}
                        slotProps={{
                          textField: {
                            variant: "standard",
                            fullWidth: true,
                          },
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateTimePicker"]}>
                      <DateTimePicker
                        label="End At"
                        value={endAt}
                        onChange={(newValue) => setEndAt(newValue)}
                        slotProps={{
                          textField: {
                            variant: "standard",
                            fullWidth: true,
                          },
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 2,
                      mt: 3,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => setShowForm(false)}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button variant="contained" type="submit">
                      Submit
                    </Button>
                  </Box>
                </Box>
              </DialogContent>
            </Dialog>

            <ToastMessage
              open={toast.open}
              message={toast.message}
              type={toast.type}
              onClose={closeToast}
            />

            {showDeleteConfirm && selectedSession && (
              <DeleteConfirm
                open={showDeleteConfirm}
                text={`Are you sure you want to delete ${selectedSession.name}?`}
                onCancel={handleCancelDelete}
                onConfirm={() => handleDelete(selectedSession.id)}
              />
            )}
          </Box>
        </Box>
      </Box>
      <SessionsFilterBar
        onFilterStatus={(value) => {
          setFilterStatus(value);
        }}
        filterStatus={filterStatus}
        onFilterStaff={(value) => {
          setFilterStaffId(value);
        }}
        filterStaff={filterStaffId}
        onFilterSortTime={(value) => setFilterSortTime(value)}
        filterSortTime={filterSortTime}
        staffOptions={staffOptions}
        onClear={handleFilterClear}
      />
      {loading ? (
        <div className="state-message">Loading sessions...</div>
      ) : error ? (
        <div className="state-message state-error">{error}</div>
      ) : sessions.length === 0 ? (
        <div className="state-message">No sessions found.</div>
      ) : (
        <SessionsTable
          sessions={sessions}
          onEdit={openEditForm}
          onDelete={handleOpenDeleteConfirm}
        />
      )}

      <AiAssistant></AiAssistant>
    </PageContainer>
  );
}
