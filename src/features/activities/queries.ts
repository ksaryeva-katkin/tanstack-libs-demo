import { useQuery } from '@tanstack/react-query';
import { getActivities } from './api';
import { activityKeys, type ActivityFilters } from './queryKeys';

export const useActivitiesQuery = (filters: ActivityFilters = {}) =>
  useQuery({
    queryKey: activityKeys.list(filters),
    queryFn: () => getActivities(filters),
    // Activity is an event log, so it should refetch eagerly when the app regains focus.
    staleTime: 0,
    gcTime: 2 * 60_000,
    refetchOnWindowFocus: true,
  });
