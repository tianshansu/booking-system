export default function TodaySessionRow({time, info, title, patientName, status}){
    const styles = {
        row: {
            display: "flex",
            alignItems: "center",
            padding: "20px",
            borderBottom: "1px solid #555",
            justifyContent:"space-between"
        },
        time: {
            width: "60px"
        },
        info: {
            flex: 1
        },
        icon:{
            height:20
        },
        button:{
            background: "none",
            border: "none",
        }
    } // style
    
    const viewMoreButton = ()=>{
        alert("Today's Sessions more button clicked!" )
    }

    return(
        <div style={styles.row}>
            <div style={styles.time}>{time}</div>
            <div style={styles.info}>
                <div style={{fontWeight:600}}>{title}</div>
                <div style={{color:"gray"}}>{patientName}</div>
                <div>{status}</div>
            </div>
            <button type="button" style={styles.button} onClick={viewMoreButton}>
                <img src="/icons/more.svg" style={styles.icon} alt="more info"></img>
            </button>
            
        </div>
        // details in render
    )
}