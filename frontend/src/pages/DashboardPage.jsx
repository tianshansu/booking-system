import Sidebar from "../components/layout/Sidebar";
import HeadBar from "../components/layout/HeaderBar";
import "./Dashboard.css"
import Card from "../components/Card";

export default function DashboardPage(){
    return(
        <div style={{display:"grid"}}>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))", // divide into four columns
                gap: 20,
            }}>
                <Card title="Today's Sessions" count="8" comment="+2 from yesterday"></Card>
                <Card title="Upcoming" count="24" comment="Next 7 days"></Card>
                <Card title="Completed" count="156" comment="This month"></Card>
                <Card title="Active People" count="42" comment="Total registered"></Card>
            </div>
            <div>2 columns of sessions</div>
            <div>recent activity</div>
        </div>    
    )
}