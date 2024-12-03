import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { usePhoneDetails } from '../hooks/usePhoneDetails';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { PhoneDetail } from '../types';
import { translateCategory, translateSpec } from '../utils/translations';
import { fetchPhonePrice } from '../services/priceService';
import { useEffect, useState } from 'react';

export default function ComparisonPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const phoneIds = searchParams.get('phones')?.split(',') || [];
  const [phonePrices, setPhonePrices] = useState<Record<string, { price: string; link: string | null }>>({});
  
  const phoneQueries = phoneIds.map(id => usePhoneDetails(id));
  const isLoading = phoneQueries.some(query => query.isLoading);
  const errors = phoneQueries.filter(query => query.error).map(query => query.error);
  const phones = phoneQueries
    .map(query => query.data)
    .filter((phone): phone is PhoneDetail => Boolean(phone));

  useEffect(() => {
    const fetchPrices = async () => {
      const pricePromises = phones.map(async (phone) => {
        const priceInfo = await fetchPhonePrice(phone.name);
        return { id: phone.name, ...priceInfo };
      });

      const prices = await Promise.all(pricePromises);
      const priceMap = prices.reduce((acc, { id, price, link }) => {
        if (price) {
          acc[id] = { price, link };
        }
        return acc;
      }, {} as Record<string, { price: string; link: string | null }>);

      setPhonePrices(priceMap);
    };

    if (phones.length > 0) {
      fetchPrices();
    }
  }, [phones]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate('/buscar')}
          className="inline-flex items-center px-4 py-2 bg-gray-800/80 text-gray-100 rounded-xl 
                   hover:bg-gray-700/80 transition-all duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar para busca
        </button>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center px-4 py-2 bg-gray-800/80 text-gray-100 rounded-xl 
                     hover:bg-gray-700/80 transition-all duration-200"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Compartilhar
          </button>
          
          <button
            onClick={handleSaveComparison}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 
                     text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
          >
            <Bookmark className="h-5 w-5 mr-2" />
            Salvar
          </button>
        </div>
      </div>

      {/* Size Comparison Notice */}
      <div className="flex items-center justify-center gap-4 mb-8 text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-6 h-12 border-2 border-gray-700 rounded"></div>
          <div className="w-6 h-10 border-2 border-gray-700 rounded"></div>
        </div>
        <span className="text-sm">Comparação em Tamanho Real</span>
      </div>
      
      {/* Phone Cards */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        {phones.map((phone) => (
          <div key={phone.name} className="flex flex-col items-center">
            <div className="relative w-64 h-80 mb-4">
              <img
                src={phone.img}
                alt={phone.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gray-100">
                {phone.name}
              </h3>
              <div className="text-2xl font-bold text-cyan-400">
                {phonePrices[phone.name]?.price 
                  ? `R$ ${Number(phonePrices[phone.name].price).toLocaleString('pt-BR', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}` 
                  : 'Preço indisponível'}
              </div>
              {phonePrices[phone.name]?.link ? (
                <a 
                  href={phonePrices[phone.name].link!} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-cyan-400 hover:underline"
                >
                  Ver Todos
                </a>
              ) : (
                <span className="text-sm text-gray-400">Link indisponível</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Sections */}
      <div className="space-y-6">
        {phones[0]?.detailSpec.map((category, index) => (
          <div key={category.category}>
            {/* Category Header */}
            <div className="bg-blue-500 text-white px-4 py-2 text-lg font-medium rounded-t-lg">
              {translateCategory(category.category)}
            </div>
            
            {/* Specifications */}
            <div className="divide-y divide-gray-700/30">
              {category.specifications.map((spec, specIndex) => {
                const values = phones.map(
                  phone => phone.detailSpec[index]?.specifications[specIndex]?.value || '-'
                );
                const hasDifferences = new Set(values).size > 1;

                return (
                  <div
                    key={spec.name}
                    className={`grid grid-cols-[2fr,repeat(${phones.length},1fr)] 
                             ${hasDifferences ? 'bg-gray-800/30' : 'bg-gray-900/30'}`}
                  >
                    <div className="p-4 font-medium text-gray-300">
                      {translateSpec(spec.name)}
                    </div>
                    {phones.map((phone, phoneIndex) => (
                      <div
                        key={`${phone.name}-${spec.name}`}
                        className={`p-4 text-center ${
                          values[phoneIndex] === 'Sim' 
                            ? 'text-green-500' 
                            : values[phoneIndex] === 'Não'
                            ? 'text-red-500'
                            : hasDifferences && values[phoneIndex] !== '-'
                            ? 'text-cyan-400 font-medium'
                            : 'text-gray-400'
                        }`}
                      >
                        {values[phoneIndex] === 'Sim' ? '✓' : values[phoneIndex]}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Scores Section */}
            {category.category === 'Notas' && (
              <div className="grid grid-cols-[2fr,repeat(2,1fr)] gap-2 bg-gray-900/30 p-4">
                {phones.map((phone) => (
                  <div key={`score-${phone.name}`} className="col-start-2 text-center">
                    <div className="text-2xl font-bold text-cyan-400">
                      {(phone.specs?.rating || '8.5')}<span className="text-sm text-gray-400">/10</span>
                    </div>
                    <div className="text-sm text-gray-400">Pontuação Final</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}