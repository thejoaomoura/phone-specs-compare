//import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { usePhoneDetails } from '../hooks/usePhoneDetails';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { PhoneDetail } from '../types';
import { translateCategory, translateSpec } from '../utils/translations';

export default function ComparisonPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const phoneIds = searchParams.get('phones')?.split(',') || [];
  
  const phoneQueries = phoneIds.map(id => usePhoneDetails(id));
  const isLoading = phoneQueries.some(query => query.isLoading);
  const errors = phoneQueries.filter(query => query.error).map(query => query.error);
  const phones = phoneQueries.map(query => query.data).filter(Boolean) as PhoneDetail[];

  const handleSaveComparison = () => {
    const newComparison = {
      id: Date.now().toString(),
      phones,
      date: new Date().toISOString()
    };

    const savedComparisons = JSON.parse(localStorage.getItem('savedComparisons') || '[]');
    const updatedComparisons = [newComparison, ...savedComparisons];
    localStorage.setItem('savedComparisons', JSON.stringify(updatedComparisons));

    alert('Comparação salva com sucesso!');
  };
  
  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Comparação de Celulares',
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (phoneIds.length < 2) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="error-container">
          <ErrorMessage
            message="Selecione pelo menos 2 celulares para comparar."
            onRetry={() => navigate('/buscar')}
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (errors.length > 0) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="error-container space-y-4">
          <ErrorMessage
            message="Não foi possível carregar os detalhes de alguns celulares."
            onRetry={() => phoneQueries.forEach(query => query.refetch())}
          />
          <div className="bg-red-900/30 p-4 rounded-lg border border-red-500/30">
            <h3 className="text-sm font-medium text-red-200">Detalhes dos erros:</h3>
            <ul className="mt-2 text-sm text-red-100 list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error instanceof Error ? error.message : 'Erro desconhecido'}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button
          onClick={() => navigate('/buscar')}
          className="inline-flex items-center px-3 sm:px-4 py-2 text-sm sm:text-base bg-cyber-800 text-cyber-100 rounded-lg hover:bg-cyber-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Voltar para busca
        </button>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleShare}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 text-sm sm:text-base bg-cyber-800 text-cyber-100 rounded-lg hover:bg-cyber-700 transition-colors"
          >
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Compartilhar
          </button>
          
          <button
            onClick={handleSaveComparison}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 text-sm sm:text-base bg-cyber-800 text-cyber-100 rounded-lg hover:bg-cyber-700 transition-colors"
          >
            <Bookmark className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Salvar
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {phones.map((phone) => (
          <div
            key={phone.name}
            className="bg-cyber-900/50 backdrop-blur-sm rounded-xl p-4 border border-cyber-700/50"
          >
            <div className="aspect-square relative mb-4">
              <img
                src={phone.img}
                alt={phone.name}
                className="absolute inset-0 w-full h-full object-contain p-4"
              />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-center text-cyber-100">{phone.name}</h3>
          </div>
        ))}
      </div>
      
      <div className="space-y-4 sm:space-y-6 overflow-x-auto">
        {phones[0]?.detailSpec.map((category, index) => (
          <div
            key={category.category}
            className="bg-cyber-900/50 backdrop-blur-sm rounded-xl border border-cyber-700/50 overflow-hidden"
          >
            <div className="bg-cyber-800 p-3 sm:p-4">
              <h4 className="text-sm sm:text-base font-medium text-cyber-100">
                {translateCategory(category.category)}
              </h4>
            </div>
            
            <div className="divide-y divide-cyber-700/30">
              {category.specifications.map((spec, specIndex) => (
                <div
                  key={spec.name}
                  className="grid grid-cols-[1fr,repeat(auto-fit,minmax(120px,1fr))] gap-2 p-3 sm:p-4 text-sm sm:text-base"
                >
                  <div className="text-cyber-300 font-medium">
                    {translateSpec(spec.name)}
                  </div>
                  {phones.map((phone) => (
                    <div
                      key={`${phone.name}-${spec.name}`}
                      className="text-cyber-100 text-right sm:text-center"
                    >
                      {phone.detailSpec[index]?.specifications[specIndex]?.value || '-'}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}