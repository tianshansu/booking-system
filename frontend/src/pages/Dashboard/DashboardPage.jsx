import "../../styles/popups.css";
import "../../styles/form.css";
import SummaryCard from "../../components/common/SummaryCard";
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
import AiAssistant from "../../components/aiAssistant/AiAssistant";
import { Box, Button, Card, CardContent } from "@mui/material";
import PageContainer from "../../components/common/PageContainer";

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
  const [showAllUpcomingSessions, setShowAllUpcomingSessions] = useState(false);

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
      fetchRecentActivity();
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
      fetchRecentActivity();
      showMessage("session successfully marked as canceled");
    } catch (err) {
      console.error("Mark complete error:", err);
      showMessage("session is unable to mark as canceled, please try again");
    }
  };

  //fetch recent activities
  const fetchRecentActivity = () => {
    apiFetch("/api/dashboard/recent-activities")
      .then((r) => {
        if (!r) return;
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setRecentActivities(data);
      })
      .catch((e) => console.error("fetch failed:", e));
  };

  // fetch page
  useEffect(() => {
    fetchSessions();
    fetchRecentActivity();
    fetchSummary();
  }, []);

  return (
    <PageContainer>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))", // divide into four columns
          gap: 3,
        }}
      >
        <SummaryCard
          title="Today's Sessions"
          count={summary.today_count ?? 0}
          comment="Today"
        ></SummaryCard>
        <SummaryCard
          title="Upcoming"
          count={summary.upcoming_count ?? 0}
          comment="Next 7 days"
        ></SummaryCard>
        <SummaryCard
          title="Completed"
          count={summary.completed_count ?? 0}
          comment="This month"
        ></SummaryCard>
        <SummaryCard
          title="Active People"
          count={summary.active_people ?? 0}
          comment="Total registered"
        ></SummaryCard>
      </Box>

      <Box sx={{ display: "flex", gap: 3, width: "100%" }}>
        <Card sx={{ flex: 1, minWidth: 0 }}>
          <CardContent>
            <ListPanel
              title="Today's Sessions"
              subtitle={todayDateFormat}
              footer={
                <Button
                  type="button"
                  sx={{ fontSize: "14px", fontWeight: "600" }}
                  onClick={() => setShowAllTodaySessions(true)}
                >
                  view all today's sessions
                </Button>
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
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 0 }}>
          <CardContent>
            <ListPanel
              title="Upcoming Sessions"
              subtitle="Next 7 days"
              footer={
                <Button
                  type="button"
                  sx={{ fontSize: "14px", fontWeight: "600" }}
                  onClick={() => setShowAllUpcomingSessions(true)}
                >
                  view sesisons in 7 days
                </Button>
              }
            >
              <UpcomingSessionList
                sessions={upcomingPreview}
                RowComponent={UpcomingSessionRow}
                onMarkCanceled={handleMarkCancel}
              ></UpcomingSessionList>
              {/* send corresponding session data and the RowComponent to list */}
            </ListPanel>
          </CardContent>
        </Card>
      </Box>

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
      {showAllUpcomingSessions && (
        <OverlayModal
          open={showAllUpcomingSessions}
          title="Upcoming Sessions"
          onClose={() => setShowAllUpcomingSessions(false)}
        >
          <UpcomingSessionList
            sessions={upcomingSessions}
            RowComponent={UpcomingSessionRow}
            onMarkCompleted={handleMarkComplete}
            onMarkCanceled={handleMarkCancel}
          ></UpcomingSessionList>
        </OverlayModal>
      )}
      <Box>
        <Card>
          <CardContent>
            <ListPanel
              title="Recent Activity"
              subtitle="Latest updates and changes"
            >
              <RecentActivityList
                activities={recentActivities}
                RowComponent={RecentActivityListRow}
              ></RecentActivityList>
            </ListPanel>
          </CardContent>
        </Card>
      </Box>
      <AiAssistant></AiAssistant>
    </PageContainer>
  );
}
