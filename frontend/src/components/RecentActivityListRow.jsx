export default function RecentActivityListRow({message, time}){
    const styles={
        row:{
            display:"flex",
            padding:"20px",
            borderBottom:"1px solid #555",
            gap:10
        },
       icon:{
            height:40,
            
       }
    }
    
    return(
        <div style={styles.row}>
            <img style={styles.icon} src="/icons/tick.svg" alt="tick" />
            <div>
                <div>{message}</div>
                <div>{time}</div>
            </div>
            
        </div>
    )
}