import axios from 'axios';
import cheerio from 'cheerio';
import { Phone, PhoneDetail } from '../types';

const BASE_URL = '/gsmarena';
const IMG_CDN = 'https://fdn2.gsmarena.com/vv/bigpic/';

// [brandId, phoneId, phoneName, keywords, imgFilename, shortName]
type QuicksearchEntry = [number, number, string, string, string, string];
type QuicksearchData = [Record<string, string>, QuicksearchEntry[]];

let quicksearchCache: QuicksearchData | null = null;

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

const getQuicksearchData = async (): Promise<QuicksearchData> => {
  if (quicksearchCache) return quicksearchCache;

  // Extract the versioned quicksearch URL from the homepage JS
  const homepage = await getDataFromUrl('/');
  const match = homepage.match(/AUTOCOMPLETE_LIST_URL\s*=\s*"([^"]+)"/);
  if (!match) throw new Error('Autocomplete URL not found in homepage');

  const response = await axios.get(`${BASE_URL}${match[1]}`, {
    headers: { 'Accept': '*/*' },
    responseType: 'text',
  });

  quicksearchCache = JSON.parse(response.data) as QuicksearchData;
  return quicksearchCache;
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

    $('.makers ul li').each((_, element) => {
      const $link = $(element).find('a');
      const href = $link.attr('href') || '';
      const id = href.split('/').pop()?.replace('.php', '') || '';
      const imgEl = $link.find('img');
      const img = imgEl.attr('src') || '';
      const title = imgEl.attr('title') || '';
      const name = title.split(' smartphone')[0].split(' tablet')[0].split(' watch')[0].trim()
        || $link.find('strong span').text().trim();
      const description = title;

      if (id && name) {
        phones.push({ id, name, img, description });
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
    // The quicksearch data is sorted by daily popularity — first entries = top trending.
    const [brands, phones] = await getQuicksearchData();

    return phones.slice(0, 12).map(([brandId, phoneId, phoneName, , imgFile]) => {
      const brandName = brands[String(brandId)] || '';
      const fullName = `${brandName} ${phoneName}`.trim();
      const slug = fullName.toLowerCase().replace(/ /g, '_');
      return {
        id: `${slug}-${phoneId}`,
        name: fullName,
        img: imgFile ? `${IMG_CDN}${imgFile}` : '',
        description: '',
      };
    });
  } catch (error) {
    console.error('Error fetching top phones:', error);
    throw error;
  }
};

export const searchPhones = async (searchValue: string): Promise<Phone[]> => {
  if (!searchValue.trim()) return [];

  try {
    const [brands, phones] = await getQuicksearchData();
    const query = searchValue.toLowerCase();
    const results: Phone[] = [];

    for (const [brandId, phoneId, phoneName, keywords, imgFile] of phones) {
      const brandName = brands[String(brandId)] || '';
      const fullName = `${brandName} ${phoneName}`.trim();
      const searchable = `${fullName} ${keywords}`.toLowerCase();

      if (searchable.includes(query)) {
        const slug = fullName.toLowerCase().replace(/ /g, '_');
        const id = `${slug}-${phoneId}`;
        const img = imgFile ? `${IMG_CDN}${imgFile}` : '';
        results.push({ id, name: fullName, img, description: '' });
      }
    }

    return results.slice(0, 30);
  } catch (error) {
    console.error('Erro ao pesquisar modelos:', error);
    return [];
  }
};

export const getBrands = async () => {
  try {
    const html = await getDataFromUrl('/makers.php3');
    const $ = cheerio.load(html);
    const brands: Array<{ id: string; name: string; devices: number }> = [];

    // Structure: .st-text > table > tbody > tr > td > a
    // <a href="https://www.gsmarena.com/samsung-phones-9.php">Samsung<br><span>1456 devices</span></a>
    $('.st-text table td a').each((_, element) => {
      const $link = $(element);
      const href = $link.attr('href') || '';
      const id = href.split('/').pop()?.replace('.php', '') || '';
      const name = $link.contents().first().text().trim();
      const devices = parseInt($link.find('span').text()) || 0;

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
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      brand: name.split(' ')[0],
      img: img.startsWith('http') ? img : `${BASE_URL}${img}`,
      priceRange: { min: 0, max: 0 },
      ratings: { overall: 0, display: 0, camera: 0, performance: 0, battery: 0 },
      quickSpec: quickSpec.slice(0, 7),
      detailSpec
    };

    //console.log('Successfully parsed phone details:', phoneDetail.name);
    return phoneDetail;

  } catch (error) {
    console.error('Error fetching phone details:', error);
    throw error;
  }
};
