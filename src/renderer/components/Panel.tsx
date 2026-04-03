import type { CSSProperties } from 'react';

type PanelProps = {
  title: string;
  description: string;
};

export default function Panel({ title, description }: PanelProps) {
  return (
    <article style={styles.panel}>
      <h2 style={styles.title}>{title}</h2>
      <p style={styles.description}>{description}</p>
    </article>
  );
}

const styles: Record<string, CSSProperties> = {
  panel: {
    padding: '20px',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '16px',
    background: 'rgba(15, 23, 42, 0.72)',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.3)',
    display: 'grid',
    gap: '12px',
  },
  title: {
    margin: 0,
    fontSize: '1.125rem',
  },
  description: {
    margin: 0,
    color: '#cbd5e1',
    lineHeight: 1.5,
  },
};
