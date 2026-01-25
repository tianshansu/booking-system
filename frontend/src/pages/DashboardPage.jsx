import "./Dashboard.css"
import Card from "../components/Card";
import ListPanel from "../components/ListPanel";
import TodaySessionList from "../components/TodaySessionList";
import UpcomingSessionList from "../components/UpcomingSessionList";
import TodaySessionRow from "../components/TodaySessionRow";
import UpcomingSessionRow from "../components/UpcomingSessionRow";
import RecentActivityList from "../components/RecentActivityList";
import RecentActivityListRow from "../components/RecentActivityListRow";

export default function DashboardPage() {
    const TODAY = "2025-01-15" //set a today's date

    const sessions = [
        // ===== Today sessions (5) =====
        {
            id: 1,
            date: "2025-01-15",
            time: "09:00",
            title: "Initial Consultation",
            patientName: "Michael Chen",
            status: "Completed"
        },
        {
            id: 2,
            date: "2025-01-15",
            time: "10:30",
            title: "Follow-up Session",
            patientName: "Emma Rodriguez",
            status: "Scheduled"
        },
        {
            id: 3,
            date: "2025-01-15",
            time: "11:45",
            title: "Review Meeting",
            patientName: "Sarah Thompson",
            status: "Scheduled"
        },
        {
            id: 4,
            date: "2025-01-15",
            time: "14:00",
            title: "Training Session",
            patientName: "David Kim",
            status: "Scheduled"
        },
        {
            id: 5,
            date: "2025-01-15",
            time: "16:00",
            title: "Progress Check",
            patientName: "Amanda Foster",
            status: "Scheduled"
        },
        // ===== Upcoming sessions (5) =====
        {
            id: 6,
            date: "2025-01-18",
            time: "10:00",
            title: "Assessment Session",
            patientName: "Jennifer Lee",
            status: "Scheduled"
        },
        {
            id: 7,
            date: "2025-01-19",
            time: "13:30",
            title: "Consultation",
            patientName: "Robert Martinez",
            status: "Scheduled"
        },
        {
            id: 8,
            date: "2025-01-20",
            time: "09:00",
            title: "Initial Consultation",
            patientName: "Amanda Foster",
            status: "Scheduled"
        },
        {
            id: 9,
            date: "2025-01-21",
            time: "15:00",
            title: "Training Workshop",
            patientName: "Group Session (6 people)",
            status: "Scheduled"
        },
        {
            id: 10,
            date: "2025-01-22",
            time: "11:00",
            title: "Follow-up Session",
            patientName: "Daniel Wu",
            status: "Scheduled"
        }
    ]; //all sessions (mock data)


    const todaySessions = sessions.filter(s => s.date === TODAY) //filter out today's sessions
    const upcomingSessions = sessions.filter(s => s.date > TODAY && s.status !== "Completed") //filter upcoming sessions
    const todayPreview = todaySessions.slice(0, 4); //take top 4 records to display
    const upcomingPreview = upcomingSessions.slice(0, 4); //take top 4 records to display

    const recentActivities = [
        {
            id: 1,
            message: "Session completed with Michael Chen",
            time: "2 hours ago"
        },
        {
            id: 2,
            message: "New session scheduled for Amanda Foster",
            time: "5 hours ago"
        },
        {
            id: 3,
            message: "New person added - Amanda Foster",
            time: "6 hours ago"
        }
    ] // mock data for recent actiivity

    return (
        <div style={{ display: "grid" }}>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))", // divide into four columns
                gap: 20,
                marginBottom: 30,
            }}>
                <Card title="Today's Sessions" count="8" comment="+2 from yesterday"></Card>
                <Card title="Upcoming" count="24" comment="Next 7 days"></Card>
                <Card title="Completed" count="156" comment="This month"></Card>
                <Card title="Active People" count="42" comment="Total registered"></Card>
            </div>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 20,
                marginBottom: 30,
            }}>
                <ListPanel
                    title="Today's Sessions" date="Wednesday, January 15, 2025"
                    footer={
                        <button type="button"
                            style={{ background: "none", border: "none", padding: 10, font: "inherit", color: "#2563EB", fontSize: "16px" }}
                            onClick={() => alert("go to sessions page")}
                        >view all sessions</button>
                    }>
                    <TodaySessionList sessions={todayPreview} RowComponent={TodaySessionRow}></TodaySessionList>
                    {/* send corresponding session data and the RowComponent to list */}
                </ListPanel>
                <ListPanel
                    title="Upcoming Sessions" date="Next 7 days"
                    footer={
                        <button type="button"
                            style={{ background: "none", border: "none", padding: 10, font: "inherit", color: "#2563EB", fontSize: "16px" }}
                            onClick={() => alert("go to calendar page")}
                        >view calendar</button>
                    }>

                    <UpcomingSessionList sessions={upcomingPreview} RowComponent={UpcomingSessionRow}></UpcomingSessionList>
                    {/* send corresponding session data and the RowComponent to list */}
                </ListPanel>
            </div>
            <div>
                <ListPanel title="Recent Activity" date="Latest updates and changes">
                    <RecentActivityList activities={recentActivities} RowComponent={RecentActivityListRow}></RecentActivityList>
                </ListPanel>
            </div>
        </div>
    )
}
