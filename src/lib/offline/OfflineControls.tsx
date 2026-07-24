import { useEffect, useRef, useState } from 'react';
import { useCreateTaskMutation } from '../../features/tasks/api';
import { replaceSelectedTaskId } from '../../features/tasks/store';
import { toggleOffline, useIsOffline } from './offlineState';
import {
  markPendingTaskError,
  markPendingTaskSyncing,
  removePendingTask,
  usePendingTaskCreateCount,
  usePendingTaskCreates,
} from './pendingTasks';

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

export function OfflineControls() {
  const isOffline = useIsOffline();
  const pendingTasks = usePendingTaskCreates();
  const pendingCount = usePendingTaskCreateCount();
  const createTaskMutation = useCreateTaskMutation();
  const [syncProgress, setSyncProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    const syncableTasks = pendingTasks.filter((task) => task.status !== 'error');

    if (isOffline || syncableTasks.length === 0 || isSyncingRef.current) {
      return;
    }

    let isCancelled = false;

    const syncPendingTasks = async () => {
      isSyncingRef.current = true;
      setSyncProgress({ current: 0, total: syncableTasks.length });

      for (const [index, pendingTask] of syncableTasks.entries()) {
        if (isCancelled) {
          break;
        }

        markPendingTaskSyncing(pendingTask.id);
        setSyncProgress({ current: index, total: syncableTasks.length });

        try {
          const createdTask = await createTaskMutation.mutateAsync(
            pendingTask.input,
          );

          replaceSelectedTaskId(pendingTask.id, createdTask.id);
          removePendingTask(pendingTask.id);
          setSyncProgress({ current: index + 1, total: syncableTasks.length });

          await new Promise((resolve) => window.setTimeout(resolve, 450));
        } catch (error) {
          markPendingTaskError(pendingTask.id, getErrorMessage(error));
          setSyncProgress({ current: index + 1, total: syncableTasks.length });
        }
      }

      if (!isCancelled) {
        setSyncProgress(null);
      }

      isSyncingRef.current = false;
    };

    void syncPendingTasks();

    return () => {
      isCancelled = true;
    };
  }, [createTaskMutation, isOffline, pendingTasks]);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <button
        className={`rounded-md border px-3 py-2 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/30 ${
          isOffline
            ? 'border-amber-300 bg-amber-300/15 text-amber-100 hover:bg-amber-300/20'
            : 'border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white'
        }`}
        onClick={toggleOffline}
        type="button"
      >
        Simulate offline
      </button>

      {pendingCount > 0 ? (
        <span className="rounded-md border border-amber-300/30 bg-amber-300/10 px-3 py-2 font-medium text-amber-100">
          {pendingCount} unsynced change{pendingCount === 1 ? '' : 's'}
        </span>
      ) : null}

      {syncProgress ? (
        <span className="rounded-md border border-teal-300/30 bg-teal-300/10 px-3 py-2 font-medium text-teal-100">
          Syncing: {syncProgress.current} of {syncProgress.total}
        </span>
      ) : null}
    </div>
  );
}

export function OfflineBanner() {
  const isOffline = useIsOffline();

  if (!isOffline) {
    return null;
  }

  return (
    <div className="border-t border-amber-300/30 bg-amber-300/15 px-6 py-2 text-center text-sm font-medium text-amber-100">
      Offline mode: changes are saved locally
    </div>
  );
}
