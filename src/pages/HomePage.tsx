import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useTopPhones } from '../hooks/useTopPhones';
import PhoneCarousel from '../components/PhoneCarousel';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: phones, isLoading, isError, error, refetch } = useTopPhones();

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 60000);

    return () => clearInterval(interval);
  }, [refetch]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
          Compare os Melhores Celulares
        </h1>
        <p className="text-lg sm:text-xl text-cyber-200 mb-6 sm:mb-8 px-4">
          Encontre o smartphone ideal para você comparando especificações e preços
        </p>
        
        <button
          onClick={() => navigate('/buscar')}
          className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
        >
          <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Buscar Celulares
        </button>
      </div>
      
      <section className="px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
          Lançamentos em Destaque
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : isError ? (
          <div className="max-w-lg mx-auto">
            <ErrorMessage 
              message="Erro ao carregar os celulares. Por favor, tente novamente."
              onRetry={refetch}
            />
          </div>
        ) : phones ? (
          <PhoneCarousel phones={phones} autoplayInterval={5000} />
        ) : null}
      </section>
    </div>
  );
}