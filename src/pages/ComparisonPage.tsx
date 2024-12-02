import React, { useEffect, useState } from 'react';
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
  const [favorites, setFavorites] = useState<string[]>([]);
  
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteComparisons');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);
  
  const phoneQueries = phoneIds.map(id => usePhoneDetails(id));
  const isLoading = phoneQueries.some(query => query.isLoading);
  const errors = phoneQueries.filter(query => query.error).map(query => query.error);
  const phones = phoneQueries.map(query => query.data).filter(Boolean) as PhoneDetail[];
  
  const handleSaveComparison = () => {
    const newFavorites = [...favorites, phoneIds.join(',')];
    setFavorites(newFavorites);
    localStorage.setItem('favoriteComparisons', JSON.stringify(newFavorites));
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (errors.length > 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <button
            onClick={() => navigate('/buscar')}
            className="action-button"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar para busca
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <button onClick={() => navigate('/buscar')} className="action-button">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar para busca
        </button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="action-button"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Compartilhar
          </button>
          
          <button
            onClick={handleSaveComparison}
            className="action-button"
          >
            <Bookmark className="h-5 w-5 mr-2" />
            Salvar Comparação
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {phones.map((phone) => (
          <div key={phone.name} className="phone-card">
            <img
              src={phone.img}
              alt={phone.name}
              className="phone-image"
            />
            <h3 className="text-xl font-semibold text-center">{phone.name}</h3>
          </div>
        ))}
      </div>
      
      <div className="space-y-6">
        {phones[0]?.detailSpec.map((category, index) => (
          <div key={category.category} className="spec-category">
            <div className="spec-category-header">
              <h4>{translateCategory(category.category)}</h4>
            </div>
            
            <div>
              {category.specifications.map((spec, specIndex) => (
                <div key={spec.name} className="spec-row">
                  <div className="spec-label">
                    {translateSpec(spec.name)}
                  </div>
                  {phones.map((phone) => (
                    <div key={`${phone.name}-${spec.name}`} className="spec-value">
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