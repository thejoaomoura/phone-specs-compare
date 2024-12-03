import axios from 'axios';
import cheerio from 'cheerio';
import { Phone, PhoneDetail } from '../types';

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
  try {
    let url = '/';
    
    if (params?.brand) {
      url = `/${params.brand}.php`;
    } else if (params?.search) {
      url = `/results.php3?sQuickSearch=yes&sName=${encodeURIComponent(params.search)}`;
    }

    const html = await getDataFromUrl(url);
    const $ = cheerio.load(html);
    const phones: Phone[] = [];

    $('.phone-item').each((_, element) => {
      const $element = $(element);
      const $link = $element.find('a');
      const id = $link.attr('href')?.split('-')[1].replace('.php', '') || '';
      const name = $element.find('.phone-name').text().trim();
      const img = $element.find('img').attr('src') || '';
      const description = $element.find('.phone-description').text().trim();

      if (id && name) {
        phones.push({
          id,
          name,
          img: img.startsWith('http') ? img : `${BASE_URL}${img}`,
          description
        });
      }
    });

    return params?.limit ? phones.slice(0, params.limit) : phones;
  } catch (error) {
    console.error('Error fetching phones:', error);
    throw error;
  }
};

export const fetchTopPhones = async () => {
  try {
    const html = await getDataFromUrl('/');
    const $ = cheerio.load(html);
    
    const phones: Phone[] = [];
    $('.phone-item').each((_, element) => {
      const $element = $(element);
      const id = $element.find('a').attr('href')?.split('-')[1].replace('.php', '') || '';
      const name = $element.find('.phone-name').text().trim();
      const img = $element.find('img').attr('src') || '';
      const description = $element.find('.phone-description').text().trim();
      
      phones.push({
        id,
        name,
        img,
        description
      });
    });
    
    return phones.slice(0, 12); // Return top 12 phones
  } catch (error) {
    console.error('Error fetching top phones:', error);
    throw error;
  }
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
          //console.log('Found phone:', { id, name, imgUrl });
          phones.push({ id, name, img: imgUrl, description });
        }
      } catch (parseError) {
        console.error('Error parsing phone element:', parseError);
      }
    });
    
    if (phones.length === 0) {
      console.warn('Nenhum telefone encontrado na resposta da API, retornando à pesquisa local');
      return fetchPhones({ search: searchValue });
    }
    
    return phones;
  } catch (error) {
    console.error('Erro ao pesquisar modelos:', error);
    //console.log('Falling back to local search');
    return fetchPhones({ search: searchValue });
  }
};

export const getBrands = async () => {
  try {
    const html = await getDataFromUrl('/makers.php3');
    const $ = cheerio.load(html);
    const brands: Array<{ id: string; name: string; devices: number }> = [];

    $('.brand-listings li').each((_, element) => {
      const $element = $(element);
      const $link = $element.find('a');
      const id = $link.attr('href')?.split('.')[0] || '';
      const name = $link.text().trim();
      const devices = parseInt($element.find('.count').text().trim()) || 0;

      if (id && name) {
        brands.push({ id, name, devices });
      }
    });

    return brands;
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

export const getPhoneDetails = async (deviceId: string): Promise<PhoneDetail> => {
  try {
    //console.log('Fetching phone details for:', deviceId);
    const data = await getDataFromUrl(`/${deviceId}.php`);
    
    if (!data) {
      console.warn('No data received from API');
      throw new Error('No data received from API');
    }

    const $ = cheerio.load(data);
    
    // Nome do telefone 
    const name = $('h1.specs-phone-name-title').text().trim() || 
                $('.specs-phone-name-title').text().trim() ||
                $('h1').first().text().trim();
    
    if (!name) {
      console.warn('Could not find phone name');
      throw new Error('Could not find phone name');
    }

    // Imagem do telefone 
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
      console.warn('Nenhuma especificação encontrada');
      throw new Error('Nenhuma especificação encontrada');
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

    //console.log('Successfully parsed phone details:', phoneDetail.name);
    return phoneDetail;

  } catch (error) {
    console.error('Error fetching phone details:', error);
    throw error;
  }
};

