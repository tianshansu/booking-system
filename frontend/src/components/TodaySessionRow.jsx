export default function TodaySessionRow(){
    const styles = {
        row: {
            display: "flex",
            alignItems: "center",
            padding: "12px",
            borderBottom: "1px solid #ddd"
        },

        time: {
            padding:"12px 12px 12px 12px",
            width: "60px"
        },

        info: {
            flex: 1
        }
    }
    
    return(
        <div style={{borderBottom: "1px solid #555"}}>
            <div style={styles.row}>
                <div style={styles.time}>9:00</div>
                <div style={styles.info}>
                    <div style={{fontWeight:600}}>Session Name</div>
                    <div style={{color:"gray"}}>Patient Name</div>
                    <div>Status</div>
                </div>
            </div>
        </div>
        
    )
}