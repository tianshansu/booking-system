export default function UpcomingSessionList({sessions, RowComponent}){
    return(
        <div>
            {
                sessions.map(item=>(
                    <RowComponent
                        key={item.id}
                        date={item.date}
                        time={item.time}
                        title={item.title}
                        patientName={item.patientName}>
                    </RowComponent>
                ))
                // map items to render
            }
        </div>
    )
}