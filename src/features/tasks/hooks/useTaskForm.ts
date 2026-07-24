import { useForm, type AnyFieldApi } from '@tanstack/react-form';
import { useMemo } from 'react';
import type { Task } from '../../../mocks/types';
import { useCreateTaskMutation, useUpdateTaskMutation } from '../api';
import { taskFormSchema, type TaskFormValues } from '../schemas';

type UseTaskFormOptions = {
  mode: 'create' | 'edit';
  taskId?: string;
  initialValues?: Partial<TaskFormValues>;
  onSuccess?: (task: Task) => void;
};

export const defaultTaskFormValues: TaskFormValues = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  assigneeId: '',
  dueDate: '',
};

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'string') {
    return error;
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return String(error);
};

export const getFieldError = (field: AnyFieldApi) => {
  if (!field.state.meta.isTouched) {
    return undefined;
  }

  return (field.state.meta.errors as unknown[])
    .map(getErrorMessage)
    .filter(Boolean)
    .join(', ');
};

export function useTaskForm({
  mode,
  taskId,
  initialValues,
  onSuccess,
}: UseTaskFormOptions) {
  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const defaultValues = useMemo<TaskFormValues>(
    () => ({ ...defaultTaskFormValues, ...initialValues }),
    [initialValues],
  );
  const activeMutation =
    mode === 'create' ? createTaskMutation : updateTaskMutation;
  const mutationError =
    activeMutation.error instanceof Error ? activeMutation.error.message : null;

  const form = useForm({
    defaultValues,
    // onChange keeps feedback close to the fields while the user is editing.
    validators: { onChange: taskFormSchema },
    onSubmit: ({ value }) => {
      if (mode === 'create') {
        createTaskMutation.mutate(value, {
          onSuccess: (task) => {
            onSuccess?.(task);
            form.reset(defaultTaskFormValues);
          },
        });
        return;
      }

      if (!taskId) {
        return;
      }

      updateTaskMutation.mutate(
        { id: taskId, input: value },
        {
          onSuccess: (task) => {
            onSuccess?.(task);
          },
        },
      );
    },
  });

  return {
    form,
    isPending: activeMutation.isPending,
    mutationError,
  };
}
