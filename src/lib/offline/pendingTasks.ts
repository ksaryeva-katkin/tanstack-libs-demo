import { createStore } from '@tanstack/store';
import { useSelector } from '@tanstack/react-store';
import type { Task } from '../../mocks/types';
import type { CreateTaskInput } from '../../features/tasks/api';

const pendingTasksStorageKey = 'mini-kanban:pending-task-creates';

export type PendingTaskStatus = 'pending' | 'syncing' | 'error';

export type PendingTaskCreate = {
  id: string;
  task: Task;
  input: CreateTaskInput;
  status: PendingTaskStatus;
  error?: string;
};

type PendingTasksState = {
  items: PendingTaskCreate[];
};

const parsePendingTasks = (rawValue: string | null): PendingTaskCreate[] => {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as PendingTaskCreate[];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(pendingTasksStorageKey);
    return [];
  }
};

const readPendingTasks = () => {
  try {
    return parsePendingTasks(localStorage.getItem(pendingTasksStorageKey));
  } catch {
    return [];
  }
};

const writePendingTasks = (items: PendingTaskCreate[]) => {
  try {
    localStorage.setItem(pendingTasksStorageKey, JSON.stringify(items));
  } catch {
    // The store remains usable in memory if persistence is unavailable.
  }
};

const nowIso = () => new Date().toISOString();

const createLocalTask = (input: CreateTaskInput): Task => {
  const timestamp = nowIso();

  return {
    ...input,
    id: `local-${crypto.randomUUID()}`,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export const pendingTasksStore = createStore<PendingTasksState>({
  items: readPendingTasks(),
});

const setPendingTasks = (items: PendingTaskCreate[]) => {
  pendingTasksStore.setState(() => ({ items }));
  writePendingTasks(items);
};

export const addPendingTaskCreate = (input: CreateTaskInput) => {
  const task = createLocalTask(input);
  const nextItem: PendingTaskCreate = {
    id: task.id,
    task,
    input,
    status: 'pending',
  };

  setPendingTasks([...pendingTasksStore.state.items, nextItem]);

  return task;
};

export const markPendingTaskSyncing = (id: string) => {
  setPendingTasks(
    pendingTasksStore.state.items.map((item) =>
      item.id === id ? { ...item, status: 'syncing', error: undefined } : item,
    ),
  );
};

export const markPendingTaskError = (id: string, error: string) => {
  setPendingTasks(
    pendingTasksStore.state.items.map((item) =>
      item.id === id ? { ...item, status: 'error', error } : item,
    ),
  );
};

export const removePendingTask = (id: string) => {
  setPendingTasks(pendingTasksStore.state.items.filter((item) => item.id !== id));
};

export const getPendingTaskById = (id: string | null) =>
  id ? pendingTasksStore.state.items.find((item) => item.id === id) : undefined;

export const usePendingTaskCreates = () =>
  useSelector(pendingTasksStore, (state) => state.items);

export const usePendingTaskCreateCount = () =>
  useSelector(pendingTasksStore, (state) => state.items.length);

export const usePendingTaskCreateById = (id: string | null) =>
  useSelector(pendingTasksStore, (state) =>
    id ? state.items.find((item) => item.id === id) : undefined,
  );
