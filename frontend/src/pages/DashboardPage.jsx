import Sidebar from "../components/layout/Sidebar";
import HeadBar from "../components/layout/HeaderBar";
import "./Dashboard.css"

export default function DashboardPage(){
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

                <main className="content"> 
                    {/* a main content area */}
                    <h2>Main Content</h2>
                    <p>4 cards + 2 columns of session list</p>
                </main>
            </div>
        </div>
    )
}