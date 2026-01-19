import {Link} from 'react-router-dom';

export default function Sidebar(){
    return (
        <nav className="sidebar">
            <div style={{fontWeight:800, marginBottom:16}}>Booking System</div> 
            <div style={{display:"grid", gap:8}}>
                <Link to="/" className='sidebar-item'>Dashboard</Link> 
                {/* click to change the route to / */}
                <Link to="/people" className='sidebar-item'>People</Link>
                {/* click to change the route to /people */}
                <Link to="/sessions" className='sidebar-item'>Sesions</Link>
                {/* click to change the route to /sessions */}
            </div>
            <div style={{marginTop:24, color:"#666"}}>
                <div>Settings</div>
                <div>Help</div>
            </div>
        </nav>
    );
}