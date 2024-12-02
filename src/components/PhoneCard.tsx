import React from 'react';
import { Phone } from '../types';
import { Plus, Check } from 'lucide-react';

interface PhoneCardProps {
  phone: Phone;
  isSelected?: boolean;
  onSelect?: (phone: Phone) => void;
}

export default function PhoneCard({ phone, isSelected, onSelect }: PhoneCardProps) {
  return (
    <div className="bg-cyber-900/50 backdrop-blur-lg rounded-xl overflow-hidden border border-cyber-700/50 hover:border-neon-400 transition-all duration-300 group">
      <div className="relative">
        <img
          src={phone.img}
          alt={phone.name}
          className="w-full h-48 object-contain bg-cyber-950/50 p-4 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-cyber-50 group-hover:text-neon-400 transition-colors">
          {phone.name}
        </h3>
        {phone.description && (
          <p className="text-cyber-200 mt-1 text-sm">{phone.description}</p>
        )}
        
        {onSelect && (
          <button
            onClick={() => onSelect(phone)}
            className={`mt-4 w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 ${
              isSelected
                ? 'bg-neon-500 text-cyber-950 shadow-neon'
                : 'bg-cyber-700 text-cyber-50 hover:bg-cyber-600'
            }`}
          >
            {isSelected ? (
              <>
                <Check className="h-5 w-5" />
                <span>Selecionado</span>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                <span>Comparar</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}