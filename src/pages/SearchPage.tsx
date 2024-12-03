import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter } from 'lucide-react';
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

  const handlePhoneSelect = (phone: Phone) => {
    setSelectedPhones(prev => {
      const newSelection = prev.includes(phone.id)
        ? prev.filter(id => id !== phone.id)
        : [...prev, phone.id];
      return newSelection;
    });
  };

  const handleCompare = () => {
    if (selectedPhones.length >= 2) {
      navigate(`/comparar?phones=${selectedPhones.join(',')}`);
    }
  };

  const filteredPhones = phones?.filter(phone => 
    !selectedBrand || phone.name.toLowerCase().includes(selectedBrand.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Buscar Celulares
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative group">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-cyan-400 transition-colors h-5 w-5" />
              <input
                type="text"
                placeholder="Digite o nome do celular..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                         text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200
                         hover:bg-gray-800/70"
              />
            </div>
          </div>

          <div className="relative min-w-[200px]">
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-cyan-400 transition-colors h-5 w-5" />
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full appearance-none pl-12 pr-10 py-3 bg-gray-800/50 border border-gray-700/50 
                         rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 
                         focus:border-transparent transition-all duration-200 hover:bg-gray-800/70 cursor-pointer"
              >
                <option value="">Todas as marcas</option>
                {brands?.map((brand) => (
                  <option key={brand.id} value={brand.name}>
                    {brand.name} ({brand.devices} dispositivos)
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {isError && (
          <div className="py-8">
            <ErrorMessage message="Erro ao carregar os celulares. Tente novamente mais tarde." />
          </div>
        )}

        {!isLoading && !isError && filteredPhones && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {filteredPhones.map((phone) => (
              <PhoneCard
                key={phone.id}
                phone={phone}
                isSelected={selectedPhones.includes(phone.id)}
                onSelect={handlePhoneSelect}
              />
            ))}
          </div>
        )}

        {selectedPhones.length >= 2 && (
          <div className="fixed bottom-4 right-4 z-10">
            <button
              onClick={handleCompare}
              className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl 
              shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700 
              transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Comparar ({selectedPhones.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}