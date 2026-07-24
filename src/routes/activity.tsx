import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityFeedPlain,
  ActivityFeedVirtual,
  useActivitiesQuery,
} from '../features/activities';
import { useTasksQuery } from '../features/tasks';
import { useUsersQuery } from '../features/users';

export const Route = createFileRoute('/activity')({
  component: ActivityPage,
});

type FeedMode = 'plain' | 'virtual';

function ActivityPage() {
  const [feedMode, setFeedMode] = useState<FeedMode>('virtual');
  const [renderedRows, setRenderedRows] = useState(0);
  const [virtualRangeRows, setVirtualRangeRows] = useState(0);
  const [renderMs, setRenderMs] = useState(0);
  const renderStartedAt = useRef(0);
  const activitiesQuery = useActivitiesQuery();
  const tasksQuery = useTasksQuery();
  const usersQuery = useUsersQuery();
  const activities = activitiesQuery.data ?? [];
  const isLoading =
    activitiesQuery.isLoading || tasksQuery.isLoading || usersQuery.isLoading;
  const isError =
    activitiesQuery.isError || tasksQuery.isError || usersQuery.isError;
  const tasksById = useMemo(
    () => new Map((tasksQuery.data ?? []).map((task) => [task.id, task])),
    [tasksQuery.data],
  );
  const usersById = useMemo(
    () => new Map((usersQuery.data ?? []).map((user) => [user.id, user])),
    [usersQuery.data],
  );

  useEffect(() => {
    if (!renderStartedAt.current) {
      renderStartedAt.current = performance.now();
    }

    const frame = requestAnimationFrame(() => {
      setRenderedRows(document.querySelectorAll('[data-activity-row]').length);
      setRenderMs(performance.now() - renderStartedAt.current);
      renderStartedAt.current = 0;
    });

    return () => cancelAnimationFrame(frame);
  }, [activities.length, feedMode]);

  const handleModeChange = (mode: FeedMode, startedAt: number) => {
    renderStartedAt.current = startedAt;
    setRenderedRows(0);
    setRenderMs(0);
    setFeedMode(mode);
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-teal-300">
            TanStack Virtual
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            Activity Feed
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2">
            <p className="text-xs text-zinc-500">Total events</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {activities.length.toLocaleString()}
            </p>
          </div>
          <div className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2">
            <p className="text-xs text-zinc-500">DOM rows</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {renderedRows.toLocaleString()}
              <span className="text-sm font-normal text-zinc-500">
                {' '}
                / {activities.length.toLocaleString()}
              </span>
            </p>
          </div>
          <div className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2">
            <p className="text-xs text-zinc-500">Render tick</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {Math.round(renderMs)}ms
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-zinc-800 bg-zinc-950 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-full rounded-md border border-zinc-800 bg-zinc-900 p-1 sm:w-auto">
          {(['plain', 'virtual'] as const).map((mode) => (
            <button
              className={`flex-1 rounded px-3 py-2 text-sm font-medium transition sm:flex-none ${
                feedMode === mode
                  ? 'bg-teal-400 text-zinc-950'
                  : 'text-zinc-300 hover:text-white'
              }`}
              key={mode}
              onClick={(event) => handleModeChange(mode, event.timeStamp)}
              type="button"
            >
              {mode === 'plain' ? 'Plain list' : 'Virtualized'}
            </button>
          ))}
        </div>

        <p className="text-sm text-zinc-400">
          {feedMode === 'plain'
            ? 'Rendering every event at once.'
            : `Rendering ${virtualRangeRows || renderedRows} visible + overscan rows.`}
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-zinc-400">Loading activity...</p>
      ) : null}

      {isError ? (
        <p className="text-sm text-red-300">
          Failed to load activity from mock API.
        </p>
      ) : null}

      {!isLoading && !isError ? (
        feedMode === 'plain' ? (
          <ActivityFeedPlain
            activities={activities}
            tasksById={tasksById}
            usersById={usersById}
          />
        ) : (
          <ActivityFeedVirtual
            activities={activities}
            onVisibleCountChange={setVirtualRangeRows}
            tasksById={tasksById}
            usersById={usersById}
          />
        )
      ) : null}
    </section>
  );
}
