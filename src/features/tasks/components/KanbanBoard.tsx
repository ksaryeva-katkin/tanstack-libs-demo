import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useMemo, useState } from 'react';
import { useUsersQuery } from '../../users';
import type { Status, Task, User } from '../../../mocks/types';
import { useChangeTaskStatusMutation, useTasksQuery } from '../';
import { taskStatusLabels, taskStatuses } from '../constants';
import { groupTasksByStatus } from '../groupTasksByStatus';
import { TaskCard } from './TaskCard';

type KanbanColumnProps = {
  status: Status;
  tasks: Task[];
  usersById: Map<string, User>;
  activeTaskId: string | null;
};

function KanbanColumn({
  status,
  tasks,
  usersById,
  activeTaskId,
}: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-96 w-[20rem] shrink-0 flex-col rounded-md border bg-zinc-900/60 transition md:w-auto ${
        isOver ? 'border-teal-400/70 bg-teal-400/10' : 'border-zinc-800'
      }`}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <h3 className="text-sm font-semibold uppercase text-zinc-200">
          {taskStatusLabels[status]}
        </h3>
        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-300">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        {tasks.length === 0 ? (
          <p className="rounded-md border border-dashed border-zinc-800 px-3 py-8 text-center text-sm text-zinc-500">
            Drop tasks here
          </p>
        ) : null}

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            assignee={usersById.get(task.assigneeId)}
            isDragging={task.id === activeTaskId}
            task={task}
          />
        ))}
      </div>
    </section>
  );
}

export function KanbanBoard() {
  const tasksQuery = useTasksQuery();
  const usersQuery = useUsersQuery();
  const changeStatusMutation = useChangeTaskStatusMutation();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 160, tolerance: 8 },
    }),
  );
  const tasksByStatus = useMemo(
    () => groupTasksByStatus(tasksQuery.data),
    [tasksQuery.data],
  );
  const usersById = useMemo(
    () => new Map(usersQuery.data?.map((user) => [user.id, user]) ?? []),
    [usersQuery.data],
  );
  const activeTask =
    tasksQuery.data?.find((task) => task.id === activeTaskId) ?? null;
  const totalTasks = tasksQuery.data?.length ?? 0;
  const statusError =
    changeStatusMutation.error instanceof Error
      ? changeStatusMutation.error.message
      : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const task = tasksQuery.data?.find(
      (currentTask) => currentTask.id === String(event.active.id),
    );
    const nextStatus = event.over?.id as Status | undefined;

    setActiveTaskId(null);

    if (!task || !nextStatus || !taskStatuses.includes(nextStatus)) {
      return;
    }

    if (task.status !== nextStatus) {
      changeStatusMutation.mutate({ id: task.id, status: nextStatus });
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-teal-300">
            Query + drag and drop
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Board</h2>
        </div>

        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <span>{totalTasks} tasks</span>
          {tasksQuery.isFetching || usersQuery.isFetching ? (
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
        <DndContext
          onDragCancel={() => setActiveTaskId(null)}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          sensors={sensors}
        >
          <div className="overflow-x-auto pb-2">
            <div className="grid min-w-max gap-4 md:min-w-0 md:grid-cols-3">
              {taskStatuses.map((status) => (
                <KanbanColumn
                  key={status}
                  activeTaskId={activeTaskId}
                  status={status}
                  tasks={tasksByStatus[status]}
                  usersById={usersById}
                />
              ))}
            </div>
          </div>

          <DragOverlay>
            {activeTask ? (
              <TaskCard
                assignee={usersById.get(activeTask.assigneeId)}
                isOverlay
                task={activeTask}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : null}
    </section>
  );
}
