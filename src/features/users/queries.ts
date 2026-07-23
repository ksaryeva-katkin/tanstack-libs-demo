import { useQuery } from '@tanstack/react-query';
import { getUsers } from './api';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
};

export const useUsersQuery = () =>
  useQuery({
    queryKey: userKeys.lists(),
    queryFn: getUsers,
  });
