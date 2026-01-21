import "./Dashboard.css"
import Card from "../components/Card";
import ListPanel from "../components/ListPanel";
import TodaySessionList from "../components/TodaySessionList";
import UpcomingSessionList from "../components/UpcomingSessionList";
import TodaySessionRow from "../components/TodaySessionRow";
import UpcomingSessionRow from "../components/UpcomingSessionRow";
import RecentActivityList from "../components/RecentActivityList";
import RecentActivityListRow from "../components/RecentActivityListRow";

export default function DashboardPage(){
    const TODAY = "2025-01-15" //set a today's date
    
    const sessions=[
         { id: 1, date: "2025-01-15", time: "09:00", title: "Initial Consultation", patientName: "Michael Chen", status: "Completed" },
        { id: 2, date: "2025-01-15", time: "11:00", title: "Follow-up Session", patientName: "Emma Rodriguez", status: "Scheduled" },
        { id: 3, date: "2025-01-18", time: "10:00", title: "Assessment Session", patientName: "Jennifer Lee", status: "Scheduled" },
        { id: 4, date: "2025-01-20", time: "14:00", title: "Training Session", patientName: "David Kim", status: "Scheduled" }
    ] //all sessions (mock data)

    const todaySessions=sessions.filter(s => s.date === TODAY) //filter out today's sessions

    const upcomingSessions = sessions.filter(s => s.date > TODAY && s.status !== "Completed") //filter upcoming sessions

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
    
    return(
        <div style={{display:"grid"}}>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))", // divide into four columns
                gap: 20,
                marginBottom:30,
            }}>
                <Card title="Today's Sessions" count="8" comment="+2 from yesterday"></Card>
                <Card title="Upcoming" count="24" comment="Next 7 days"></Card>
                <Card title="Completed" count="156" comment="This month"></Card>
                <Card title="Active People" count="42" comment="Total registered"></Card>
            </div>
            <div style={{
                display:"grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 20,
                marginBottom:30,
            }}>
                <ListPanel title="Today's Sessions" date="Wednesday, January 15, 2025">
                    <TodaySessionList sessions={todaySessions} RowComponent={TodaySessionRow}></TodaySessionList>
                    {/* send corresponding session data and the RowComponent to list */}
                </ListPanel>
                <ListPanel title="Upcoming Sessions" date="Next 7 days">
                    <UpcomingSessionList sessions={upcomingSessions} RowComponent={UpcomingSessionRow}></UpcomingSessionList>
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
