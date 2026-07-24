import { kanbanUIStore } from './store';
import type { CardViewMode } from './types';

export const openTaskDetail = (taskId: string) => {
  kanbanUIStore.setState((state) => ({
    ...state,
    selectedTaskId: taskId,
    isDetailPanelOpen: true,
  }));
};

export const closeTaskDetail = () => {
  kanbanUIStore.setState((state) => ({
    ...state,
    // Keep selectedTaskId while the panel closes so its content does not flicker
    // during the CSS transition. The next openTaskDetail call replaces it.
    isDetailPanelOpen: false,
  }));
};

export const setCardViewMode = (cardViewMode: CardViewMode) => {
  kanbanUIStore.setState((state) => ({
    ...state,
    cardViewMode,
  }));
};
