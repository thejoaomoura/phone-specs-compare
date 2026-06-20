import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Phone } from '../types';
import PhoneCard from './PhoneCard';
import PhoneDetailsModal from './PhoneDetailsModal';

interface PhoneCarouselProps {
  phones: Phone[];
  autoplayInterval?: number;
}

export default function PhoneCarousel({ phones, autoplayInterval = 6000 }: PhoneCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhone, setSelectedPhone] = useState<Phone | null>(null);

  const ITEMS = 4;
  const totalPages = Math.ceil(phones.length / ITEMS);

  useEffect(() => {
    if (totalPages <= 1) return;
    const t = setInterval(() => setCurrentIndex(i => (i + 1) % totalPages), autoplayInterval);
    return () => clearInterval(t);
  }, [totalPages, autoplayInterval]);

  const prev = () => setCurrentIndex(i => (i - 1 + totalPages) % totalPages);
  const next = () => setCurrentIndex(i => (i + 1) % totalPages);

  const visible = phones.slice(currentIndex * ITEMS, currentIndex * ITEMS + ITEMS);

  return (
    <div style={{ position: 'relative' }}>
      {/* Counter */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: '1rem',
        gap: '1rem',
      }}>
        <span style={{
          fontFamily: '"Space Mono", monospace',
          fontSize: '0.65rem',
          color: 'var(--ink-3)',
          letterSpacing: '0.1em',
        }}>
          {String(currentIndex + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
        </span>
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button onClick={prev} className="btn-ghost" style={{ padding: '0.3rem 0.5rem' }}>
              <ChevronLeft size={14} />
            </button>
            <button onClick={next} className="btn-ghost" style={{ padding: '0.3rem 0.5rem' }}>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="stagger" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1px',
        background: 'var(--border)',
        border: '1px solid var(--border)',
      }}>
        {visible.map((phone, i) => (
          <div key={phone.id} onClick={() => setSelectedPhone(phone)} style={{ cursor: 'pointer' }}>
            <PhoneCard phone={phone} index={currentIndex * ITEMS + i} />
          </div>
        ))}
        {/* Fill empty slots */}
        {Array.from({ length: ITEMS - visible.length }).map((_, i) => (
          <div key={`empty-${i}`} style={{
            background: 'var(--paper-2)',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.6rem', color: 'var(--border)', textTransform: 'uppercase' }}>
              vazio
            </span>
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                width: i === currentIndex ? '1.5rem' : '0.4rem',
                height: '2px',
                background: i === currentIndex ? 'var(--rust)' : 'var(--border)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}

      <PhoneDetailsModal
        phone={selectedPhone!}
        isOpen={!!selectedPhone}
        onClose={() => setSelectedPhone(null)}
      />
    </div>
  );
}
