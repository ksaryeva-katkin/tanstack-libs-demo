import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activityKeys } from '../activities';
import type { Status, Task } from '../../mocks/types';
import {
  createTask,
  deleteTask,
  updateTask,
  type CreateTaskInput,
  type UpdateTaskInput,
} from './api';
import { taskKeys } from './keys';

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
    },
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      updateTask(id, input),
    onSuccess: (task) => {
      queryClient.setQueryData(taskKeys.detail(task.id), task);
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
    },
  });
};

type ChangeTaskStatusVariables = {
  id: string;
  status: Status;
};

type ChangeTaskStatusContext = {
  previousTaskLists: Array<[readonly unknown[], Task[] | undefined]>;
  previousTaskDetail: Task | undefined;
};

export const useChangeTaskStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Task,
    Error,
    ChangeTaskStatusVariables,
    ChangeTaskStatusContext
  >({
    mutationFn: ({ id, status }) => updateTask(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });

      const previousTaskLists = queryClient.getQueriesData<Task[]>({
        queryKey: taskKeys.lists(),
      });
      const previousTaskDetail = queryClient.getQueryData<Task>(
        taskKeys.detail(id),
      );

      previousTaskLists.forEach(([queryKey, previousTasks]) => {
        if (!previousTasks) {
          return;
        }

        queryClient.setQueryData<Task[]>(
          queryKey,
          previousTasks.map((task) =>
            task.id === id
              ? { ...task, status, updatedAt: new Date().toISOString() }
              : task,
          ),
        );
      });

      if (previousTaskDetail) {
        queryClient.setQueryData<Task>(taskKeys.detail(id), {
          ...previousTaskDetail,
          status,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousTaskLists, previousTaskDetail };
    },
    onError: (_error, { id }, context) => {
      context?.previousTaskLists.forEach(([queryKey, previousTasks]) => {
        queryClient.setQueryData(queryKey, previousTasks);
      });

      queryClient.setQueryData(taskKeys.detail(id), context?.previousTaskDetail);
    },
    onSuccess: (task) => {
      queryClient.setQueryData(taskKeys.detail(task.id), task);
    },
    onSettled: (_task, _error, { id }) => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: (_result, id) => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
    },
  });
};
