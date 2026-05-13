import PeopleTable from "../components/People/PeopleTable";
import Searchbar from "../components/common/Searchbar";
import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch } from "../api";
import PeopleFilterBar from "../components/People/PeopleFilterBar";
import PageContainer from "../components/common/PageContainer";
import {
  Box,
  Button,
  ButtonGroup,
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
import PublishIcon from "@mui/icons-material/Publish";
import AddIcon from "@mui/icons-material/Add";
import ToastMessage from "../components/common/ToastMessage";
import DeleteConfirm from "../components/common/DeleteConfirm";

export default function PeoplePage() {
  const [people, setPeople] = useState([]);

  // pop-ups
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
  const [selectedPerson, setSelectedPerson] = useState(null);

  // role tabs
  const [roleTab, setRoleTab] = useState("patient");

  // search bar
  const [search, setSearch] = useState("");

  // states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // filter
  const [filterStatus, setFilterStatus] = useState("");

  // import people
  const fileInputRef = useRef(null);

  // open file picker
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // upload selected csv file
  const handleImportFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");

      const response = await fetch("api/people/import", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Import failed");
      }

      setToast({
        open: true,
        message: `Import completed: ${data.insertedCount} inserted, ${data.failedCount} failed`,
        type: "success",
      });

      // refresh people list
      fetchPeople();
    } catch (err) {
      setToast({
        open: true,
        message: "Failed to import people",
        type: "error",
      });
    }

    // clear input value so same file can be selected again
    e.target.value = "";
  };

  // handle delete confirm
  const handleOpenDeleteConfirm = (person) => {
    setSelectedPerson(person);
    setShowDeleteConfirm(true);
  };

  // handle delete cancel
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedPerson(null);
  };

  // filter clear
  const handleFilterClear = () => {
    setFilterStatus("");
  };

  // fetch people
  const fetchPeople = useCallback(async () => {
    try {
      // set is loading
      setLoading(true);
      setError("");

      const r = await apiFetch(
        `/api/people/all?role=${roleTab}&search=${search}&filterStatus=${filterStatus}`,
      );
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();

      // set data
      setPeople(data.data);
    } catch (e) {
      console.error("fetch failed:", e);
    } finally {
      setLoading(false);
    }
  }, [roleTab, search, filterStatus]);

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
        ? setToast({
            open: true,
            message: "Person edited successfully",
            type: "success",
          })
        : setToast({
            open: true,
            message: "Person added successfully",
            type: "success",
          });
    } else {
      isEditMode
        ? setToast({
            open: true,
            message: "Failed to edit person",
            type: "error",
          })
        : setToast({
            open: true,
            message: "Failed to add person",
            type: "error",
          });
    }

    // refresh people list
    await fetchPeople();

    //close the form
    setShowAddForm(false);
  };

  const handleDelete = async () => {
    if (!selectedPerson) return;
    // send req & get res
    const response = await apiFetch(`/api/people/${selectedPerson.id}`, {
      method: "DELETE",
    });

    await response.json();

    // set msg
    if (response.ok) {
      await fetchPeople();
      roleTab === "patient"
        ? setToast({
            open: true,
            message: "Patient deleted successfully",
            type: "success",
          })
        : setToast({
            open: true,
            message: "Staff deleted successfully",
            type: "success",
          });
      setShowDeleteConfirm(false);
    } else {
      roleTab === "patient"
        ? setToast({
            open: true,
            message: "Failed to delete patient",
            type: "error",
          })
        : setToast({
            open: true,
            message: "Failed to delete staff",
            type: "error",
          });
      setShowDeleteConfirm(false);
      setSelectedPerson(null);
    }
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
    <PageContainer>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Box>
          View and manage all people in the system.
          <Box sx={{ display: "flex", gap: 1 }}>
            {/* role selection - patient in default */}
            <ButtonGroup sx={{ mt: 1.5 }}>
              <Button
                variant={roleTab === "patient" ? "contained" : "outlined"}
                onClick={() => setRoleTab("patient")}
              >
                Patient
              </Button>
              <Button
                variant={roleTab === "staff" ? "contained" : "outlined"}
                onClick={() => setRoleTab("staff")}
              >
                Staff
              </Button>
            </ButtonGroup>

            <Searchbar
              placeholder="Name, email or phone"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            type="button"
            onClick={handleImportClick}
            sx={{ height: 40 }}
          >
            <PublishIcon sx={{ color: "primary.main" }} />
            <Typography>Import</Typography>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={handleImportFileChange}
          />

          <Button
            variant="contained"
            sx={{ height: 40 }}
            type="button"
            onClick={openAddForm}
          >
            <AddIcon />
            <Typography style={{ color: "white" }}>Add person</Typography>
          </Button>

          <Dialog open={showAddForm} onClose={() => setShowAddForm(false)}>
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
                  label="Name"
                  type="text"
                  value={name}
                  required
                  fullWidth
                  variant="standard"
                  onChange={(e) => setName(e.target.value)}
                ></TextField>

                <TextField
                  label="Email"
                  type="text"
                  value={email}
                  required
                  fullWidth
                  variant="standard"
                  onChange={(e) => setEmail(e.target.value)}
                ></TextField>

                <TextField
                  label="Phone"
                  type="text"
                  value={phone}
                  fullWidth
                  variant="standard"
                  onChange={(e) => setPhone(e.target.value)}
                ></TextField>

                {/* show status only in edit mode */}
                {isEditMode && (
                  <FormControl>
                    <FormLabel>Status:</FormLabel>
                    <RadioGroup row>
                      <FormControlLabel
                        control={<Radio />}
                        label="Active"
                        value={0}
                        checked={status === 0}
                        onChange={() => setStatus(0)}
                      />

                      <FormControlLabel
                        control={<Radio />}
                        label="Inactive"
                        value={1}
                        checked={status === 1}
                        onChange={() => setStatus(1)}
                      />
                    </RadioGroup>
                  </FormControl>
                )}
                {!isEditMode && (
                  <FormControl>
                    <FormLabel>Role</FormLabel>
                    <RadioGroup row>
                      <FormControlLabel
                        control={<Radio />}
                        label="Patient"
                        value={"patient"}
                        checked={role === "patient"}
                        onChange={() => setRole("patient")}
                      />
                      <FormControlLabel
                        control={<Radio />}
                        label="Staff"
                        value={"staff"}
                        checked={role === "staff"}
                        onChange={() => setRole("staff")}
                      />
                    </RadioGroup>
                  </FormControl>
                )}

                <FormControl>
                  <FormLabel>Notes</FormLabel>
                  <TextField
                    id="outlined-multiline-static"
                    multiline
                    maxRows={4}
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></TextField>
                </FormControl>
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
                    onClick={() => setShowAddForm(false)}
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

          {/* {showMsg && <div className="toast-message">{msg}</div>} */}

          <ToastMessage
            open={toast.open}
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
          />
          {showDeleteConfirm && selectedPerson && (
            <DeleteConfirm
              open={showDeleteConfirm}
              text={`Are you sure you want to delete ${selectedPerson.name}? This will also delete all related sessions.`}
              onCancel={handleCancelDelete}
              onConfirm={handleDelete}
            />
          )}
        </Box>
      </Box>

      <PeopleFilterBar
        onFilterStatus={(value) => {
          setFilterStatus(value);
        }}
        filterStatus={filterStatus}
        onClear={handleFilterClear}
      ></PeopleFilterBar>

      {loading ? (
        <Box sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
          Loading people...
        </Box>
      ) : error ? (
        <Box sx={{ py: 4, textAlign: "center", color: "error.main" }}>
          {error}
        </Box>
      ) : people.length === 0 ? (
        <Box sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
          No people found.
        </Box>
      ) : (
        <PeopleTable
          people={people}
          onDelete={handleOpenDeleteConfirm}
          onEdit={openEditForm}
        ></PeopleTable>
      )}
    </PageContainer>
  );
}
