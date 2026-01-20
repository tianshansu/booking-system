export default function TodaySessionRow(data){
    const styles = {
        row: {
            display: "flex",
            alignItems: "center",
            padding: "20px",
            borderBottom: "1px solid #555"
        },

        time: {
            width: "60px"
        },

        info: {
            flex: 1
        }
    } // style
    
    return(
        <div style={styles.row}>
            <div style={styles.time}>{data.time}</div>
            <div style={styles.info}>
                <div style={{fontWeight:600}}>{data.title}</div>
                <div style={{color:"gray"}}>{data.patientName}</div>
                <div>{data.status}</div>
            </div>
        </div>
        // details in render
    )
}