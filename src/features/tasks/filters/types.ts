import type { Priority, Status } from '../../../mocks/types';

export type TaskFilters = {
  status?: Status;
  priority?: Priority;
  assignee?: string;
  search?: string;
};
