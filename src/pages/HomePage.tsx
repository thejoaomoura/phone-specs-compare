import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useTopPhones } from '../hooks/useTopPhones';
import PhoneCarousel from '../components/PhoneCarousel';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: phones, isLoading, isError, error, refetch } = useTopPhones();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Compare os Melhores Celulares
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Encontre o smartphone ideal para você comparando especificações e preços
        </p>
        
        <button
          onClick={() => navigate('/buscar')}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Search className="h-5 w-5 mr-2" />
          Buscar Celulares
        </button>
      </div>
      
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Lançamentos em Destaque
        </h2>
        
        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <ErrorMessage 
            message="Erro ao carregar os celulares. Por favor, tente novamente."
            onRetry={refetch}
          />
        ) : phones ? (
          <PhoneCarousel phones={phones} autoplayInterval={5000} />
        ) : null}
      </section>
    </div>
  );
}