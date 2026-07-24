import {
  createCollection,
  useLiveQuery,
  type CollectionConfig,
} from '@tanstack/react-db';
import { queryCollectionOptions } from '@tanstack/query-db-collection';
import { useMemo } from 'react';
import type { Task, User } from '../../../mocks/types';
import { queryClient } from '../../../lib/query-client';
import { usersCollection } from '../../users/collections';
import { getTasks } from '../api/api';
import { taskKeys } from '../api/keys';
import type { TaskFilters } from '../filters';

export type TaskWithAssignee = Task & {
  assignee?: User;
};

const tasksCollectionOptions = queryCollectionOptions({
  queryKey: taskKeys.lists(),
  queryFn: () => getTasks(),
  queryClient,
  getKey: (task) => task.id,
  staleTime: 30_000,
  gcTime: 5 * 60_000,
}) as unknown as CollectionConfig<Task, string>;

export const tasksCollection = createCollection<Task, string>(
  tasksCollectionOptions,
);

const applyTaskFilters = (tasks: Task[], filters: TaskFilters = {}) =>
  tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) {
      return false;
    }

    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    if (filters.assignee && task.assigneeId !== filters.assignee) {
      return false;
    }

    if (filters.search) {
      const query = filters.search.toLowerCase();
      const searchable = `${task.title} ${task.description}`.toLowerCase();

      if (!searchable.includes(query)) {
        return false;
      }
    }

    return true;
  });

export const useTasksCollectionQuery = (filters: TaskFilters = {}) => {
  const tasksQuery = useLiveQuery((query) =>
    query.from({ task: tasksCollection }).select(({ task }) => task),
  );

  const filteredTasks = useMemo(() => {
    const tasks = (tasksQuery.data ?? []) as unknown as Task[];

    return applyTaskFilters(tasks, filters);
  }, [filters, tasksQuery.data]);

  return {
    ...tasksQuery,
    data: filteredTasks,
    isFetching: tasksQuery.isLoading,
  };
};

export const useTasksWithAssigneeCollectionQuery = (
  filters: TaskFilters = {},
) => {
  const tasksQuery = useLiveQuery((query) =>
    query.from({ task: tasksCollection }).select(({ task }) => task),
  );
  const usersQuery = useLiveQuery((query) =>
    query.from({ user: usersCollection }).select(({ user }) => user),
  );
  const tasksWithAssignee = useMemo(() => {
    const tasks = (tasksQuery.data ?? []) as unknown as Task[];
    const users = (usersQuery.data ?? []) as unknown as User[];
    const usersById = new Map(users.map((user) => [user.id, user]));

    return tasks.map((task) => ({
      ...task,
      assignee: usersById.get(task.assigneeId),
    }));
  }, [tasksQuery.data, usersQuery.data]);
  const filteredTasks = useMemo(
    () => applyTaskFilters(tasksWithAssignee, filters) as TaskWithAssignee[],
    [filters, tasksWithAssignee],
  );

  return {
    ...tasksQuery,
    data: filteredTasks,
    isError: tasksQuery.isError || usersQuery.isError,
    isFetching: tasksQuery.isLoading || usersQuery.isLoading,
    isLoading: tasksQuery.isLoading || usersQuery.isLoading,
  };
};
