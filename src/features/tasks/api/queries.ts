import { useQuery } from '@tanstack/react-query';
import { getTask, getTasks, type TaskFilters } from './api';
import { taskKeys } from './keys';

export const useTasksQuery = (filters: TaskFilters = {}) =>
  useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => getTasks(filters),
    // Tasks are edited often, so use a moderate freshness window.
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

export const useTaskQuery = (id: string | null) =>
  useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTask(id!),
    enabled: Boolean(id),
    // Task details share the board's moderate freshness window.
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
