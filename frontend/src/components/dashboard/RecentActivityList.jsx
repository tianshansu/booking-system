export default function RecentActivityList({ activities, RowComponent }) {
  return (
    <div>
      {activities.map((activity) => (
        <RowComponent key={activity.id} activity={activity}></RowComponent>
      ))}
    </div>
  );
}
