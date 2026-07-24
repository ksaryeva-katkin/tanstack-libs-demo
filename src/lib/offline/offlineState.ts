import { createStore } from '@tanstack/store';
import { useSelector } from '@tanstack/react-store';

const offlineStorageKey = 'mini-kanban:is-offline';

type OfflineState = {
  isOffline: boolean;
};

const readInitialOfflineState = () => {
  try {
    return localStorage.getItem(offlineStorageKey) === 'true';
  } catch {
    return false;
  }
};

export const offlineStore = createStore<OfflineState>({
  isOffline: readInitialOfflineState(),
});

export const setIsOffline = (isOffline: boolean) => {
  offlineStore.setState(() => ({ isOffline }));

  try {
    localStorage.setItem(offlineStorageKey, String(isOffline));
  } catch {
    // localStorage can be unavailable in private contexts; in-memory state still works.
  }
};

export const toggleOffline = () => {
  setIsOffline(!offlineStore.state.isOffline);
};

export const useIsOffline = () =>
  useSelector(offlineStore, (state) => state.isOffline);
