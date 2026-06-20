import { Link, useLocation } from 'react-router-dom';
import { Search, BarChart2, Bookmark, Archive } from 'lucide-react';

const navItems = [
  { path: '/',         label: 'Início',    icon: Archive },
  { path: '/buscar',   label: 'Catálogo',  icon: Search },
  { path: '/comparar', label: 'Comparar',  icon: BarChart2 },
  { path: '/favoritos',label: 'Coleção',   icon: Bookmark },
];

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header style={{
      background: 'var(--paper)',
      borderBottom: '2px solid var(--ink)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      {/* top strip */}
      <div style={{
        background: 'var(--ink)',
        color: 'var(--paper)',
        fontFamily: '"Space Mono", monospace',
        fontSize: '0.6rem',
        letterSpacing: '0.15em',
        textAlign: 'center',
        padding: '0.25rem 0',
        textTransform: 'uppercase',
      }}>
        Arquivo Técnico de Dispositivos Móveis — Coleção Aberta
      </div>

      <nav className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
          <span style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '1.6rem',
            color: 'var(--ink)',
            lineHeight: 1,
          }}>
            Comparetech
          </span>
          <span style={{
            fontFamily: '"Space Mono", monospace',
            fontSize: '0.55rem',
            color: 'var(--ink-3)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            est. 2024
          </span>
        </Link>

        {/* Nav */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = pathname === path || (path !== '/' && pathname.startsWith(path));
            return (
              <Link
                key={path}
                to={path}
                className={`nav-link${active ? ' active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Icon size={12} strokeWidth={1.5} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
