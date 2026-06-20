import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { useBrands } from '../hooks/useBrands';
import PhoneCard from '../components/PhoneCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Phone } from '../types';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedPhones, setSelectedPhones] = useState<string[]>([]);

  const { data: phones, isLoading, isError } = useSearch(searchTerm);
  const { data: brands } = useBrands();

  const handleSelect = (phone: Phone) => {
    setSelectedPhones(prev =>
      prev.includes(phone.id) ? prev.filter(id => id !== phone.id) : [...prev, phone.id]
    );
  };

  const handleCompare = () => {
    if (selectedPhones.length >= 2) {
      navigate(`/comparar?phones=${selectedPhones.join(',')}`);
    }
  };

  const filtered = phones?.filter(phone =>
    !selectedBrand || phone.name.toLowerCase().includes(selectedBrand.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── Page header ──────────────────────────────── */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '2.5rem 1.5rem 2rem',
        background: 'var(--paper-2)',
      }}>
        <div className="page-container">
          <div className="section-label" style={{ marginBottom: '0.5rem' }}>
            Busca no acervo
          </div>
          <h1 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontWeight: 300,
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            color: 'var(--ink)',
            margin: 0,
            lineHeight: 1.1,
          }}>
            Localizar dispositivos
          </h1>
        </div>
      </div>

      {/* ── Search controls ───────────────────────────── */}
      <div style={{
        borderBottom: '2px solid var(--ink)',
        background: 'var(--paper)',
        position: 'sticky',
        top: '88px',
        zIndex: 30,
      }}>
        <div className="page-container" style={{ display: 'flex', gap: 0, padding: '0 1.5rem' }}>
          {/* Search input */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', borderRight: '1px solid var(--border)' }}>
            <SearchIcon size={14} style={{ color: 'var(--ink-3)', flexShrink: 0, marginLeft: '0.75rem' }} />
            <input
              type="text"
              placeholder="Ex: Samsung Galaxy S25, iPhone 17…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="field-input"
              style={{ borderBottom: 'none', borderLeft: '1px solid transparent', paddingLeft: '0.75rem' }}
            />
          </div>

          {/* Brand filter */}
          <div style={{ position: 'relative', minWidth: '220px', display: 'flex', alignItems: 'center' }}>
            <SlidersHorizontal size={13} style={{ color: 'var(--ink-3)', position: 'absolute', left: '0.75rem', zIndex: 1 }} />
            <select
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="field-select"
              style={{ borderBottom: 'none', paddingLeft: '2.5rem' }}
            >
              <option value="">Todas as marcas</option>
              {brands?.map(b => (
                <option key={b.id} value={b.name}>{b.name} ({b.devices})</option>
              ))}
            </select>
            <div style={{ position: 'absolute', right: '0.75rem', pointerEvents: 'none', color: 'var(--ink-3)' }}>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ───────────────────────────────────── */}
      <div className="page-container" style={{ padding: '2rem 1.5rem' }}>
        {/* Status line */}
        <div style={{
          fontFamily: '"Space Mono", monospace',
          fontSize: '0.65rem',
          color: 'var(--ink-3)',
          letterSpacing: '0.08em',
          marginBottom: '1.5rem',
          minHeight: '1rem',
        }}>
          {isLoading && 'Consultando acervo…'}
          {!isLoading && filtered && (
            <>
              {filtered.length === 0
                ? 'Nenhum dispositivo encontrado'
                : `${filtered.length} dispositivo${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`
              }
              {searchTerm && ` — busca por "${searchTerm}"`}
            </>
          )}
          {!isLoading && !filtered && !isError && 'Digite para buscar no catálogo'}
        </div>

        {isLoading && <LoadingSpinner />}
        {isError && (
          <ErrorMessage message="Erro ao consultar o acervo. Tente novamente." />
        )}

        {!isLoading && !isError && filtered && filtered.length > 0 && (
          <div className="stagger" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1px',
            background: 'var(--border)',
            border: '1px solid var(--border)',
          }}>
            {filtered.map((phone, i) => (
              <PhoneCard
                key={phone.id}
                phone={phone}
                index={i}
                isSelected={selectedPhones.includes(phone.id)}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}

        {!isLoading && !isError && filtered && filtered.length === 0 && searchTerm && (
          <div style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            border: '1px dashed var(--border)',
            background: 'var(--paper-2)',
          }}>
            <div style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '3rem',
              color: 'var(--border)',
              marginBottom: '0.5rem',
              fontStyle: 'italic',
              fontWeight: 300,
            }}>
              Não encontrado
            </div>
            <p style={{
              fontFamily: '"EB Garamond", Georgia, serif',
              color: 'var(--ink-3)',
              fontSize: '1rem',
            }}>
              Nenhum dispositivo corresponde à busca <em>"{searchTerm}"</em>.
            </p>
          </div>
        )}
      </div>

      {/* ── Compare bar ───────────────────────────────── */}
      {selectedPhones.length >= 1 && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--ink)',
          color: 'var(--paper)',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '2px solid var(--rust)',
          zIndex: 40,
        }}>
          <span style={{
            fontFamily: '"Space Mono", monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.08em',
          }}>
            {selectedPhones.length} selecionado{selectedPhones.length !== 1 ? 's' : ''} — {selectedPhones.length < 2 ? 'selecione mais 1 para comparar' : 'pronto para comparar'}
          </span>
          <button
            className="btn-primary"
            onClick={handleCompare}
            disabled={selectedPhones.length < 2}
            style={{
              opacity: selectedPhones.length < 2 ? 0.5 : 1,
              cursor: selectedPhones.length < 2 ? 'not-allowed' : 'pointer',
            }}
          >
            Comparar selecionados
          </button>
        </div>
      )}
    </div>
  );
}
