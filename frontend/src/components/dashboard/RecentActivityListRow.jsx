export default function RecentActivityListRow({ activity }) {
  const styles = {
    row: {
      display: "flex",
      padding: "20px",
      borderBottom: "1px solid #E5E7EB",
      gap: 10,
    },
    icon: {
      height: 40,
    },
  };

  function formatTimeAgo(dateString) {
    const diffHours = Math.floor(
      (Date.now() - new Date(dateString)) / (1000 * 60 * 60),
    );

    if (diffHours < 1) return "just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  }

  return (
    <div style={styles.row}>
      <img style={styles.icon} src="/icons/tick.svg" alt="tick" />
      <div>
        <div>{activity.message}</div>
        <div>{formatTimeAgo(activity.createdAt)}</div>
      </div>
    </div>
  );
}
