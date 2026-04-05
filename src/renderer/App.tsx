import type { CSSProperties } from 'react';

import Header from './components/Header';
import ModernEditor from './components/ModernEditor';

export default function App() {
  return (
    <main style={styles.page}>
      <Header />
      <section style={styles.editorShell}>
        <ModernEditor />
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    padding: '48px 24px',
    display: 'grid',
    gap: '24px',
    alignContent: 'start',
  },
  editorShell: {
    width: '100%',
  },
};
