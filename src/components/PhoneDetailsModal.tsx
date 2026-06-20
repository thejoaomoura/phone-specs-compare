import { X } from 'lucide-react';
import { Phone } from '../types';

interface PhoneDetailsModalProps {
  phone: Phone;
  isOpen: boolean;
  onClose: () => void;
}

export default function PhoneDetailsModal({ phone, isOpen, onClose }: PhoneDetailsModalProps) {
  if (!isOpen || !phone) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          background: 'var(--paper-2)',
        }}>
          <div>
            <div className="catalog-num" style={{ color: 'var(--rust)', marginBottom: '0.3rem' }}>
              {phone.name.split(' ')[0]} — Especificações
            </div>
            <h2 style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: 400,
              fontSize: '1.6rem',
              color: 'var(--ink)',
              margin: 0,
              lineHeight: 1.1,
            }}>
              {phone.name}
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: 'none',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            padding: '0.4rem',
            color: 'var(--ink-2)',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.15s',
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0' }}>
          {/* Image */}
          <div style={{
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            borderRight: '1px solid var(--border)',
          }}>
            {phone.img ? (
              <img
                src={phone.img}
                alt={phone.name}
                referrerPolicy="no-referrer"
                style={{ maxHeight: '240px', maxWidth: '100%', objectFit: 'contain' }}
              />
            ) : (
              <div style={{
                width: '100px', height: '150px',
                border: '1px dashed var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.55rem', color: 'var(--ink-3)' }}>
                  sem imagem
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ padding: '1.5rem' }}>
            {phone.description && (
              <>
                <div className="section-label" style={{ marginBottom: '0.75rem' }}>Descrição</div>
                <p style={{
                  fontFamily: '"EB Garamond", Georgia, serif',
                  fontSize: '0.95rem',
                  color: 'var(--ink-2)',
                  lineHeight: 1.7,
                  marginBottom: '1.5rem',
                }}>
                  {phone.description}
                </p>
              </>
            )}
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>Acesso rápido</div>
            <p style={{
              fontFamily: '"EB Garamond", Georgia, serif',
              fontSize: '0.9rem',
              color: 'var(--ink-3)',
              fontStyle: 'italic',
            }}>
              Abra a página de comparação para ver todas as especificações técnicas detalhadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
