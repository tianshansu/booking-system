export default function UpcomingSessionRow({date, time, title, patientName}){
    const styles={
        row:{
            display:"flex",
            padding:"20px",
            borderBottom: "1px solid #E5E7EB",
            justifyContent:"space-between"

        },
        dateTime:{
            display:"flex",
            gap:10
        },
        content:{
            display:"grid",
        },
        icon:{
            height:20
        },
        button:{
            background: "none",
            border: "none",
        }
    }

    const viewMoreButton = ()=>{
        alert("Upcoming Sessions more button clicked!" )
    }

    return(
        <div style={styles.row}>
            <div style={styles.content}>
                <div style={styles.dateTime}>
                    <div>{date}</div>
                    <div style={{color:"gray"}}>{time}</div>
                </div>
                <div style={{fontWeight:600}}>{title}</div>
                <div style={{color:"gray"}}>{patientName}</div>
            </div>
            <button type="button" style={styles.button} onClick={viewMoreButton} aria-label="View more options">
                <img src="/icons/more.svg" style={styles.icon} alt="more info"></img>
            </button>
        </div>
    )
}