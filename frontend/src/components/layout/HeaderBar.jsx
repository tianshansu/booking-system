import './HeaderBar.css';
import { useLocation } from "react-router-dom";

const TITLE_MAP = {
    "/": "Dashboard",
    "/people": "People",
    "/sessions": "Sessions",
};

const SUBTITLE_MAP = {
    "/": "Welcome back!",
    "/people": "Manage people",
    "/sessions": "Manage sessions",
};

export default function HeaderBar(){
    const location = useLocation();
    const path = location.pathname; //get path name from location

    const title = TITLE_MAP[path] ?? "Dashboard"; //if the path exists in TITLE_MAP, then give the value to title
    const subtitle = SUBTITLE_MAP[path] ?? "Welcome back!"; //similar to above

    return (
        <header className='header'>
            <div className='header-content'>
                {/* display values */}
                <div className='header-content-title'>{title}</div> 
                <div className='header-content-text'>{subtitle}</div>
            </div>
            <input className='header-search' placeholder="Search..." ></input>
        </header>
    );
}