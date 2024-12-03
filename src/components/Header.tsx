//import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Smartphone, Search, BarChart2, Bookmark } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/30 sticky top-0 z-50 backdrop-blur-sm bg-opacity-80">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative p-2">
                <Smartphone className="h-6 w-6 text-cyan-400 transform transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 animate-pulse bg-cyan-400/20 rounded-full"></div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text transform transition-all group-hover:scale-105">
                Comparetech
              </span>
            </Link>
          </div>
          
          <div className="flex space-x-6">
            {[
              { path: '/', icon: Smartphone, label: 'Início' },
              { path: '/buscar', icon: Search, label: 'Buscar' },
              { path: '/comparar', icon: BarChart2, label: 'Comparar' },
              { path: '/favoritos', icon: Bookmark, label: 'Favoritos' },
            ].map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-all duration-200 ${
                  isActive(path)
                    ? 'text-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-500/20'
                    : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium text-sm">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}