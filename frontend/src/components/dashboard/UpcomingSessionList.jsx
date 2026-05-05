export default function UpcomingSessionList({
  sessions,
  RowComponent,
  onMarkCanceled,
}) {
  return (
    <div>
      {
        sessions.map((session) => (
          <RowComponent
            key={session.id}
            session={session}
            onMarkCanceled={onMarkCanceled}
          ></RowComponent>
        ))
        // map items to render
      }
    </div>
  );
}
