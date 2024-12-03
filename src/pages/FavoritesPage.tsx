import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PhoneCard from '../components/PhoneCard';
import { Phone, SavedComparison } from '../types';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<'phones' | 'comparisons'>('phones');
  const [favorites, setFavorites] = React.useState<Phone[]>([]);
  const [savedComparisons, setSavedComparisons] = React.useState<SavedComparison[]>([]);

  React.useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    const storedComparisons = localStorage.getItem('savedComparisons');
    
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
    if (storedComparisons) {
      setSavedComparisons(JSON.parse(storedComparisons));
    }
  }, []);

  const removeFavorite = (phone: Phone) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== phone.id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const removeComparison = (comparisonId: string) => {
    const updatedComparisons = savedComparisons.filter(comp => comp.id !== comparisonId);
    setSavedComparisons(updatedComparisons);
    localStorage.setItem('savedComparisons', JSON.stringify(updatedComparisons));
  };

  const openComparison = (phoneIds: string[]) => {
    navigate(`/comparar?phones=${phoneIds.join(',')}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-6 sm:mb-8 px-1">
        Meus Favoritos
      </h1>

      <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
        <button
          onClick={() => setActiveTab('phones')}
          className={`px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
            activeTab === 'phones'
              ? 'bg-cyber-800 text-neon-400'
              : 'text-cyber-300 hover:text-neon-400'
          }`}
        >
          Celulares
        </button>
        <button
          onClick={() => setActiveTab('comparisons')}
          className={`px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
            activeTab === 'comparisons'
              ? 'bg-cyber-800 text-neon-400'
              : 'text-cyber-300 hover:text-neon-400'
          }`}
        >
          Comparações Salvas
        </button>
      </div>

      <div className="min-h-[60vh]">
        {activeTab === 'phones' ? (
          favorites.length === 0 ? (
            <div className="text-center text-cyber-200 py-12">
              <p>Você ainda não tem nenhum celular favorito.</p>
              <p className="mt-2">Adicione celulares aos favoritos na página de busca!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {favorites.map((phone) => (
                <PhoneCard
                  key={phone.id}
                  phone={phone}
                  onSelect={() => removeFavorite(phone)}
                  isSelected={true}
                  isFavorite={true}
                />
              ))}
            </div>
          )
        ) : savedComparisons.length === 0 ? (
          <div className="text-center text-cyber-200 py-12">
            <p>Você ainda não salvou nenhuma comparação.</p>
            <p className="mt-2">Compare celulares e salve para visualizar depois!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {savedComparisons.map((comparison) => (
              <div
                key={comparison.id}
                className="bg-cyber-900/50 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-cyber-700/50 hover:border-neon-400 transition-all duration-300"
              >
                <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                  <span className="text-cyber-200 text-sm sm:text-base">
                    Salvo em: {new Date(comparison.date).toLocaleDateString('pt-BR')}
                  </span>
                  <button
                    onClick={() => removeComparison(comparison.id)}
                    className="text-cyber-400 hover:text-red-500 transition-colors text-sm sm:text-base"
                  >
                    Remover
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {comparison.phones.map((phone) => (
                    <div key={phone.name} className="bg-cyber-950/50 p-3 sm:p-4 rounded-lg">
                      <div className="aspect-square relative mb-2">
                        <img
                          src={phone.img}
                          alt={phone.name}
                          className="absolute inset-0 w-full h-full object-contain p-2"
                        />
                      </div>
                      <h3 className="text-cyber-100 text-center truncate text-sm sm:text-base">
                        {phone.name}
                      </h3>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => openComparison(comparison.phones.map(p => p.name))}
                  className="mt-4 w-full flex items-center justify-center space-x-2 py-2 px-4 bg-cyber-800 hover:bg-cyber-700 text-cyber-100 rounded-lg transition-colors text-sm sm:text-base"
                >
                  <span>Ver Comparação</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
