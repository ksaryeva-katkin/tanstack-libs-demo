import { useSelector } from '@tanstack/react-store';
import { kanbanUIStore } from './store';

export const useSelectedTaskId = () =>
  useSelector(kanbanUIStore, (state) => state.selectedTaskId);

export const useIsDetailPanelOpen = () =>
  useSelector(kanbanUIStore, (state) => state.isDetailPanelOpen);

export const useCardViewMode = () =>
  useSelector(kanbanUIStore, (state) => state.cardViewMode);
