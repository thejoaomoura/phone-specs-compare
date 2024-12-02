import axios from 'axios';
import cheerio from 'cheerio';
import { phones } from '../data/phones';
import { Phone, PhoneDetail, LocalPhone } from '../types';

const BASE_URL = '/gsmarena';

const getDataFromUrl = async (url: string) => {
  try {
    const response = await axios.get(`${BASE_URL}${url}`, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

interface FetchPhonesParams {
  search?: string;
  brand?: string;
  limit?: number;
  page?: number;
}

export const fetchPhones = async (params?: FetchPhonesParams) => {
  let filteredPhones = [...phones];
  
  if (params?.search) {
    filteredPhones = filteredPhones.filter(phone => 
      phone.modelo.toLowerCase().includes(params.search!.toLowerCase()) ||
      phone.marca.toLowerCase().includes(params.search!.toLowerCase())
    );
  }
  
  if (params?.brand) {
    filteredPhones = filteredPhones.filter(phone => 
      phone.marca.toLowerCase() === params.brand!.toLowerCase()
    );
  }
  
  if (params?.limit) {
    filteredPhones = filteredPhones.slice(0, params.limit);
  }
  
  return filteredPhones.map(phone => ({
    id: phone.id,
    name: `${phone.marca} ${phone.modelo}`,
    img: phone.imagem,
    description: `${phone.especificacoes.processador} • ${phone.especificacoes.ram} RAM`,
  })) as Phone[];
};

export const fetchTopPhones = async () => {
  // For now, we'll return all phones sorted by launch date (newest first)
  const sortedPhones = [...phones].sort((a, b) => {
    return parseInt(b.lancamento) - parseInt(a.lancamento);
  });
  
  return sortedPhones.map(phone => ({
    id: phone.id,
    name: `${phone.marca} ${phone.modelo}`,
    img: phone.imagem,
    description: `${phone.especificacoes.processador} • ${phone.especificacoes.ram} RAM`,
  })) as Phone[];
};

export const searchPhones = async (searchValue: string) => {
  if (!searchValue) return [];
  
  try {
    console.log('Searching phones with query:', searchValue);
    const data = await getDataFromUrl(`/results.php3?sQuickSearch=yes&sName=${encodeURIComponent(searchValue)}`);
    
    if (!data) {
      console.warn('No data received from API');
      return fetchPhones({ search: searchValue });
    }

    const $ = cheerio.load(data);
    const phones: Phone[] = [];
    
    $('.makers ul li').each((_, element) => {
      try {
        const $element = $(element);
        const $link = $element.find('a');
        const $img = $element.find('img');
        
        const href = $link.attr('href');
        const id = href?.split('.php')[0] || '';
        const name = $link.text().trim();
        const img = $img.attr('src') || '';
        const description = $element.find('.phones-item-description').text().trim();
        
        if (id && name) {
          const imgUrl = img.startsWith('http') ? img : `${BASE_URL}${img}`;
          console.log('Found phone:', { id, name, imgUrl });
          phones.push({ id, name, img: imgUrl, description });
        }
      } catch (parseError) {
        console.error('Error parsing phone element:', parseError);
      }
    });
    
    if (phones.length === 0) {
      console.warn('No phones found in API response, falling back to local search');
      return fetchPhones({ search: searchValue });
    }
    
    return phones;
  } catch (error) {
    console.error('Error searching phones:', error);
    console.log('Falling back to local search');
    return fetchPhones({ search: searchValue });
  }
};

export const getBrands = async () => {
  const uniqueBrands = [...new Set(phones.map(phone => phone.marca))];
  return uniqueBrands.map((brand, index) => ({
    id: `brand-${index + 1}`,
    name: brand,
    devices: phones.filter(phone => phone.marca === brand).length,
  }));
};

export const getPhoneDetails = async (deviceId: string): Promise<PhoneDetail> => {
  try {
    console.log('Fetching phone details for:', deviceId);
    const data = await getDataFromUrl(`/${deviceId}.php`);
    
    if (!data) {
      console.warn('No data received from API');
      throw new Error('No data received from API');
    }

    const $ = cheerio.load(data);
    
    // Nome do telefone - ajustando seletor
    const name = $('h1.specs-phone-name-title').text().trim() || 
                $('.specs-phone-name-title').text().trim() ||
                $('h1').first().text().trim();
    
    if (!name) {
      console.warn('Could not find phone name');
      throw new Error('Could not find phone name');
    }

    // Imagem do telefone - ajustando seletor
    const img = $('.specs-photo-main a img').attr('src') ||
               $('.specs-photo-main img').attr('src') ||
               $('.phone-big-photo img').attr('src') ||
               '';

    // Especificações rápidas
    const quickSpec: Array<{name: string; value: string}> = [];
    
    // Tentando diferentes seletores para especificações
    const specRows = $('.specs-brief-accent tr, #specs-list tr, .specs-list tr');
    
    specRows.each((_, element) => {
      const $row = $(element);
      const name = $row.find('td.ttl, th').text().trim();
      const value = $row.find('td.nfo, td:not(.ttl)').text().trim();
      
      if (name && value) {
        quickSpec.push({ name, value });
      }
    });

    // Se não encontrou specs na primeira tentativa, tenta outro formato
    if (quickSpec.length === 0) {
      $('.specs-brief-accent li, #specs-list li, .specs-list li').each((_, element) => {
        const $item = $(element);
        const text = $item.text().trim();
        const [name, value] = text.split(':').map(s => s.trim());
        
        if (name && value) {
          quickSpec.push({ name, value });
        }
      });
    }

    // Especificações detalhadas
    const detailSpec: Array<{category: string; specifications: Array<{name: string; value: string}>}> = [];
    
    $('#specs-list table, .specs-list table').each((_, table) => {
      const $table = $(table);
      const category = $table.find('th').first().text().trim();
      const specifications: Array<{name: string; value: string}> = [];
      
      $table.find('tr').each((_, row) => {
        const $row = $(row);
        const name = $row.find('td.ttl').text().trim();
        const value = $row.find('td.nfo').text().trim();
        
        if (name && value) {
          specifications.push({ name, value });
        }
      });

      if (category && specifications.length > 0) {
        detailSpec.push({ category, specifications });
      }
    });

    // Garantindo que temos pelo menos algumas especificações
    if (quickSpec.length === 0 && detailSpec.length === 0) {
      console.warn('No specifications found');
      throw new Error('No specifications found');
    }

    // Se não temos especificações rápidas mas temos detalhadas, criar quickSpec a partir das detalhadas
    if (quickSpec.length === 0 && detailSpec.length > 0) {
      const importantCategories = ['Display', 'Platform', 'Memory', 'Camera', 'Battery'];
      detailSpec.forEach(category => {
        if (importantCategories.some(ic => category.category.includes(ic))) {
          category.specifications.forEach(spec => {
            quickSpec.push(spec);
          });
        }
      });
    }

    const phoneDetail: PhoneDetail = {
      name,
      img: img.startsWith('http') ? img : `${BASE_URL}${img}`,
      quickSpec: quickSpec.slice(0, 7), // Limitando a 7 especificações rápidas
      detailSpec
    };

    console.log('Successfully parsed phone details:', phoneDetail.name);
    return phoneDetail;

  } catch (error) {
    console.error('Error fetching phone details:', error);
    // Não vamos mais tentar fallback para dados locais
    // Em vez disso, vamos lançar o erro para ser tratado pelo componente
    throw error;
  }
};

// Função auxiliar para buscar dados locais como fallback
const getLocalPhoneDetails = (deviceId: string) => {
  const phone = phones.find(p => p.id === deviceId);
  
  if (!phone) {
    throw new Error('Phone not found');
  }
  
  return {
    name: `${phone.marca} ${phone.modelo}`,
    img: phone.imagem,
    quickSpec: [
      { name: 'Tela', value: phone.especificacoes.tela },
      { name: 'Processador', value: phone.especificacoes.processador },
      { name: 'RAM', value: phone.especificacoes.ram },
      { name: 'Armazenamento', value: phone.especificacoes.armazenamento },
      { name: 'Bateria', value: phone.especificacoes.bateria },
      { name: 'Câmera Principal', value: phone.especificacoes.cameraPrincipal },
      { name: 'Câmera Frontal', value: phone.especificacoes.cameraFrontal },
    ],
    detailSpec: [
      {
        category: 'Tela',
        specifications: [
          { name: 'Display', value: phone.especificacoes.tela },
        ],
      },
      {
        category: 'Hardware',
        specifications: [
          { name: 'Processador', value: phone.especificacoes.processador },
          { name: 'RAM', value: phone.especificacoes.ram },
          { name: 'Armazenamento', value: phone.especificacoes.armazenamento },
        ],
      },
      {
        category: 'Câmeras',
        specifications: [
          { name: 'Principal', value: phone.especificacoes.cameraPrincipal },
          { name: 'Frontal', value: phone.especificacoes.cameraFrontal },
        ],
      },
      {
        category: 'Bateria',
        specifications: [
          { name: 'Capacidade', value: phone.especificacoes.bateria },
        ],
      },
      {
        category: 'Informações Gerais',
        specifications: [
          { name: 'Marca', value: phone.marca },
          { name: 'Modelo', value: phone.modelo },
          { name: 'Lançamento', value: phone.lancamento },
          { name: 'Preço', value: `R$ ${phone.preco.toFixed(2)}` },
        ],
      },
    ],
  };
};