import {
  createCollection,
  useLiveQuery,
  type CollectionConfig,
} from '@tanstack/react-db';
import { queryCollectionOptions } from '@tanstack/query-db-collection';
import { useMemo } from 'react';
import type { ActivityEvent } from '../../../mocks/types';
import { queryClient } from '../../../lib/query-client';
import { getActivities } from '../api/api';
import { activityKeys, type ActivityFilters } from '../api/queryKeys';

const activitiesCollectionOptions = queryCollectionOptions({
  queryKey: activityKeys.lists(),
  queryFn: () => getActivities(),
  queryClient,
  getKey: (activity) => activity.id,
  staleTime: 0,
  gcTime: 2 * 60_000,
  refetchOnWindowFocus: true,
}) as unknown as CollectionConfig<ActivityEvent, string>;

export const activitiesCollection = createCollection<ActivityEvent, string>(
  activitiesCollectionOptions,
);

const applyActivityFilters = (
  activities: ActivityEvent[],
  filters: ActivityFilters = {},
) => {
  const start = filters.offset ?? 0;
  const end =
    typeof filters.limit === 'number' ? start + filters.limit : undefined;
  const filteredByTask = filters.taskId
    ? activities.filter((activity) => activity.taskId === filters.taskId)
    : activities;

  return filteredByTask.slice(start, end);
};

export const useActivitiesCollectionQuery = (
  filters: ActivityFilters = {},
) => {
  const activitiesQuery = useLiveQuery((query) =>
    query
      .from({ activity: activitiesCollection })
      .select(({ activity }) => activity),
  );

  const activities = useMemo(() => {
    const activityEvents = (activitiesQuery.data ??
      []) as unknown as ActivityEvent[];

    return applyActivityFilters(activityEvents, filters);
  }, [activitiesQuery.data, filters]);

  return {
    ...activitiesQuery,
    data: activities,
    isFetching: activitiesQuery.isLoading,
  };
};
