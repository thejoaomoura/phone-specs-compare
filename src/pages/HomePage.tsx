import { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Scale, Bookmark } from 'lucide-react';
import { useTopPhones } from '../hooks/useTopPhones';
import SocialCards from '../components/ui/card-fan-carousel';
import LoadingSpinner from '../components/LoadingSpinner';
import { ProgressiveFluxLoader } from '../components/ui/progressive-flux-loader';
import ErrorMessage from '../components/ErrorMessage';
import { ShaderAnimation } from '../components/ui/shader-animation';
import DisplayCards from '../components/ui/display-cards';
import type { BeamPath } from '../components/ui/pulse-beams';
import PhoneDetailsModal from '../components/PhoneDetailsModal';
import type { Phone } from '../types/index';

const PulseBeams = lazy(() =>
  import('../components/ui/pulse-beams').then((module) => ({
    default: module.PulseBeams,
  }))
);

const comparisonPulseBeams: BeamPath[] = [
  {
    path: 'M269 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5',
    gradientConfig: {
      initial: { x1: '0%', x2: '0%', y1: '80%', y2: '100%' },
      animate: {
        x1: ['0%', '0%', '200%'],
        x2: ['0%', '0%', '180%'],
        y1: ['80%', '0%', '0%'],
        y2: ['100%', '20%', '20%'],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        repeatDelay: 2,
        delay: 0.2,
      },
    },
    connectionPoints: [
      { cx: 6.5, cy: 398.5, r: 6 },
      { cx: 269, cy: 220.5, r: 6 },
    ],
  },
  {
    path: 'M568 200H841C846.523 200 851 195.523 851 190V40',
    gradientConfig: {
      initial: { x1: '0%', x2: '0%', y1: '80%', y2: '100%' },
      animate: {
        x1: ['20%', '100%', '100%'],
        x2: ['0%', '90%', '90%'],
        y1: ['80%', '80%', '-20%'],
        y2: ['100%', '100%', '0%'],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        repeatDelay: 2,
        delay: 0.8,
      },
    },
    connectionPoints: [
      { cx: 851, cy: 34, r: 6.5 },
      { cx: 568, cy: 200, r: 6 },
    ],
  },
  {
    path: 'M425.5 274V333C425.5 338.523 421.023 343 415.5 343H152C146.477 343 142 347.477 142 353V426.5',
    gradientConfig: {
      initial: { x1: '0%', x2: '0%', y1: '80%', y2: '100%' },
      animate: {
        x1: ['20%', '100%', '100%'],
        x2: ['0%', '90%', '90%'],
        y1: ['80%', '80%', '-20%'],
        y2: ['100%', '100%', '0%'],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        repeatDelay: 2,
        delay: 1.2,
      },
    },
    connectionPoints: [
      { cx: 142, cy: 427, r: 6.5 },
      { cx: 425.5, cy: 274, r: 6 },
    ],
  },
  {
    path: 'M493 274V333.226C493 338.749 497.477 343.226 503 343.226H760C765.523 343.226 770 347.703 770 353.226V427',
    gradientConfig: {
      initial: { x1: '40%', x2: '50%', y1: '160%', y2: '180%' },
      animate: { x1: '0%', x2: '10%', y1: '-40%', y2: '-20%' },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        repeatDelay: 2,
        delay: 1.6,
      },
    },
    connectionPoints: [
      { cx: 770, cy: 427, r: 6.5 },
      { cx: 493, cy: 274, r: 6 },
    ],
  },
  {
    path: 'M380 168V17C380 11.4772 384.477 7 390 7H414',
    gradientConfig: {
      initial: { x1: '-40%', x2: '-10%', y1: '0%', y2: '20%' },
      animate: {
        x1: ['40%', '0%', '0%'],
        x2: ['10%', '0%', '0%'],
        y1: ['0%', '0%', '180%'],
        y2: ['20%', '20%', '200%'],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        repeatDelay: 2,
        delay: 0.5,
      },
    },
    connectionPoints: [
      { cx: 420.5, cy: 6.5, r: 6 },
      { cx: 380, cy: 168, r: 6 },
    ],
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { data: phones, isLoading, isError, refetch } = useTopPhones();
  const [selectedPhone, setSelectedPhone] = useState<Phone | null>(null);
  const workflowCards = [
    {
      icon: <Search size={16} />,
      title: 'Buscar',
      description: 'Encontre modelos',
      date: 'Catálogo aberto',
      iconClassName: 'bg-rust-500 text-paper-50',
      titleClassName: 'text-rust-400',
      className: '[grid-area:stack] hover:-translate-y-8',
    },
    {
      icon: <Scale size={16} />,
      title: 'Comparar',
      description: 'Lado a lado',
      date: 'Especificações',
      iconClassName: 'bg-ink-900 text-paper-50',
      titleClassName: 'text-ink-100',
      className: '[grid-area:stack] translate-x-5 translate-y-10 hover:-translate-y-1 sm:translate-x-14',
    },
    {
      icon: <Bookmark size={16} />,
      title: 'Coleção',
      description: 'Salve escolhas',
      date: 'Favoritos',
      iconClassName: 'bg-sage-500 text-paper-50',
      titleClassName: 'text-sage-500',
      className: '[grid-area:stack] translate-x-10 translate-y-20 hover:translate-y-10 sm:translate-x-28',
    },
  ];

  useEffect(() => {
    const t = setInterval(refetch, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [refetch]);

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── Hero ────────────────────────────────────────── */}
      <section style={{
        borderBottom: '1px solid rgba(242,237,226,0.18)',
        padding: '5rem 1.5rem 4rem',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'clamp(520px, 72vh, 760px)',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--ink)',
      }}>
        <ShaderAnimation
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.78,
            pointerEvents: 'none',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(28, 17, 10, 0.58)',
          pointerEvents: 'none',
        }} />

        {/* decorative large number */}
        <div style={{
          position: 'absolute',
          right: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: 'clamp(8rem, 18vw, 18rem)',
          fontWeight: 300,
          color: 'rgba(242,237,226,0.12)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: '0',
        }}>
          01
        </div>

        <div className="page-container" style={{ width: '100%', maxWidth: '1280px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '680px' }}>
            <div className="section-label anim-slide-left" style={{ marginBottom: '1.5rem', color: 'var(--paper-3)' }}>
              Catálogo de Dispositivos Móveis
            </div>

            <h1 className="anim-slide-up" style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: 300,
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: 'var(--paper)',
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
              color: 'rgba(242,237,226,0.78)',
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
              <button
                className="btn-ghost"
                onClick={() => navigate('/comparar')}
                style={{
                  color: 'var(--paper)',
                  borderColor: 'rgba(242,237,226,0.42)',
                  background: 'rgba(242,237,226,0.06)',
                }}
              >
                Comparar agora
                <ArrowRight size={12} />
              </button>
            </div>
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

      <section style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--paper)',
        padding: '3rem 1.5rem 3.5rem',
      }}>
        <div
          className="page-container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            alignItems: 'center',
            gap: '2.5rem',
          }}
        >
          <div>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>
              Fluxo do acervo
            </div>
            <h2 style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: 300,
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              color: 'var(--ink)',
              lineHeight: 1.05,
              marginBottom: '1rem',
            }}>
              Da busca à decisão em poucos passos
            </h2>
            <p style={{
              fontFamily: '"EB Garamond", Georgia, serif',
              fontSize: '1.05rem',
              color: 'var(--ink-2)',
              lineHeight: 1.6,
              maxWidth: '440px',
              marginBottom: '1.5rem',
            }}>
              Organize modelos, abra fichas técnicas e guarde comparações sem sair do mesmo fluxo.
            </p>
            <button className="btn-ghost" onClick={() => navigate('/buscar')}>
              Explorar catálogo
              <ArrowRight size={11} />
            </button>
          </div>

          <DisplayCards cards={workflowCards} />
        </div>
      </section>

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

        {isLoading && (
          <div style={{ padding: '3rem 1.5rem' }}>
            <ProgressiveFluxLoader
              duration={8}
              loop={false}
              phases={[
                { at: 0,  label: "conectando ao acervo…" },
                { at: 30, label: "buscando dispositivos…" },
                { at: 65, label: "classificando modelos…" },
                { at: 90, label: "quase pronto…" },
              ]}
            />
          </div>
        )}
        {isError && (
          <ErrorMessage
            message="Não foi possível carregar o acervo. Verifique sua conexão."
            onRetry={refetch}
          />
        )}
        {phones && phones.length > 0 && (
          <SocialCards
            cards={phones.map(phone => ({
              imgUrl: phone.img,
              alt: phone.name,
              label: phone.name,
              onClick: () => setSelectedPhone(phone),
            }))}
          />
        )}
      </section>

      <PhoneDetailsModal
        phone={selectedPhone!}
        isOpen={!!selectedPhone}
        onClose={() => setSelectedPhone(null)}
      />

      {/* ── Bottom CTA ──────────────────────────────────── */}
      <section style={{
        borderTop: '3px double var(--border)',
        background: 'var(--ink)',
        color: 'var(--paper)',
        overflow: 'hidden',
      }}>
        <Suspense
          fallback={
            <div className="flex min-h-[28rem] items-center justify-center px-6 py-12">
              <ComparisonCtaContent onStart={() => navigate('/buscar')} />
            </div>
          }
        >
          <PulseBeams
            beams={comparisonPulseBeams}
            className="min-h-[28rem] px-6 py-12"
            baseColor="rgba(196,181,154,0.26)"
            accentColor="rgba(242,237,226,0.68)"
            gradientColors={{
              start: '#C1440E',
              middle: '#F0B89A',
              end: '#F2EDE2',
            }}
            background={
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(circle at center, rgba(193,68,14,0.24), transparent 36%), linear-gradient(180deg, rgba(28,17,10,0.92), rgba(28,17,10,1))',
                }}
              />
            }
          >
            <ComparisonCtaContent onStart={() => navigate('/buscar')} />
          </PulseBeams>
        </Suspense>
      </section>
    </div>
  );
}

interface ComparisonCtaContentProps {
  onStart: () => void;
}

function ComparisonCtaContent({ onStart }: ComparisonCtaContentProps) {
  return (
    <div style={{
      width: 'min(100%, 520px)',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div className="catalog-num" style={{ marginBottom: '0.75rem', color: 'rgba(242,237,226,0.62)' }}>
        Pronto para comparar?
      </div>
      <h2 style={{
        fontFamily: '"Cormorant Garamond", Georgia, serif',
        fontWeight: 300,
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        color: 'var(--paper)',
        lineHeight: 1.05,
        marginBottom: '1.5rem',
      }}>
        Selecione dois modelos e compare
      </h2>
      <button
        className="btn-primary"
        onClick={onStart}
        style={{
          position: 'relative',
          minWidth: 'min(100%, 19rem)',
          minHeight: '4.75rem',
          justifyContent: 'center',
          boxShadow: '0 18px 48px rgba(193,68,14,0.28)',
        }}
      >
        Iniciar comparação
        <ArrowRight size={13} />
      </button>
    </div>
  );
}
