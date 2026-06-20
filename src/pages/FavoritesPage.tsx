import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Trash2 } from 'lucide-react';
import PhoneCard from '../components/PhoneCard';
import { Phone, SavedComparison } from '../types';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [tab, setTab] = React.useState<'phones' | 'comparisons'>('phones');
  const [favorites, setFavorites] = React.useState<Phone[]>([]);
  const [comparisons, setComparisons] = React.useState<SavedComparison[]>([]);

  React.useEffect(() => {
    const f = localStorage.getItem('favorites');
    const c = localStorage.getItem('savedComparisons');
    if (f) setFavorites(JSON.parse(f));
    if (c) setComparisons(JSON.parse(c));
  }, []);

  const removeFav = (phone: Phone) => {
    const updated = favorites.filter(f => f.id !== phone.id);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const removeComp = (id: string) => {
    const updated = comparisons.filter(c => c.id !== id);
    setComparisons(updated);
    localStorage.setItem('savedComparisons', JSON.stringify(updated));
  };

  const tabStyle = (active: boolean) => ({
    fontFamily: '"Space Mono", monospace',
    fontSize: '0.7rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    padding: '0.6rem 1.25rem',
    cursor: 'pointer',
    background: active ? 'var(--ink)' : 'transparent',
    color: active ? 'var(--paper)' : 'var(--ink-2)',
    border: '1px solid var(--border)',
    borderRight: 'none',
    transition: 'all 0.2s',
  });

  const EmptyState = ({ label }: { label: string }) => (
    <div style={{
      padding: '5rem 2rem',
      textAlign: 'center',
      border: '1px dashed var(--border)',
      background: 'var(--paper-2)',
    }}>
      <div style={{
        fontFamily: '"Cormorant Garamond", Georgia, serif',
        fontSize: '2.5rem',
        color: 'var(--border)',
        fontStyle: 'italic',
        fontWeight: 300,
        marginBottom: '0.5rem',
      }}>
        Coleção vazia
      </div>
      <p style={{ fontFamily: '"EB Garamond", Georgia, serif', color: 'var(--ink-3)', fontSize: '1rem' }}>
        {label}
      </p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── Header ─────────────────────────────────────── */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '2.5rem 1.5rem 2rem',
        background: 'var(--paper-2)',
      }}>
        <div className="page-container">
          <div className="section-label" style={{ marginBottom: '0.5rem' }}>Acervo pessoal</div>
          <h1 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontWeight: 300,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: 'var(--ink)',
            margin: 0,
          }}>
            Minha coleção
          </h1>
        </div>
      </div>

      <div className="page-container" style={{ padding: '2rem 1.5rem' }}>
        {/* ── Tabs ──────────────────────────────────────── */}
        <div style={{ display: 'flex', marginBottom: '2rem' }}>
          <button style={tabStyle(tab === 'phones')} onClick={() => setTab('phones')}>
            Dispositivos ({favorites.length})
          </button>
          <button
            style={{ ...tabStyle(tab === 'comparisons'), borderRight: '1px solid var(--border)' }}
            onClick={() => setTab('comparisons')}
          >
            Comparações ({comparisons.length})
          </button>
        </div>

        {/* ── Phones ────────────────────────────────────── */}
        {tab === 'phones' && (
          favorites.length === 0 ? (
            <EmptyState label="Marque dispositivos como favoritos na página de busca para vê-los aqui." />
          ) : (
            <div className="stagger" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1px',
              background: 'var(--border)',
              border: '1px solid var(--border)',
            }}>
              {favorites.map((phone, i) => (
                <div key={phone.id} style={{ position: 'relative' }}>
                  <PhoneCard phone={phone} index={i} onSelect={() => removeFav(phone)} isSelected />
                </div>
              ))}
            </div>
          )
        )}

        {/* ── Comparisons ───────────────────────────────── */}
        {tab === 'comparisons' && (
          comparisons.length === 0 ? (
            <EmptyState label="Salve comparações na página de comparação para vê-las aqui." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}>
              {comparisons.map(comp => (
                <div key={comp.id} style={{ background: 'var(--paper-2)', padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div className="catalog-num" style={{ marginBottom: '0.25rem' }}>
                        Salvo em {new Date(comp.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                      <div style={{
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontSize: '1.1rem',
                        color: 'var(--ink)',
                      }}>
                        {comp.phones.map(p => p.name).join(' — ')}
                      </div>
                    </div>
                    <button
                      onClick={() => removeComp(comp.id)}
                      style={{
                        background: 'none',
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                        padding: '0.35rem',
                        color: 'var(--ink-3)',
                        transition: 'all 0.15s',
                      }}
                      title="Remover"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Phone thumbnails */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                    {comp.phones.map(phone => (
                      <div key={phone.name} style={{
                        background: '#fff',
                        border: '1px solid var(--border)',
                        padding: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.4rem',
                        width: '100px',
                      }}>
                        {phone.img ? (
                          <img src={phone.img} alt={phone.name} referrerPolicy="no-referrer"
                            style={{ width: '50px', height: '65px', objectFit: 'contain' }} />
                        ) : (
                          <div style={{ width: '50px', height: '65px', background: 'var(--paper-2)', border: '1px dashed var(--border)' }} />
                        )}
                        <span style={{
                          fontFamily: '"Space Mono", monospace',
                          fontSize: '0.55rem',
                          textAlign: 'center',
                          color: 'var(--ink-2)',
                          wordBreak: 'break-word',
                        }}>
                          {phone.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn-ghost"
                    onClick={() => navigate(`/comparar?phones=${comp.phones.map(p => p.id || p.name).join(',')}`)}
                  >
                    Ver comparação
                    <ArrowRight size={11} />
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
