import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Smartphone, Search, BarChart2, Bookmark } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-cyber-gradient shadow-cyber">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <Smartphone className="h-8 w-8 text-neon-400" />
                <div className="absolute inset-0 animate-pulse bg-neon-400 opacity-20 rounded-full"></div>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-cyber-300 to-neon-400 text-transparent bg-clip-text">
                Comparetech
              </span>
            </Link>
          </div>
          
          <div className="flex space-x-8">
            {[
              { path: '/', icon: Smartphone, label: 'Início' },
              { path: '/buscar', icon: Search, label: 'Buscar' },
              { path: '/comparar', icon: BarChart2, label: 'Comparar' },
              { path: '/favoritos', icon: Bookmark, label: 'Favoritos' },
            ].map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 transition-all duration-300 ${
                  isActive(path)
                    ? 'text-neon-400 shadow-neon'
                    : 'text-cyber-100 hover:text-neon-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}