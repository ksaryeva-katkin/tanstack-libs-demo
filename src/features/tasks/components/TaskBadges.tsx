import type { Priority, Status } from '../../../mocks/types';
import {
  taskPriorityLabels,
  taskPriorityStyles,
  taskStatusLabels,
  taskStatusStyles,
} from '../constants';

type TaskBadgeProps<TValue extends string> = {
  label: string;
  value: TValue;
  styles: Record<TValue, string>;
};

function TaskBadge<TValue extends string>({
  label,
  value,
  styles,
}: TaskBadgeProps<TValue>) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-medium ${styles[value]}`}
    >
      {label}
    </span>
  );
}

export const TaskStatusBadge = ({ status }: { status: Status }) => (
  <TaskBadge
    label={taskStatusLabels[status]}
    styles={taskStatusStyles}
    value={status}
  />
);

export const TaskPriorityBadge = ({ priority }: { priority: Priority }) => (
  <TaskBadge
    label={taskPriorityLabels[priority]}
    styles={taskPriorityStyles}
    value={priority}
  />
);
