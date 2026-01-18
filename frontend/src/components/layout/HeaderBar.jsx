export default function HeaderBar(){
    return (
        <header style={{width:"100%", display:"flex", justifyContent:"space-between"}}>
            <div>
                <div style={{fontWeight:800, fontSize:20}}>Dashboard</div>
                <div style={{fontSize:14}}>Welcome back!</div>
            </div>
            <input placeholder="Search..." style={{width:260}}></input>
        </header>
    );
}