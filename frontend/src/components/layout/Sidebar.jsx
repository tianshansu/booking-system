import {Link} from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar(){
    return (
        <nav className="sidebar">
            <div className="sidebar-title">
                <img className='sidebar-title-icon' src="/icons/calendar.svg" alt='system logo'></img>
                <div className='sidebar-title-text'>Booking System</div></div> 
            <div className="sidebar-links">
                <div className='sidebar-item'>
                    <img className='sidebar-item-icon' src='icons/home-unselected.svg' alt='dashboard-unselected'></img>
                    {/* click to change the route to / */}
                    <Link to="/" className='sidebar-item-text'>Dashboard</Link>
                </div>
                
                <div className='sidebar-item'>
                    <img className='sidebar-item-icon' src='icons/people-unselected.svg' alt='people-unselected'></img>
                    {/* click to change the route to /people */}
                    <Link to="/people" className='sidebar-item-text'>People</Link>
                </div>
                
                <div className='sidebar-item'>
                    <img className='sidebar-item-icon' src='icons/sessions-unselected.svg' alt='sessions-unselected'></img>
                    {/* click to change the route to /sessions */}
                    <Link to="/sessions" className='sidebar-item-text'>Sessions</Link>
                </div>
            </div>

            <div className="sidebar-footer">
                <div className='sidebar-item'>
                    <img className='sidebar-item-icon' src='icons/setting-unselected.svg' alt='settings-unselected'></img>
                    <div className='sidebar-item-text'>Settings</div>
                </div>
                <div className='sidebar-item'>
                    <img className='sidebar-item-icon' src='icons/help-unselected.svg' alt='help-unselected'></img>
                    <div className='sidebar-item-text'>Help</div>
                </div>
            </div>
        </nav>
    );
}