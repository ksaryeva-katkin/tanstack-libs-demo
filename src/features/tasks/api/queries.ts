import { useQuery } from '@tanstack/react-query';
import { usePendingTaskCreateById } from '../../../lib/offline';
import { getTask, getTasks } from './api';
import { taskKeys } from './keys';
import type { TaskFilters } from '../filters';

export const useTasksQuery = (filters: TaskFilters = {}) =>
  useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => getTasks(filters),
    // Tasks are edited often, so use a moderate freshness window.
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

export const useTaskQuery = (id: string | null) => {
  const pendingTaskCreate = usePendingTaskCreateById(id);
  const taskQuery = useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTask(id!),
    enabled: Boolean(id) && !pendingTaskCreate,
    // Task details share the board's moderate freshness window.
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  if (pendingTaskCreate) {
    return {
      ...taskQuery,
      data: pendingTaskCreate.task,
      isError: false,
      isFetching: false,
      isLoading: false,
      error: null,
    };
  }

  return taskQuery;
};
