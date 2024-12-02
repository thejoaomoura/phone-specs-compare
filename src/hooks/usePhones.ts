import { useQuery } from 'react-query';
import { fetchPhones } from '../services/api';
import { Phone } from '../types';

interface UsePhonesParams {
  search?: string;
  brand?: string;
  limit?: number;
  page?: number;
}

export function usePhones(params?: UsePhonesParams) {
  return useQuery<Phone[]>(['phones', params], () => fetchPhones(params), {
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}