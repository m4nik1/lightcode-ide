import type { CSSProperties } from "react";
import ModernEditor from "./components/ModernEditor";
import TopBar from "./components/TopBar";

export default function App() {
  return (
    <main style={styles.page}>
      <TopBar />
      <section style={styles.editorShell}>
        <ModernEditor />
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    height: "100vh",
    display: "grid",
    gridTemplateRows: "30px minmax(0, 1fr)",
  },
  editorShell: {
    width: "100%",
    height: "100%",
    minHeight: 0,
  },
};
