import type { CSSProperties } from 'react';

import Header from './components/Header';
import Panel from './components/Panel';

const sections = [
  {
    title: 'Project',
    description: 'Group files, commands, and status into dedicated UI pieces.',
  },
  {
    title: 'Editor',
    description: 'Keep your actual workspace isolated from the shell and chrome.',
  },
  {
    title: 'Console',
    description: 'Move logs, diagnostics, and actions into reusable renderer modules.',
  },
];

export default function App() {
  return (
    <main style={styles.page}>
      <Header />
      
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
};
