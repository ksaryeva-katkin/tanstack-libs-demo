import {
  taskPriorities,
  taskPriorityLabels,
  taskStatusLabels,
  taskStatuses,
} from './constants';

export const taskStatusOptions = taskStatuses.map((status) => ({
  label: taskStatusLabels[status],
  value: status,
}));

export const taskPriorityOptions = taskPriorities.map((priority) => ({
  label: taskPriorityLabels[priority],
  value: priority,
}));
