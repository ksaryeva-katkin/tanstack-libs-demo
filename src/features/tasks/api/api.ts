import { apiRequest, toSearchParams } from '../../../lib/api';
import type { Priority, Status, Task } from '../../../mocks/types';

export type TaskFilters = {
  status?: Status;
  priority?: Priority;
  assignee?: string;
  search?: string;
};

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateTaskInput = Partial<CreateTaskInput>;

export const getTasks = (filters: TaskFilters = {}) =>
  apiRequest<Task[]>(`/tasks${toSearchParams(filters)}`);

export const getTask = (id: string) => apiRequest<Task>(`/tasks/${id}`);

export const createTask = (input: CreateTaskInput) =>
  apiRequest<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(input),
  });

export const updateTask = (id: string, input: UpdateTaskInput) =>
  apiRequest<Task>(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });

export const deleteTask = (id: string) =>
  apiRequest<{ id: string }>(`/tasks/${id}`, {
    method: 'DELETE',
  });
