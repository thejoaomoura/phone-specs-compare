import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Phone } from '../types';
import PhoneCard from './PhoneCard';

interface PhoneCarouselProps {
  phones: Phone[];
  autoplayInterval?: number;
}

export default function PhoneCarousel({ phones, autoplayInterval = 5000 }: PhoneCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
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

  const visiblePhones = phones.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visiblePhones.map((phone) => (
            <PhoneCard key={phone.id} phone={phone} />
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </>
      )}

      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}