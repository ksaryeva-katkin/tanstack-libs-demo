import { createStore } from '@tanstack/store';
import { useSelector } from '@tanstack/react-store';

type OfflineState = {
  isOffline: boolean;
};

export const offlineStore = createStore<OfflineState>({
  isOffline: false,
});

export const useIsOffline = () =>
  useSelector(offlineStore, (state) => state.isOffline);
