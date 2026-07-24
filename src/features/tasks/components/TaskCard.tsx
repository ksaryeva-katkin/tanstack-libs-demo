import { Link } from '@tanstack/react-router';
import { useDraggable } from '@dnd-kit/core';
import type { CSSProperties } from 'react';
import { usePendingTaskCreateById } from '../../../lib/offline';
import type { Task, User } from '../../../mocks/types';
import { openTaskDetail, useCardViewMode } from '../store';
import { TaskPriorityBadge } from './TaskBadges';

type TaskCardProps = {
  task: Task;
  assignee?: User;
  isDragging?: boolean;
  isOverlay?: boolean;
};

const formatDueDate = (dueDate: string) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${dueDate}T00:00:00`));

export function TaskCard({
  task,
  assignee,
  isDragging = false,
  isOverlay = false,
}: TaskCardProps) {
  const cardViewMode = useCardViewMode();
  const pendingTaskCreate = usePendingTaskCreateById(task.id);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { task },
    disabled: isOverlay || Boolean(pendingTaskCreate),
  });

  const style: CSSProperties | undefined =
    transform && !isOverlay
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : undefined;
  const initials =
    assignee?.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2) ?? '?';

  return (
    <Link
      ref={setNodeRef}
      params={{ taskId: task.id }}
      style={style}
      to="/tasks/$taskId"
      onClick={() => openTaskDetail(task.id)}
      className={`block rounded-md border border-zinc-800 bg-zinc-950 ${cardViewMode === 'compact' ? 'p-3' : 'p-4'} shadow-sm shadow-black/20 outline-none transition hover:border-teal-500/60 hover:bg-zinc-900 focus-visible:border-teal-300 focus-visible:ring-2 focus-visible:ring-teal-300/30 ${
        isDragging ? 'opacity-50' : ''
      } ${
        isOverlay
          ? 'rotate-1 cursor-grabbing border-teal-400 shadow-xl shadow-black/40'
          : pendingTaskCreate
            ? 'cursor-pointer border-amber-300/40'
            : 'cursor-grab active:cursor-grabbing'
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 h-12 w-1 shrink-0 rounded-full ${
            task.priority === 'high'
              ? 'bg-rose-400'
              : task.priority === 'medium'
                ? 'bg-amber-400'
                : 'bg-emerald-400'
          }`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h4 className="break-words text-sm font-semibold leading-5 text-white">
              {task.title}
            </h4>
            <div className="flex shrink-0 flex-col items-end gap-2">
              {pendingTaskCreate ? (
                <span
                  className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                    pendingTaskCreate.status === 'error'
                      ? 'border-red-300/40 bg-red-400/10 text-red-100'
                      : 'border-amber-300/40 bg-amber-300/10 text-amber-100'
                  }`}
                >
                  {pendingTaskCreate.status === 'syncing'
                    ? 'Syncing'
                    : pendingTaskCreate.status === 'error'
                      ? 'Sync error'
                      : 'Unsynced'}
                </span>
              ) : null}
              {cardViewMode === 'full' ? (
                <TaskPriorityBadge priority={task.priority} />
              ) : null}
            </div>
          </div>

          {cardViewMode === 'full' ? (
            <>
              <p className="mt-2 line-clamp-2 text-sm leading-5 text-zinc-400">
                {task.description}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-zinc-800 text-[11px] font-semibold text-zinc-200">
                    {initials}
                  </span>
                  <span className="truncate text-xs text-zinc-400">
                    {assignee?.name ?? 'Unassigned'}
                  </span>
                </div>

                <span className="shrink-0 text-xs text-zinc-500">
                  Due {formatDueDate(task.dueDate)}
                </span>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
