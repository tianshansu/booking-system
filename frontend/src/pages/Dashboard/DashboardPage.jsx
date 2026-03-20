import "./Dashboard.css";
import "../../styles/popups.css";
import "../../styles/form.css";
import Card from "../../components/common/Card";
import ListPanel from "../../components/common/ListPanel";
import TodaySessionList from "../../components/dashboard/TodaySessionList";
import UpcomingSessionList from "../../components/dashboard/UpcomingSessionList";
import TodaySessionRow from "../../components/dashboard/TodaySessionRow";
import UpcomingSessionRow from "../../components/dashboard/UpcomingSessionRow";
import RecentActivityList from "../../components/dashboard/RecentActivityList";
import RecentActivityListRow from "../../components/dashboard/RecentActivityListRow";
import OverlayModal from "../../components/common/OverlayModal";
import { useEffect, useState } from "react";
import { apiFetch } from "../../api";

export default function DashboardPage() {
  const [todaySessions, setTodaySessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [summary, setSummary] = useState({
    todaySessions: 0,
    upcoming: 0,
    completed: 0,
    activePeople: 0,
  });

  const todayDate = new Date();
  const todayDateFormat = todayDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const todayPreview = todaySessions.slice(0, 4); //take top 4 records to display
  const upcomingPreview = upcomingSessions.slice(0, 4); //take top 4 records to display

  // pop-ups
  const [showMsg, setShowMsg] = useState(false);
  const [msg, setMsg] = useState("");
  const [showAllTodaySessions, setShowAllTodaySessions] = useState(false);

  const showMessage = (text) => {
    setMsg(text);

    setShowMsg(true);

    setTimeout(() => {
      setShowMsg(false);
    }, 1000);
  };

  const SESSION_STATUS = {
    SCHEDULED: 0,
    COMPLETED: 1,
    CANCELED: 2,
  };

  const updateSessionStatus = async (sessionId, status) => {
    const response = await apiFetch(`/api/sessions/${sessionId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    });
    if (!response || !response.ok) {
      throw new Error("Failed to update session status");
    }
  };

  // fetch sessions
  const fetchSessions = () => {
    apiFetch("/api/dashboard/sessions")
      .then((r) => {
        if (!r) return;
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setTodaySessions(data.todaySessions);
        setUpcomingSessions(data.upcomingSessions);
      })
      .catch((e) => console.error("fetch failed:", e));
  };

  // fetch summary
  const fetchSummary = () => {
    apiFetch("/api/dashboard/summary")
      .then((r) => {
        if (!r) return;
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setSummary(data);
      })
      .catch((e) => console.error("fetch failed:", e));
  };

  const handleMarkComplete = async (sessionId) => {
    try {
      await updateSessionStatus(sessionId, SESSION_STATUS.COMPLETED);
      fetchSessions();
      fetchSummary();
      showMessage("session successfully marked as completed");
    } catch (err) {
      console.error("Mark complete error:", err);
      showMessage("session is unable to mark as completed, please try again");
    }
  };

  const handleMarkCancel = async (sessionId) => {
    try {
      await updateSessionStatus(sessionId, SESSION_STATUS.CANCELED);
      fetchSessions();
      fetchSummary();
      showMessage("session successfully marked as canceled");
    } catch (err) {
      console.error("Mark complete error:", err);
      showMessage("session is unable to mark as canceled, please try again");
    }
  };

  useEffect(() => {
    fetchSessions();
    apiFetch("/api/dashboard")
      .then((r) => {
        if (!r) return;
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setRecentActivities(data);
      })
      .catch((e) => console.error("fetch failed:", e));

    fetchSummary();
  }, []);

  return (
    <div style={{ display: "grid" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))", // divide into four columns
          gap: 20,
          marginBottom: 30,
        }}
      >
        <Card
          title="Today's Sessions"
          count={summary.today_count ?? 0}
          comment="+2 from yesterday"
        ></Card>
        <Card
          title="Upcoming"
          count={summary.upcoming_count ?? 0}
          comment="Next 7 days"
        ></Card>
        <Card
          title="Completed"
          count={summary.completed_count ?? 0}
          comment="This month"
        ></Card>
        <Card
          title="Active People"
          count={summary.active_people ?? 0}
          comment="Total registered"
        ></Card>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <ListPanel
          title="Today's Sessions"
          date={todayDateFormat}
          footer={
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                padding: 10,
                font: "inherit",
                color: "#2563EB",
                fontSize: "16px",
              }}
              onClick={() => setShowAllTodaySessions(true)}
            >
              view all today's sessions
            </button>
          }
        >
          <TodaySessionList
            sessions={todayPreview}
            RowComponent={TodaySessionRow}
            onMarkCompleted={handleMarkComplete}
            onMarkCanceled={handleMarkCancel}
          ></TodaySessionList>
          {/* send corresponding session data and the RowComponent to list */}
        </ListPanel>
        <ListPanel
          title="Upcoming Sessions"
          date="Next 7 days"
          footer={
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                padding: 10,
                font: "inherit",
                color: "#2563EB",
                fontSize: "16px",
              }}
              onClick={() => alert("go to calendar page")}
            >
              view calendar
            </button>
          }
        >
          <UpcomingSessionList
            sessions={upcomingPreview}
            RowComponent={UpcomingSessionRow}
            onMarkCanceled={handleMarkCancel}
          ></UpcomingSessionList>
          {/* send corresponding session data and the RowComponent to list */}
        </ListPanel>
      </div>

      {/* pop ups & overlays */}
      {showMsg && <div className="toast-message">{msg}</div>}
      {showAllTodaySessions && (
        <OverlayModal
          open={showAllTodaySessions}
          title="Today's Sessions"
          onClose={() => setShowAllTodaySessions(false)}
        >
          <TodaySessionList
            sessions={todaySessions}
            RowComponent={TodaySessionRow}
            onMarkCompleted={handleMarkComplete}
            onMarkCanceled={handleMarkCancel}
          ></TodaySessionList>
        </OverlayModal>
      )}
      <div>
        <ListPanel title="Recent Activity" date="Latest updates and changes">
          <RecentActivityList
            activities={recentActivities}
            RowComponent={RecentActivityListRow}
          ></RecentActivityList>
        </ListPanel>
      </div>
    </div>
  );
}
