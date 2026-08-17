
export default function SettingsSidebar() {
    return (
        <div style={styles.sidebar}>
            <h2 style={styles.heading}>Settings</h2>
            <div style={styles.content}>
                <p>Settings content goes here.</p>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    sidebar: {
        width: 300,
        backgroundColor: "#f5f5f5",
        padding: 20,
        boxSizing: "border-box",
    },
    heading: {
        fontSize: 18,
        marginBottom: 10,
    },
    content: {
        fontSize: 14,
    },
}