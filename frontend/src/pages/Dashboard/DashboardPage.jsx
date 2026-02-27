import "./Dashboard.css";
import Card from "../../components/common/Card";
import ListPanel from "../../components/common/ListPanel";
import TodaySessionList from "../../components/dashboard/TodaySessionList";
import UpcomingSessionList from "../../components/dashboard/UpcomingSessionList";
import TodaySessionRow from "../../components/dashboard/TodaySessionRow";
import UpcomingSessionRow from "../../components/dashboard/UpcomingSessionRow";
import RecentActivityList from "../../components/dashboard/RecentActivityList";
import RecentActivityListRow from "../../components/dashboard/RecentActivityListRow";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setSessions(data);
      })
      .catch((e) => console.error("fetch failed:", e));
  }, []);
  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setRecentActivities(data);
      })
      .catch((e) => console.error("fetch failed:", e));
  }, []);

  const TODAY = "2025-01-15";
  const todaySessions = sessions.filter((s) => s.date === TODAY); //filter out today's sessions
  const upcomingSessions = sessions.filter(
    (s) => s.date > TODAY && s.status !== "Completed",
  ); //filter upcoming sessions
  const todayPreview = todaySessions.slice(0, 4); //take top 4 records to display
  const upcomingPreview = upcomingSessions.slice(0, 4); //take top 4 records to display

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
          count="8"
          comment="+2 from yesterday"
        ></Card>
        <Card title="Upcoming" count="24" comment="Next 7 days"></Card>
        <Card title="Completed" count="156" comment="This month"></Card>
        <Card
          title="Active People"
          count="42"
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
          date="Wednesday, January 15, 2025"
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
              onClick={() => alert("go to sessions page")}
            >
              view all sessions
            </button>
          }
        >
          <TodaySessionList
            sessions={todayPreview}
            RowComponent={TodaySessionRow}
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
          ></UpcomingSessionList>
          {/* send corresponding session data and the RowComponent to list */}
        </ListPanel>
      </div>
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
