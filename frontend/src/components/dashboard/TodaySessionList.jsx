export default function TodaySessionList({ sessions, RowComponent }) {
  return (
    <div>
      {sessions.map((item) => (
        <RowComponent key={item.id} session={item} />
      ))}
    </div>
  );
}
