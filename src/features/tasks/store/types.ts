export type CardViewMode = 'compact' | 'full';

export interface KanbanUIState {
  selectedTaskId: string | null;
  isDetailPanelOpen: boolean;
  cardViewMode: CardViewMode;
}
