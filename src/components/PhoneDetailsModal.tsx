//import React from 'react';
import { X } from 'lucide-react';
import { Phone } from '../types';

interface PhoneDetailsModalProps {
  phone: Phone;
  isOpen: boolean;
  onClose: () => void;
}

export default function PhoneDetailsModal({ phone, isOpen, onClose }: PhoneDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-cyber-950 opacity-75"></div>
        </div>

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-cyber-900 rounded-2xl border border-cyber-700 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              {phone.name}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-cyber-800 transition-colors"
            >
              <X className="h-6 w-6 text-cyber-200" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex justify-center items-center bg-cyber-950/50 rounded-xl p-4">
              <img
                src={phone.img}
                alt={phone.name}
                className="max-h-80 object-contain"
              />
            </div>

            <div className="space-y-4">
              {phone.description && (
                <div>
                  <h4 className="text-lg font-semibold text-neon-400 mb-2">Descrição</h4>
                  <p className="text-cyber-200">{phone.description}</p>
                </div>
              )}

              <div>
                <h4 className="text-lg font-semibold text-neon-400 mb-2">Especificações</h4>
                <div className="space-y-2">
                  {phone.specs && Object.entries(phone.specs).map(([key, value]: [string, string]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-cyber-700/50">
                      <span className="text-cyber-300">{key}</span>
                      <span className="text-cyber-100">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {phone.price && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-neon-400 mb-2">Preço</h4>
                  <p className="text-2xl font-bold text-cyber-100">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(Number(phone.price))}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
