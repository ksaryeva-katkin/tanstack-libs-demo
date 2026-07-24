import type { Priority, Status } from '../../mocks/types';

export const taskStatuses = ['todo', 'in_progress', 'done'] as const satisfies
  readonly Status[];

export const taskStatusLabels: Record<Status, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done',
};

export const taskPriorities = ['low', 'medium', 'high'] as const satisfies
  readonly Priority[];

export const taskPriorityLabels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const taskPriorityStyles: Record<Priority, string> = {
  low: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
  medium: 'border-amber-400/40 bg-amber-400/10 text-amber-200',
  high: 'border-rose-400/40 bg-rose-400/10 text-rose-200',
};

export const taskStatusStyles: Record<Status, string> = {
  todo: 'border-sky-400/40 bg-sky-400/10 text-sky-200',
  in_progress: 'border-violet-400/40 bg-violet-400/10 text-violet-200',
  done: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
};
