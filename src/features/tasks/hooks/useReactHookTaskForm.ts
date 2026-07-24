import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { Task } from '../../../mocks/types';
import { useCreateTaskMutation } from '../api';
import { taskFormSchema, type TaskFormValues } from '../schemas';
import { defaultTaskFormValues } from './useTaskForm';

type UseReactHookTaskFormOptions = {
  initialValues?: Partial<TaskFormValues>;
  onSuccess?: (task: Task) => void;
};

export function useReactHookTaskForm({
  initialValues,
  onSuccess,
}: UseReactHookTaskFormOptions) {
  const createTaskMutation = useCreateTaskMutation();
  const defaultValues = useMemo<TaskFormValues>(
    () => ({ ...defaultTaskFormValues, ...initialValues }),
    [initialValues],
  );
  const form = useForm<TaskFormValues>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(taskFormSchema),
  });
  const mutationError =
    createTaskMutation.error instanceof Error
      ? createTaskMutation.error.message
      : null;

  const onSubmit = form.handleSubmit((values) => {
    createTaskMutation.mutate(values, {
      onSuccess: (task) => {
        onSuccess?.(task);
        form.reset(defaultTaskFormValues);
      },
    });
  });

  return {
    form,
    isPending: createTaskMutation.isPending,
    mutationError,
    onSubmit,
  };
}
