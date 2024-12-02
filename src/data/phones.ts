import { LocalPhone } from '../types';

export const phones: LocalPhone[] = [
  {
    id: "1",
    marca: "Samsung",
    modelo: "Galaxy S24 Ultra",
    preco: 9999.00,
    lancamento: "2024",
    especificacoes: {
      tela: "6.8\" Dynamic AMOLED 2X",
      processador: "Snapdragon 8 Gen 3",
      ram: "12GB",
      armazenamento: "256GB",
      bateria: "5000mAh",
      cameraPrincipal: "200MP + 12MP + 50MP + 10MP",
      cameraFrontal: "12MP",
    },
    imagem: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=500"
  },
  {
    id: "2",
    marca: "Apple",
    modelo: "iPhone 15 Pro Max",
    preco: 9799.00,
    lancamento: "2023",
    especificacoes: {
      tela: "6.7\" Super Retina XDR OLED",
      processador: "A17 Pro",
      ram: "8GB",
      armazenamento: "256GB",
      bateria: "4422mAh",
      cameraPrincipal: "48MP + 12MP + 12MP",
      cameraFrontal: "12MP",
    },
    imagem: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=500"
  },
  {
    id: "3",
    marca: "Motorola",
    modelo: "Edge 40 Pro",
    preco: 4999.00,
    lancamento: "2023",
    especificacoes: {
      tela: "6.67\" OLED",
      processador: "Snapdragon 8 Gen 2",
      ram: "12GB",
      armazenamento: "256GB",
      bateria: "4600mAh",
      cameraPrincipal: "50MP + 50MP + 12MP",
      cameraFrontal: "60MP",
    },
    imagem: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=500"
  },
];