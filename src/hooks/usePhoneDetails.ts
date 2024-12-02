import { useQuery } from 'react-query';
import { getPhoneDetails } from '../services/api';

export function usePhoneDetails(phoneId: string) {
  return useQuery(
    ['phone', phoneId],
    () => getPhoneDetails(phoneId),
    {
      enabled: !!phoneId,
      staleTime: 60 * 60 * 1000, // Cache for 1 hour
    }
  );
}