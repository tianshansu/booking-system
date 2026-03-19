export default function TodaySessionList({
  sessions,
  RowComponent,
  onMarkCompleted,
  onMarkCanceled,
}) {
  return (
    <div>
      {sessions.map((session) => (
        <RowComponent
          key={session.id}
          session={session}
          onMarkCompleted={onMarkCompleted}
          onMarkCanceled={onMarkCanceled}
        />
      ))}
    </div>
  );
}
