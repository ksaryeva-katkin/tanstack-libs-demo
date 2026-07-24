import { useQuery } from '@tanstack/react-query';
import { getUsers } from './api';
import { userKeys } from './queryKeys';

export const useUsersQuery = () =>
  useQuery({
    queryKey: userKeys.lists(),
    queryFn: getUsers,
    // Users change rarely in this demo, so keep them fresh longer than tasks.
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000,
  });
