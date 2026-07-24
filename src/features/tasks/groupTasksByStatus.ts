import type { Status, Task } from '../../mocks/types';
import { taskStatuses } from './constants';

export const groupTasksByStatus = <TTask extends Task>(tasks: TTask[] = []) =>
  taskStatuses.reduce(
    (groups, status) => {
      groups[status] = tasks.filter((task) => task.status === status);

      return groups;
    },
    {} as Record<Status, TTask[]>,
  );
