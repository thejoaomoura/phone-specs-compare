import { useQuery } from 'react-query';
import { getBrands } from '../services/api';

export function useBrands() {
  return useQuery('brands', getBrands, {
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
  });
}