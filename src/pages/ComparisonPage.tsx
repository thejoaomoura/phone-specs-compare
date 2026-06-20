import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { useQueries } from 'react-query';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { PhoneDetail } from '../types';
import { translateCategory, translateSpec } from '../utils/translations';
import { getPhoneDetails } from '../services/api';
import { fetchPhonePrice } from '../services/priceService';
import { useEffect, useState, useCallback } from 'react';
import { CheckCircle } from 'lucide-react';

export default function ComparisonPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const phoneIds = searchParams.get('phones')?.split(',') || [];
  const [phonePrices, setPhonePrices] = useState<Record<string, { price: string; link: string | null }>>({});
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const phoneQueries = useQueries(
    phoneIds.map(id => ({
      queryKey: ['phone', id],
      queryFn: () => getPhoneDetails(id),
      enabled: Boolean(id),
      staleTime: 60 * 60 * 1000,
    }))
  );
  const isLoading = phoneQueries.some(q => q.isLoading);
  const errors = phoneQueries.filter(q => q.error).map(q => q.error);
  const phones = phoneQueries.map(q => q.data).filter((p): p is PhoneDetail => Boolean(p));
  const phonePriceKey = phones.map(phone => phone.name).join('|');

  useEffect(() => {
    if (!phonePriceKey) return;

    let isMounted = true;
    const phoneNames = phonePriceKey.split('|');

    Promise.all(
      phoneNames.map(async name => {
        const info = await fetchPhonePrice(name);
        return { id: name, ...info };
      })
    ).then(prices => {
      if (!isMounted) return;

      const map = prices.reduce((acc, { id, price, link }) => {
        if (price) acc[id] = { price, link };
        return acc;
      }, {} as Record<string, { price: string; link: string | null }>);
      setPhonePrices(map);
    });

    return () => {
      isMounted = false;
    };
  }, [phonePriceKey]);

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('savedComparisons') || '[]');
    saved.unshift({ id: Date.now().toString(), phones, date: new Date().toISOString() });
    localStorage.setItem('savedComparisons', JSON.stringify(saved));
    showToast('Comparação salva na coleção.');
  };

  const handleShare = async () => {
    try { await navigator.share({ title: 'Comparativo de dispositivos', url: window.location.href }); }
    catch { /* unsupported */ }
  };

  if (phoneIds.length < 2) return (
    <div className="page-container" style={{ padding: '3rem 1.5rem' }}>
      <ErrorMessage message="Selecione pelo menos 2 dispositivos para comparar." onRetry={() => navigate('/buscar')} />
    </div>
  );

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
      <LoadingSpinner />
    </div>
  );

  if (errors.length > 0) return (
    <div className="page-container" style={{ padding: '3rem 1.5rem' }}>
      <ErrorMessage
        message="Não foi possível carregar as especificações."
        onRetry={() => phoneQueries.forEach(q => q.refetch())}
      />
    </div>
  );

  const cols = phones.length;

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── Topbar ─────────────────────────────────────── */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--paper-2)',
        position: 'sticky',
        top: '88px',
        zIndex: 30,
      }}>
        <button className="btn-ghost" onClick={() => navigate('/buscar')}>
          <ArrowLeft size={13} />
          Voltar ao catálogo
        </button>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-ghost" onClick={handleShare}>
            <Share2 size={12} />
            Compartilhar
          </button>
          <button className="btn-primary" onClick={handleSave}>
            <Bookmark size={12} />
            Salvar
          </button>
        </div>
      </div>

      {/* ── Phone headers ──────────────────────────────── */}
      <div className="page-container" style={{ padding: '2.5rem 1.5rem 0' }}>
        <div className="section-label" style={{ marginBottom: '1.5rem' }}>
          Análise comparativa — {phones.map(p => p.name).join(' vs. ')}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: `200px repeat(${cols}, 1fr)`, gap: 0, border: '1px solid var(--border)' }}>
          {/* empty corner */}
          <div style={{ background: 'var(--ink)', borderRight: '1px solid rgba(242,237,226,0.1)' }} />
          {phones.map((phone, i) => (
            <div key={phone.name} style={{
              background: 'var(--ink)',
              color: 'var(--paper)',
              padding: '1.5rem 1rem',
              borderRight: i < cols - 1 ? '1px solid rgba(242,237,226,0.1)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              {/* Image */}
              <div style={{
                width: '100px',
                height: '130px',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
              }}>
                {phone.img && (
                  <img
                    src={phone.img}
                    alt={phone.name}
                    referrerPolicy="no-referrer"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                )}
              </div>
              {/* Name */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: '"Space Mono", monospace',
                  fontSize: '0.55rem',
                  letterSpacing: '0.1em',
                  color: 'rgba(242,237,226,0.5)',
                  textTransform: 'uppercase',
                  marginBottom: '0.3rem',
                }}>
                  {phone.brand}
                </div>
                <div style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontWeight: 400,
                  fontSize: '1.1rem',
                  color: 'var(--paper)',
                  lineHeight: 1.2,
                }}>
                  {phone.name.replace(phone.brand, '').trim()}
                </div>
              </div>
              {/* Price */}
              <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
                {phonePrices[phone.name]?.price ? (
                  <>
                    <div style={{
                      fontFamily: '"Space Mono", monospace',
                      fontSize: '0.85rem',
                      color: 'var(--rust)',
                      letterSpacing: '0.02em',
                    }}>
                      R$ {Number(phonePrices[phone.name].price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    {phonePrices[phone.name]?.link && (
                      <a
                        href={phonePrices[phone.name].link!}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: '"Space Mono", monospace',
                          fontSize: '0.55rem',
                          color: 'rgba(242,237,226,0.4)',
                          textDecoration: 'underline',
                          letterSpacing: '0.08em',
                        }}
                      >
                        Ver oferta
                      </a>
                    )}
                  </>
                ) : (
                  <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.6rem', color: 'rgba(242,237,226,0.3)' }}>
                    Preço indisponível
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Toast ─────────────────────────────────────── */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          background: 'var(--ink)',
          color: 'var(--paper)',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          border: '1px solid rgba(242,237,226,0.15)',
          zIndex: 100,
          animation: 'slideUpFade 0.25s ease both',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}>
          <CheckCircle size={14} style={{ color: 'var(--rust)', flexShrink: 0 }} />
          <span style={{
            fontFamily: '"Space Mono", monospace',
            fontSize: '0.65rem',
            letterSpacing: '0.08em',
          }}>
            {toast}
          </span>
        </div>
      )}

      {/* ── Spec tables ────────────────────────────────── */}
      <div className="page-container" style={{ padding: '0 1.5rem 3rem' }}>
        {phones[0]?.detailSpec.map((category, catIdx) => {
          return (
            <div key={category.category} style={{ marginTop: '2px' }}>
              {/* Category header */}
              <div className="compare-cat-header" style={{ display: 'grid', gridTemplateColumns: `200px repeat(${cols}, 1fr)` }}>
                <div style={{ borderRight: '1px solid rgba(242,237,226,0.1)' }}>
                  {translateCategory(category.category)}
                </div>
                {phones.map((p, i) => (
                  <div key={p.name} style={{
                    borderRight: i < cols - 1 ? '1px solid rgba(242,237,226,0.1)' : 'none',
                    fontFamily: '"Space Mono", monospace',
                    fontSize: '0.6rem',
                    letterSpacing: '0.08em',
                    color: 'rgba(242,237,226,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {p.name.split(' ')[0]}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {category.specifications.map((spec, specIdx) => {
                const values = phones.map(
                  p => p.detailSpec[catIdx]?.specifications[specIdx]?.value || '—'
                );
                const hasDiff = new Set(values).size > 1;

                return (
                  <div
                    key={spec.name}
                    className="compare-row"
                    style={{
                      gridTemplateColumns: `200px repeat(${cols}, 1fr)`,
                      background: hasDiff ? 'rgba(193,68,14,0.04)' : undefined,
                      borderLeft: '1px solid var(--border)',
                      borderRight: '1px solid var(--border)',
                    }}
                  >
                    <div className="compare-cell-label">{translateSpec(spec.name)}</div>
                    {values.map((val, vi) => (
                      <div
                        key={vi}
                        className={`compare-cell-value${hasDiff && val !== '—' ? ' highlight' : ''}`}
                        style={{ borderRight: vi < cols - 1 ? '1px solid var(--border)' : 'none' }}
                      >
                        {val === 'Sim' ? '✓' : val === 'Não' ? '—' : val}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
