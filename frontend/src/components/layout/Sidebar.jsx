export default function Sidebar(){
    return (
        <nav className="sidebar">
            <div style={{fontWeight:800, marginBottom:16}}>Booking System</div> 
            <div style={{display:"grid", gap:8}}>
                <div>Dashboard</div>
                <div>People</div>
                <div>Sessions</div>
            </div>
            <div style={{marginTop:24, color:"#666"}}>
                <div>Settings</div>
                <div>Help</div>
            </div>
        </nav>
    );
}