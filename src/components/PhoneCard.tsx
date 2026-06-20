import React from 'react';
import { Phone } from '../types';
import { Heart, Plus, Check } from 'lucide-react';

interface PhoneCardProps {
  phone: Phone;
  isSelected?: boolean;
  onSelect?: (phone: Phone) => void;
  isFavorite?: boolean;
  index?: number;
}

export default function PhoneCard({ phone, isSelected, onSelect, index = 0 }: PhoneCardProps) {
  const [isFav, setIsFav] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      const favs: Phone[] = JSON.parse(stored);
      setIsFav(favs.some(f => f.id === phone.id));
    }
  }, [phone.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const stored = localStorage.getItem('favorites');
    let favs: Phone[] = stored ? JSON.parse(stored) : [];
    if (isFav) {
      favs = favs.filter(f => f.id !== phone.id);
    } else {
      favs.push(phone);
    }
    localStorage.setItem('favorites', JSON.stringify(favs));
    setIsFav(!isFav);
  };

  const catalogNum = String(index + 1).padStart(4, '0');

  return (
    <div className="specimen-card" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Catalog header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0.75rem',
        borderBottom: '1px solid var(--border)',
        background: 'var(--paper)',
        position: 'relative',
        zIndex: 1,
      }}>
        <span className="catalog-num">#{catalogNum}</span>
        <button
          onClick={toggleFavorite}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            color: isFav ? 'var(--rust)' : 'var(--ink-3)',
            transition: 'color 0.2s',
            lineHeight: 1,
          }}
          title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart size={13} fill={isFav ? 'currentColor' : 'none'} strokeWidth={1.5} />
        </button>
      </div>

      {/* Image area */}
      <div style={{
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        zIndex: 1,
        minHeight: '180px',
      }}>
        {phone.img ? (
          <img
            src={phone.img}
            alt={phone.name}
            referrerPolicy="no-referrer"
            style={{
              maxHeight: '150px',
              maxWidth: '100%',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
            }}
          />
        ) : (
          <div style={{
            width: '80px',
            height: '120px',
            border: '1px dashed var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.55rem', color: 'var(--ink-3)', textTransform: 'uppercase' }}>
              sem imagem
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '0.75rem', position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Brand */}
        <div className="catalog-num" style={{ color: 'var(--rust)', letterSpacing: '0.12em' }}>
          {phone.name.split(' ')[0]}
        </div>

        {/* Name */}
        <h3 style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontWeight: 400,
          fontSize: '1.1rem',
          color: 'var(--ink)',
          lineHeight: 1.2,
          margin: 0,
        }}>
          {phone.name.split(' ').slice(1).join(' ') || phone.name}
        </h3>

        {/* Action */}
        {onSelect && (
          <button
            onClick={() => onSelect(phone)}
            style={{
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              width: '100%',
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              border: isSelected ? '1px solid var(--rust)' : '1px solid var(--border)',
              background: isSelected ? 'var(--rust)' : 'transparent',
              color: isSelected ? 'var(--paper)' : 'var(--ink-2)',
              transition: 'all 0.2s',
            }}
          >
            {isSelected ? <><Check size={11} /> Selecionado</> : <><Plus size={11} /> Comparar</>}
          </button>
        )}
      </div>
    </div>
  );
}
