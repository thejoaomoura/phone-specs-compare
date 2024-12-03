import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Phone } from '../types';
import PhoneCard from './PhoneCard';
import PhoneDetailsModal from './PhoneDetailsModal';

interface PhoneCarouselProps {
  phones: Phone[];
  autoplayInterval?: number;
}

export default function PhoneCarousel({ phones, autoplayInterval = 5000 }: PhoneCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhone, setSelectedPhone] = useState<Phone | null>(null);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(phones.length / itemsPerPage);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % totalPages);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [totalPages, autoplayInterval]);

  const handlePrevious = () => {
    setCurrentIndex((current) => (current - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    setCurrentIndex((current) => (current + 1) % totalPages);
  };

  const handlePhoneClick = (phone: Phone) => {
    setSelectedPhone(phone);
  };

  return (
    <div className="relative w-full">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${Math.ceil(phones.length / itemsPerPage) * 100}%`
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {phones.map((phone) => (
              <div 
                key={phone.id} 
                onClick={() => handlePhoneClick(phone)} 
                className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
              >
                <PhoneCard phone={phone} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute -left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cyber-900/80 backdrop-blur-sm border border-cyber-700/50 shadow-lg hover:bg-cyber-800 transition-all z-10 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6 text-cyber-100" />
          </button>

          <button
            onClick={handleNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cyber-900/80 backdrop-blur-sm border border-cyber-700/50 shadow-lg hover:bg-cyber-800 transition-all z-10 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6 text-cyber-100" />
          </button>
        </>
      )}

      <PhoneDetailsModal
        phone={selectedPhone!}
        isOpen={!!selectedPhone}
        onClose={() => setSelectedPhone(null)}
      />
    </div>
  );
}