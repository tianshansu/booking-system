export default function TodaySessionRow({ session }) {
  const styles = {
    row: {
      display: "flex",
      alignItems: "center",
      padding: "20px",
      borderBottom: "1px solid #E5E7EB",
      justifyContent: "space-between",
    },
    time: {
      width: "60px",
    },
    info: {
      flex: 1,
    },
    icon: {
      height: 20,
    },
    button: {
      background: "none",
      border: "none",
    },
  }; // style

  const viewMoreButton = () => {
    alert("Today's Sessions more button clicked!");
  };

  return (
    <div style={styles.row}>
      <div style={styles.time}>{session.time}</div>
      <div style={styles.info}>
        <div style={{ fontWeight: 600 }}>{session.title}</div>
        <div style={{ color: "gray" }}>{session.patientName}</div>
        <div>{session.status}</div>
      </div>
      <button type="button" style={styles.button} onClick={viewMoreButton}>
        <img src="/icons/more.svg" style={styles.icon} alt="more info"></img>
      </button>
    </div>
    // details in render
  );
}
