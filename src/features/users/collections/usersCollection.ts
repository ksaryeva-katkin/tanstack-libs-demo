import {
  createCollection,
  useLiveQuery,
  type CollectionConfig,
} from '@tanstack/react-db';
import { queryCollectionOptions } from '@tanstack/query-db-collection';
import type { User } from '../../../mocks/types';
import { queryClient } from '../../../lib/query-client';
import { getUsers } from '../api';
import { userKeys } from '../api/queryKeys';

const usersCollectionOptions = queryCollectionOptions({
  queryKey: userKeys.lists(),
  queryFn: getUsers,
  queryClient,
  getKey: (user) => user.id,
  staleTime: 5 * 60_000,
  gcTime: 15 * 60_000,
}) as unknown as CollectionConfig<User, string>;

export const usersCollection = createCollection<User, string>(
  usersCollectionOptions,
);

export const useUsersCollectionQuery = () => {
  const usersQuery = useLiveQuery((query) =>
    query.from({ user: usersCollection }).select(({ user }) => user),
  );

  const users = (usersQuery.data ?? []) as unknown as User[];

  return {
    ...usersQuery,
    data: users,
    isFetching: usersQuery.isLoading,
  };
};
