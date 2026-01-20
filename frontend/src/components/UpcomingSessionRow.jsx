export default function UpcomingSessionRow(session){
    const styles={
        row:{
            display:"grid",
            padding:"20px",
            borderBottom: "1px solid #555"
        },
        dateTime:{
            display:"flex",
            gap:10
        }
    }

    return(
        <div style={styles.row}>
            <div style={styles.dateTime}>
                <div>{session.date}</div>
                <div style={{color:"gray"}}>{session.time}</div>
            </div>
            <div style={{fontWeight:600}}>{session.title}</div>
            <div style={{color:"gray"}}>{session.patientName}</div>
            
        </div>
    )
}