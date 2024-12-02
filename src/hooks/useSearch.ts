import { useQuery } from 'react-query';
import { searchPhones } from '../services/api';

export function useSearch(searchTerm: string) {
  return useQuery(
    ['phones', searchTerm],
    () => searchPhones(searchTerm),
    {
      enabled: searchTerm.length > 2,
      staleTime: 5 * 60 * 1000,
    }
  );
}