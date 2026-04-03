import type { CSSProperties } from 'react';

export default function Header() {
  return (
    <header style={styles.header}>
      <p style={styles.kicker}>Renderer</p>
      <h1 style={styles.title}>React files now live in separate modules.</h1>
      <p style={styles.description}>
        Start adding screens and shared components under `src/renderer/components`
        instead of growing one renderer file.
      </p>
    </header>
  );
}

const styles: Record<string, CSSProperties> = {
  header: {
    maxWidth: '720px',
    display: 'grid',
    gap: '12px',
  },
  kicker: {
    margin: 0,
    color: '#93c5fd',
    fontSize: '0.875rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
  },
  title: {
    margin: 0,
    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
    lineHeight: 1,
  },
  description: {
    margin: 0,
    color: '#cbd5e1',
    fontSize: '1rem',
    lineHeight: 1.6,
  },
};
