import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { KanbanBoard } from '../features/tasks/components/KanbanBoard';
import type { Priority, Status } from '../mocks/types';
import { taskPriorities, taskStatuses } from '../features/tasks/constants';
import { closeTaskDetail, useIsDetailPanelOpen } from '../features/tasks';

type BoardSearch = {
  status?: Status;
  priority?: Priority;
  assignee?: string;
  search?: string;
};

const parseSearch = (search: Record<string, unknown>): BoardSearch => ({
  status: taskStatuses.includes(search.status as Status)
    ? (search.status as Status)
    : undefined,
  priority: taskPriorities.includes(search.priority as Priority)
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
  Route.useSearch();
  const isDetailPanelOpen = useIsDetailPanelOpen();

  useEffect(() => {
    if (isDetailPanelOpen) {
      closeTaskDetail();
    }
  }, [isDetailPanelOpen]);

  return <KanbanBoard />;
}
