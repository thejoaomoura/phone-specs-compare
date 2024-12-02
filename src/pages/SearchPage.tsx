import React, { useState } from 'react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
          Buscar Celulares
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative group">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors h-5 w-5" />
              <input
                type="text"
                placeholder="Digite o nome do celular..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 
                transition-all duration-300 shadow-sm hover:shadow-md outline-none"
              />
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <div className="relative group">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors h-5 w-5" />
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm 
                focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-purple-300 
                transition-all duration-300 shadow-sm hover:shadow-md outline-none appearance-none cursor-pointer"
              >
                <option value="">Todas as marcas</option>
                {brands?.map((brand) => (
                  <option key={brand.id} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {selectedPhones.length >= 2 && (
        <div className="fixed bottom-4 right-4 z-10">
          <button
            onClick={handleCompare}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl 
            shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700 
            transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Comparar ({selectedPhones.length})
          </button>
        </div>
      )}
      
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorMessage message="Erro ao buscar celulares. Por favor, tente novamente." />
      ) : filteredPhones?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Nenhum celular encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhones?.map((phone) => (
            <PhoneCard
              key={phone.id}
              phone={phone}
              isSelected={selectedPhones.includes(phone.id)}
              onSelect={handlePhoneSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}