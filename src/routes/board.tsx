import { Link, createFileRoute } from '@tanstack/react-router';
import { useChangeTaskStatusMutation, useTasksQuery } from '../features/tasks';
import type { Priority, Status, Task } from '../mocks/types';

type BoardSearch = {
  status?: Status;
  priority?: Priority;
  assignee?: string;
  search?: string;
};

const statuses: Status[] = ['todo', 'in_progress', 'done'];
const priorities: Priority[] = ['low', 'medium', 'high'];

const statusLabels: Record<Status, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Done',
};

const priorityStyles: Record<Priority, string> = {
  low: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  medium: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  high: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
};

const parseSearch = (search: Record<string, unknown>): BoardSearch => ({
  status: statuses.includes(search.status as Status)
    ? (search.status as Status)
    : undefined,
  priority: priorities.includes(search.priority as Priority)
    ? (search.priority as Priority)
    : undefined,
  assignee: typeof search.assignee === 'string' ? search.assignee : undefined,
  search: typeof search.search === 'string' ? search.search : undefined,
});

export const Route = createFileRoute('/board')({
  validateSearch: parseSearch,
  component: BoardPage,
});

function BoardPage() {
  const filters = Route.useSearch();
  const tasksQuery = useTasksQuery(filters);
  const changeStatusMutation = useChangeTaskStatusMutation();
  const statusError =
    changeStatusMutation.error instanceof Error
      ? changeStatusMutation.error.message
      : null;
  const tasksByStatus = statuses.reduce(
    (groups, status) => {
      groups[status] = tasksQuery.data?.filter((task) => task.status === status) ?? [];

      return groups;
    },
    {} as Record<Status, Task[]>,
  );
  const totalTasks = tasksQuery.data?.length ?? 0;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-teal-300">
            Query + optimistic updates
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Board</h2>
        </div>

        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <span>{totalTasks} tasks</span>
          {tasksQuery.isFetching ? (
            <span className="text-teal-200">Syncing...</span>
          ) : (
            <span>Synced</span>
          )}
        </div>
      </div>

      {tasksQuery.isLoading ? (
        <div className="rounded-md border border-zinc-800 bg-zinc-900/70 px-4 py-8 text-center text-sm text-zinc-400">
          Loading tasks...
        </div>
      ) : null}

      {tasksQuery.isError ? (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Failed to load tasks from mock API.
        </div>
      ) : null}

      {statusError ? (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Status change failed and was rolled back: {statusError}
        </div>
      ) : null}

      {tasksQuery.data ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {statuses.map((status) => (
            <section
              key={status}
              className="min-h-80 rounded-md border border-zinc-800 bg-zinc-900/50"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">
                  {statusLabels[status]}
                </h3>
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-300">
                  {tasksByStatus[status].length}
                </span>
              </div>

              <div className="space-y-3 p-3">
                {tasksByStatus[status].length === 0 ? (
                  <p className="px-2 py-6 text-center text-sm text-zinc-500">
                    No tasks here
                  </p>
                ) : null}

                {tasksByStatus[status].map((task) => (
                  <article
                    key={task.id}
                    className="rounded-md border border-zinc-800 bg-zinc-950 p-4 shadow-sm shadow-black/20"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          className="font-medium text-white hover:text-teal-200"
                          params={{ taskId: task.id }}
                          to="/tasks/$taskId"
                        >
                          {task.title}
                        </Link>
                        <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                          {task.description}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${priorityStyles[task.priority]}`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs text-zinc-500">
                        Due {task.dueDate}
                      </span>

                      <div className="flex flex-wrap gap-2">
                        {statuses
                          .filter((nextStatus) => nextStatus !== task.status)
                          .map((nextStatus) => (
                            <button
                              key={nextStatus}
                              type="button"
                              className="rounded-md border border-zinc-700 px-2 py-1 text-xs font-medium text-zinc-200 transition hover:border-teal-400 hover:text-teal-100 disabled:cursor-not-allowed disabled:opacity-50"
                              disabled={changeStatusMutation.isPending}
                              onClick={() =>
                                changeStatusMutation.mutate({
                                  id: task.id,
                                  status: nextStatus,
                                })
                              }
                            >
                              Move to {statusLabels[nextStatus]}
                            </button>
                          ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}
    </section>
  );
}
