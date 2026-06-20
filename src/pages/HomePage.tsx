import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { useTopPhones } from '../hooks/useTopPhones';
import PhoneCarousel from '../components/PhoneCarousel';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: phones, isLoading, isError, refetch } = useTopPhones();

  useEffect(() => {
    const t = setInterval(refetch, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [refetch]);

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── Hero ────────────────────────────────────────── */}
      <section style={{
        borderBottom: '1px solid var(--border)',
        padding: '5rem 1.5rem 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative large number */}
        <div style={{
          position: 'absolute',
          right: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: 'clamp(8rem, 18vw, 18rem)',
          fontWeight: 300,
          color: 'var(--paper-3)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: '-0.05em',
        }}>
          01
        </div>

        <div className="page-container" style={{ maxWidth: '680px', position: 'relative' }}>
          <div className="section-label anim-slide-left" style={{ marginBottom: '1.5rem' }}>
            Catálogo de Dispositivos Móveis
          </div>

          <h1 className="anim-slide-up" style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontWeight: 300,
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            color: 'var(--ink)',
            lineHeight: 1.05,
            marginBottom: '1.25rem',
            animationDelay: '0.1s',
          }}>
            Compare os melhores<br />
            <em style={{ fontStyle: 'italic', fontWeight: 300 }}>smartphones</em> do mercado
          </h1>

          <p className="anim-slide-up" style={{
            fontFamily: '"EB Garamond", Georgia, serif',
            fontSize: '1.15rem',
            color: 'var(--ink-2)',
            lineHeight: 1.65,
            marginBottom: '2rem',
            maxWidth: '520px',
            animationDelay: '0.2s',
          }}>
            Encontre especificações detalhadas, compare modelos lado a lado e descubra o dispositivo ideal com base em dados reais.
          </p>

          <div className="anim-slide-up" style={{ display: 'flex', gap: '0.75rem', animationDelay: '0.3s' }}>
            <button className="btn-primary" onClick={() => navigate('/buscar')}>
              <Search size={13} />
              Buscar no catálogo
            </button>
            <button className="btn-ghost" onClick={() => navigate('/comparar')}>
              Comparar agora
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────── */}
      <div style={{
        background: 'var(--ink)',
        color: 'var(--paper)',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        borderBottom: '1px solid var(--border)',
      }}>
        {[
          { num: '5.800+', label: 'Dispositivos catalogados' },
          { num: '128',    label: 'Marcas registradas' },
          { num: 'Real',   label: 'Dados direto do GSMArena' },
        ].map((item, i) => (
          <div key={i} style={{
            padding: '1rem 1.5rem',
            borderRight: i < 2 ? '1px solid rgba(242,237,226,0.1)' : 'none',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '1.75rem',
              fontWeight: 300,
              color: 'var(--paper)',
              lineHeight: 1,
            }}>
              {item.num}
            </div>
            <div style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.55rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(242,237,226,0.5)',
              marginTop: '0.3rem',
            }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Top phones ──────────────────────────────────── */}
      <section style={{ padding: '3rem 1.5rem' }} className="page-container">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <div className="section-label" style={{ marginBottom: '0.5rem' }}>
              Em destaque esta semana
            </div>
            <h2 style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: 400,
              fontSize: '1.75rem',
              color: 'var(--ink)',
              margin: 0,
            }}>
              Mais procurados no acervo
            </h2>
          </div>
          <button
            className="btn-ghost"
            onClick={() => navigate('/buscar')}
            style={{ flexShrink: 0 }}
          >
            Ver todos
            <ArrowRight size={11} />
          </button>
        </div>

        {isLoading && <LoadingSpinner />}
        {isError && (
          <ErrorMessage
            message="Não foi possível carregar o acervo. Verifique sua conexão."
            onRetry={refetch}
          />
        )}
        {phones && phones.length > 0 && (
          <PhoneCarousel phones={phones} autoplayInterval={7000} />
        )}
      </section>

      {/* ── Bottom CTA ──────────────────────────────────── */}
      <section style={{
        borderTop: '3px double var(--border)',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        background: 'var(--paper-2)',
      }}>
        <div className="catalog-num" style={{ marginBottom: '0.75rem' }}>
          Pronto para comparar?
        </div>
        <h2 style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontWeight: 300,
          fontSize: '2rem',
          color: 'var(--ink)',
          marginBottom: '1.25rem',
        }}>
          Selecione dois modelos e compare
        </h2>
        <button className="btn-primary" onClick={() => navigate('/buscar')}>
          Iniciar comparação
          <ArrowRight size={13} />
        </button>
      </section>
    </div>
  );
}
