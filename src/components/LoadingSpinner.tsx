export default function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '3rem' }}>
      <div className="archive-spinner" />
      <span style={{
        fontFamily: '"Space Mono", monospace',
        fontSize: '0.65rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--ink-3)',
      }}>
        Carregando acervo…
      </span>
    </div>
  );
}
