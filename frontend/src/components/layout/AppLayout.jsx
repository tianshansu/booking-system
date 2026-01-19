import Sidebar from "./Sidebar";
import HeadBar from "./HeaderBar";
import { Outlet } from "react-router-dom";
import "../../pages/Dashboard.css";

export default function AppLayout(){
    return(
        <div className="appShell">  
            {/* the shell for the whole app */}
            <aside className="sidebar"> 
                {/* left column */}
                <Sidebar></Sidebar> 
            </aside>

            <div className="right"> 
                {/* right column */}
                <header className="header"> 
                    {/* a header */}
                    <HeadBar></HeadBar>
                </header>

                <main className="content" style={{padding:"30px"}}> 
                    <Outlet></Outlet>
                </main>
            </div>
        </div>
    )
}