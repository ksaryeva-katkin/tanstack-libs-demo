import { createFileRoute } from '@tanstack/react-router';
import { useTasksQuery } from '../features/tasks';
import type { Priority, Status } from '../mocks/types';

type BoardSearch = {
  status?: Status;
  priority?: Priority;
  assignee?: string;
  search?: string;
};

const statuses: Status[] = ['todo', 'in_progress', 'done'];
const priorities: Priority[] = ['low', 'medium', 'high'];

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

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Board</h2>
        <p className="mt-2 text-sm text-zinc-400">
          TODO: реализовать Kanban-доску в следующем этапе.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
          Tasks from MSW
        </h3>

        {tasksQuery.isLoading ? (
          <p className="mt-4 text-sm text-zinc-400">Loading tasks...</p>
        ) : null}

        {tasksQuery.isError ? (
          <p className="mt-4 text-sm text-red-300">
            Failed to load tasks from mock API.
          </p>
        ) : null}

        {tasksQuery.data ? (
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-200">
            {tasksQuery.data.map((task) => (
              <li key={task.id}>
                {task.title} — {task.status} — {task.priority}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
