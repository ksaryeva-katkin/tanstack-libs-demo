import { createStore } from '@tanstack/store';
import type { KanbanUIState } from './types';

// Server state (source of truth is the backend, cache is TanStack Query):
//   tasks, users, activity events
// UI state (source of truth is the client, managed by TanStack Store):
//   selected task, detail panel visibility, card display mode

const initialState: KanbanUIState = {
  selectedTaskId: null,
  isDetailPanelOpen: false,
  cardViewMode: 'full',
};

export const kanbanUIStore = createStore(initialState);
