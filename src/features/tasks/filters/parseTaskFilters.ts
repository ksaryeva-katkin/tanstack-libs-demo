import { taskPriorities, taskStatuses } from '../constants';
import type { TaskFilters } from './types';
import type { Priority, Status } from '../../../mocks/types';

export const parseTaskFilters = (
  search: Record<string, unknown>,
): TaskFilters => ({
  status: taskStatuses.includes(search.status as Status)
    ? (search.status as Status)
    : undefined,
  priority: taskPriorities.includes(search.priority as Priority)
    ? (search.priority as Priority)
    : undefined,
  assignee: typeof search.assignee === 'string' ? search.assignee : undefined,
  search: typeof search.search === 'string' ? search.search : undefined,
});
