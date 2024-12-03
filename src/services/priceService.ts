interface BuscapeProduct {
  name: string;
  price: string;
  rating: string;
  link: string;
  tags: string[];
  image: string;
  installment: string;
}

interface BuscapeResponse {
  query: string;
  total: number;
  products: BuscapeProduct[];
}

interface PhonePriceInfo {
  price: string | null;
  link: string | null;
}

export async function fetchPhonePrice(phoneName: string): Promise<PhonePriceInfo> {
  try {
    const encodedName = encodeURIComponent(phoneName);
    const response = await fetch(`https://buscape-search-api.vercel.app/api/search?q=${encodedName}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch price data');
    }

    const data: BuscapeResponse = await response.json();
    
    if (data.products && data.products.length > 0) {
      const product = data.products[0];
      // Remove o "R$ " e converte para número
      const priceStr = product.price.replace('R$ ', '').replace('.', '').replace(',', '.');
      return {
        price: priceStr,
        link: product.link
      };
    }
    
    return {
      price: null,
      link: null
    };
  } catch (error) {
    console.error('Error fetching price:', error);
    return {
      price: null,
      link: null
    };
  }
}
