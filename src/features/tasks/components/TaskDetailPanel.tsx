import { useNavigate } from '@tanstack/react-router';
import {
  closeTaskDetail,
  useIsDetailPanelOpen,
  useSelectedTaskId,
  useTaskQuery,
} from '../';
import { useUsersQuery } from '../../users';
import {
  taskPriorityLabels,
  taskPriorityStyles,
  taskStatusLabels,
} from '../constants';

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date.includes('T') ? date : `${date}T00:00:00`));

export function TaskDetailPanel() {
  const navigate = useNavigate();
  const selectedTaskId = useSelectedTaskId();
  const isOpen = useIsDetailPanelOpen();
  const taskQuery = useTaskQuery(selectedTaskId);
  const usersQuery = useUsersQuery();
  const task = taskQuery.data;
  const assignee = usersQuery.data?.find((user) => user.id === task?.assigneeId);

  const handleClose = () => {
    closeTaskDetail();
    void navigate({ to: '/board' });
  };

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 transition ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <button
        aria-label="Close task details"
        className={`absolute inset-0 bg-black/55 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
        type="button"
      />

      <aside
        aria-label="Task details"
        className={`absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/40 transition-transform duration-200 sm:w-[32rem] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-teal-300">
              Query detail
            </p>
            <h2 className="mt-1 text-lg font-semibold text-white">
              Task details
            </h2>
          </div>

          <button
            className="rounded-md border border-zinc-800 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/30"
            onClick={handleClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          {taskQuery.isLoading ? (
            <p className="text-sm text-zinc-400">Loading task...</p>
          ) : null}

          {taskQuery.isError ? (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              Task not found.
            </p>
          ) : null}

          {task ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold leading-8 text-white">
                  {task.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  {task.description}
                </p>
              </div>

              <dl className="grid gap-4 text-sm">
                <div className="grid gap-1">
                  <dt className="text-zinc-500">Status</dt>
                  <dd className="font-medium text-zinc-100">
                    {taskStatusLabels[task.status]}
                  </dd>
                </div>

                <div className="grid gap-1">
                  <dt className="text-zinc-500">Priority</dt>
                  <dd>
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${taskPriorityStyles[task.priority]}`}
                    >
                      {taskPriorityLabels[task.priority]}
                    </span>
                  </dd>
                </div>

                <div className="grid gap-1">
                  <dt className="text-zinc-500">Assignee</dt>
                  <dd className="text-zinc-100">
                    {assignee?.name ?? 'Unassigned'}
                  </dd>
                </div>

                <div className="grid gap-1">
                  <dt className="text-zinc-500">Created</dt>
                  <dd className="text-zinc-100">{formatDate(task.createdAt)}</dd>
                </div>

                <div className="grid gap-1">
                  <dt className="text-zinc-500">Due date</dt>
                  <dd className="text-zinc-100">{formatDate(task.dueDate)}</dd>
                </div>
              </dl>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
