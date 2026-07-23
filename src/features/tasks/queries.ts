import { useQuery } from '@tanstack/react-query';
import { getTask, getTasks, type TaskFilters } from './api';
import { taskKeys } from './keys';

export const useTasksQuery = (filters: TaskFilters = {}) =>
  useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => getTasks(filters),
  });

export const useTaskQuery = (id: string) =>
  useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTask(id),
    enabled: Boolean(id),
  });
