import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { KanbanBoard } from '../features/tasks/components/KanbanBoard';
import {
  closeTaskDetail,
  parseTaskFilters,
  useIsDetailPanelOpen,
} from '../features/tasks';

export const Route = createFileRoute('/board')({
  validateSearch: parseTaskFilters,
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
