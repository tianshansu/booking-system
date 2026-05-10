export default function RecentActivityList({ activities, RowComponent }) {
  return (
    <>
      {activities.map((activity) => (
        <RowComponent key={activity.id} activity={activity}></RowComponent>
      ))}
    </>
  );
}
