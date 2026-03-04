export default function RecentActivityList({activities, RowComponent}){
    return(
        <div>
            {activities.map(item=>(
                <RowComponent 
                    key={item.id}
                    message={item.message}
                    time={item.time}
                ></RowComponent>
            ))}
        </div>
    )
}