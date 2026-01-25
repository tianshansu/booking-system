export default function ListPanel(props) {
    const styles = {
        footer: {
            display: "flex",
            justifyContent: "center"
        }
    }

    return (
        <div style={{ border: "1px solid #555", backgroundColor: "white" }}>
            <header style={{ borderBottom: "1px solid #555" }}>
                <div style={{ padding: "30px 30px 0 30px" }}>
                    <h3 style={{ margin: 0 }}>{props.title}</h3>
                    <p style={{ marginTop: "6px" }}>{props.date}</p>
                </div>
            </header>

            <div>
                {props.children}
            </div>

            {props.footer && (
                <div style={styles.footer}>
                    {props.footer}
                </div>
            )}

        </div>
    )
}