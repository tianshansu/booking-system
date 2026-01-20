import Sidebar from "../components/layout/Sidebar";
import HeadBar from "../components/layout/HeaderBar";
import "./Dashboard.css"
import Card from "../components/Card";
import ListPanel from "../components/ListPanel";
import TodaySessionList from "../components/TodaySessionList";
import UpcomingSessionList from "../components/UpcomingSessionList";
import TodaySessionRow from "../components/TodaySessionRow";
import UpcomingSessionRow from "../components/UpcomingSessionRow";

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
            <div>recent activity</div>
        </div>    
    )
}