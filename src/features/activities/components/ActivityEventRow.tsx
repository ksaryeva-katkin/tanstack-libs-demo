import type {
  ActivityEvent,
  Priority,
  Status,
  Task,
  User,
} from '../../../mocks/types';
import { openTaskDetail } from '../../tasks';
import {
  taskPriorityLabels,
  taskPriorityStyles,
  taskStatusLabels,
  taskStatusStyles,
} from '../../tasks/constants';

type ActivityEventRowProps = {
  activity: ActivityEvent;
  task?: Task;
  user?: User;
  usersById: Map<string, User>;
};

const activityLabels: Record<ActivityEvent['type'], string> = {
  created: 'Created task',
  status_changed: 'Changed status',
  assignee_changed: 'Changed assignee',
  priority_changed: 'Changed priority',
};

const activityStyles: Record<ActivityEvent['type'], string> = {
  created: 'border-teal-400/40 bg-teal-400/10 text-teal-200',
  status_changed: 'border-sky-400/40 bg-sky-400/10 text-sky-200',
  assignee_changed: 'border-fuchsia-400/40 bg-fuchsia-400/10 text-fuchsia-200',
  priority_changed: 'border-amber-400/40 bg-amber-400/10 text-amber-200',
};

const formatRelativeTime = (date: string) => {
  const diffMs = new Date(date).getTime() - Date.now();
  const absDiffMs = Math.abs(diffMs);
  const units = [
    ['month', 30 * 24 * 60 * 60 * 1000],
    ['week', 7 * 24 * 60 * 60 * 1000],
    ['day', 24 * 60 * 60 * 1000],
    ['hour', 60 * 60 * 1000],
    ['minute', 60 * 1000],
  ] as const;
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  for (const [unit, unitMs] of units) {
    if (absDiffMs >= unitMs) {
      return formatter.format(Math.round(diffMs / unitMs), unit);
    }
  }

  return formatter.format(Math.round(diffMs / 1000), 'second');
};

const formatExactTime = (date: string) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));

const getPayloadValue = (payload: ActivityEvent['payload'], key: 'from' | 'to') =>
  typeof payload?.[key] === 'string' ? payload[key] : null;

const renderValueBadge = (
  type: ActivityEvent['type'],
  value: string | null,
  usersById: Map<string, User>,
) => {
  if (!value) {
    return <span className="text-zinc-500">None</span>;
  }

  if (type === 'status_changed') {
    const status = value as Status;

    return (
      <span
        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${taskStatusStyles[status] ?? 'border-zinc-700 bg-zinc-900 text-zinc-200'}`}
      >
        {taskStatusLabels[status] ?? value}
      </span>
    );
  }

  if (type === 'priority_changed') {
    const priority = value as Priority;

    return (
      <span
        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${taskPriorityStyles[priority] ?? 'border-zinc-700 bg-zinc-900 text-zinc-200'}`}
      >
        {taskPriorityLabels[priority] ?? value}
      </span>
    );
  }

  if (type === 'assignee_changed') {
    return (
      <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-xs font-medium text-zinc-200">
        {usersById.get(value)?.name ?? 'Unassigned'}
      </span>
    );
  }

  return <span className="text-zinc-300">{value}</span>;
};

export function ActivityEventRow({
  activity,
  task,
  user,
  usersById,
}: ActivityEventRowProps) {
  const from = getPayloadValue(activity.payload, 'from');
  const to = getPayloadValue(activity.payload, 'to');

  return (
    <article
      className="rounded-md border border-zinc-800 bg-zinc-950 px-4 py-3 shadow-sm shadow-black/20"
      data-activity-row
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${activityStyles[activity.type]}`}
            >
              {activityLabels[activity.type]}
            </span>
            <span className="text-xs text-zinc-500">
              {formatRelativeTime(activity.createdAt)}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-zinc-300">
            <span className="font-medium text-zinc-100">
              {user?.name ?? 'System'}
            </span>{' '}
            updated{' '}
            <button
              className="font-medium text-teal-200 underline decoration-teal-400/40 underline-offset-4 transition hover:text-teal-100"
              onClick={() => openTaskDetail(activity.taskId)}
              type="button"
            >
              {task?.title ?? `Task ${activity.taskId}`}
            </button>
          </p>

          {activity.type === 'created' ? (
            <p className="mt-1 text-sm text-zinc-400">
              Added this task to the board.
            </p>
          ) : (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
              {renderValueBadge(activity.type, from, usersById)}
              <span aria-hidden="true" className="text-zinc-600">
                &rarr;
              </span>
              {renderValueBadge(activity.type, to, usersById)}
            </div>
          )}
        </div>

        <time
          className="shrink-0 text-xs text-zinc-500"
          dateTime={activity.createdAt}
        >
          {formatExactTime(activity.createdAt)}
        </time>
      </div>
    </article>
  );
}
