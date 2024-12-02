// Mapeamento de categorias
export const categoryTranslations: Record<string, string> = {
  'Network': 'Rede',
  'Launch': 'Lançamento',
  'Body': 'Design',
  'Display': 'Tela',
  'Platform': 'Plataforma',
  'Memory': 'Memória',
  'Main Camera': 'Câmera Principal',
  'Selfie camera': 'Câmera Frontal',
  'Sound': 'Som',
  'Comms': 'Conectividade',
  'Features': 'Recursos',
  'Battery': 'Bateria',
  'Misc': 'Diversos',
  'Tests': 'Testes',
};

// Mapeamento de especificações
export const specTranslations: Record<string, string> = {
  // Network
  'Technology': 'Tecnologia',
  'Speed': 'Velocidade',
  '2G bands': 'Bandas 2G',
  '3G bands': 'Bandas 3G',
  '4G bands': 'Bandas 4G',
  '5G bands': 'Bandas 5G',
  
  // Body
  'Dimensions': 'Dimensões',
  'Weight': 'Peso',
  'Build': 'Construção',
  'SIM': 'Chip SIM',
  
  // Display
  'Type': 'Tipo',
  'Size': 'Tamanho',
  'Resolution': 'Resolução',
  'Protection': 'Proteção',
  
  // Platform
  'OS': 'Sistema Operacional',
  'Chipset': 'Processador',
  'CPU': 'CPU',
  'GPU': 'GPU',
  
  // Memory
  'Card slot': 'Slot para Cartão',
  'Internal': 'Armazenamento Interno',
  'RAM': 'Memória RAM',
  
  // Camera
  'Quad': 'Quádrupla',
  'Triple': 'Tripla',
  'Dual': 'Dupla',
  'Single': 'Única',
  'Features': 'Recursos',
  'Video': 'Vídeo',
  
  // Sound
  'Loudspeaker': 'Alto-falante',
  '3.5mm jack': 'Entrada P2',
  
  // Comms
  'WLAN': 'Wi-Fi',
  'Bluetooth': 'Bluetooth',
  'GPS': 'GPS',
  'NFC': 'NFC',
  'Radio': 'Rádio',
  'USB': 'USB',
  
  // Features
  'Sensors': 'Sensores',
  
  // Battery
  'Battery type': 'Tipo de Bateria',
  'Charging': 'Carregamento',
  
  // Tests
  'Performance': 'Desempenho',
  'Camera': 'Câmera',
  'Loudspeaker test': 'Teste de Alto-falante',
  'Battery life': 'Duração da Bateria',
};

export const translateCategory = (category: string): string => {
  return categoryTranslations[category] || category;
};

export const translateSpec = (spec: string): string => {
  return specTranslations[spec] || spec;
};
