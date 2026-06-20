interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div style={{
      border: '1px solid var(--rust)',
      padding: '2rem',
      background: 'var(--paper-2)',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: '"Space Mono", monospace',
        fontSize: '0.6rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--rust)',
        marginBottom: '0.75rem',
      }}>
        ✕ Falha no acervo
      </div>
      <p style={{
        fontFamily: '"EB Garamond", Georgia, serif',
        fontSize: '1rem',
        color: 'var(--ink-2)',
        marginBottom: onRetry ? '1.25rem' : 0,
      }}>
        {message}
      </p>
      {onRetry && (
        <button className="btn-ghost" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
