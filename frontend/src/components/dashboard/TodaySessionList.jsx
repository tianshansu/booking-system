export default function TodaySessionList({sessions, RowComponent}){
    return(
        <div>
            {sessions.map(item => (
                <RowComponent
                    key={item.id}
                    time={item.time}
                    title={item.title}
                    patientName={item.patientName}
                    status={item.status}
                />
            ))}
        </div>
    )
}