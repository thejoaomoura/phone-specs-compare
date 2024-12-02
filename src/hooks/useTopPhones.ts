import { useQuery } from 'react-query';
import { fetchTopPhones } from '../services/api';

export function useTopPhones() {
  return useQuery('topPhones', fetchTopPhones, {
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
  });
}