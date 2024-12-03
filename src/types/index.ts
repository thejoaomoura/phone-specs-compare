export interface Phone {
  id: string;
  name: string;
  img: string;
  description?: string;
  specs?: {
    [key: string]: string;
  };
  price?: number;
}

export interface Brand {
  id: string;
  name: string;
  devices: number;
}

export interface PhoneDetail {
  id: string;
  name: string;
  brand: string;
  img: string;
  priceRange: {
    min: number;
    max: number;
  };
  ratings: {
    overall: number;
    display: number;
    camera: number;
    performance: number;
    battery: number;
  };
  price?: number;
  specs?: {
    rating?: string;
    [key: string]: string | undefined;
  };
  quickSpec: Array<{
    name: string;
    value: string;
  }>;
  detailSpec: Array<{
    category: string;
    specifications: Array<{
      name: string;
      value: string;
    }>;
  }>;
}

export interface LocalPhone {
  id: string;
  marca: string;
  modelo: string;
  preco: number;
  lancamento: string;
  especificacoes: {
    tela: string;
    processador: string;
    ram: string;
    armazenamento: string;
    bateria: string;
    cameraPrincipal: string;
    cameraFrontal: string;
  };
  imagem: string;
}

export interface SavedComparison {
  id: string;
  phones: PhoneDetail[];
  date: string;
}

export interface ComparisonState {
  selectedPhones: string[];
  favorites: string[];
}