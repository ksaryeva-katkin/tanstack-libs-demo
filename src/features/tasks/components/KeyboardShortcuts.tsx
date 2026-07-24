import { useHotkey } from '@tanstack/react-hotkeys';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import { closeTaskDetail, useIsDetailPanelOpen } from '../store';
import { CreateTaskModal } from './CreateTaskModal';
import { GlobalSearchModal } from './GlobalSearchModal';

const routes = ['/board', '/table', '/activity'] as const;

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  return Boolean(
    target.closest(
      'input:not([type="button"]):not([type="submit"]):not([type="reset"]), textarea, select, [contenteditable="true"]',
    ),
  );
};

export function KeyboardShortcuts() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isDetailPanelOpen = useIsDetailPanelOpen();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const openCreateModal = () => setIsCreateModalOpen(true);

  useHotkey('Mod+K', () => setIsSearchOpen(true), {
    ignoreInputs: false,
    preventDefault: true,
  });

  useHotkey(
    'Escape',
    () => {
      if (isSearchOpen) {
        setIsSearchOpen(false);
        return;
      }

      if (isCreateModalOpen) {
        setIsCreateModalOpen(false);
        return;
      }

      if (isDetailPanelOpen) {
        closeTaskDetail();
      }
    },
    { preventDefault: false },
  );

  useHotkey(
    'N',
    (event) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      openCreateModal();
    },
    {
      ignoreInputs: false,
      meta: { description: 'Open the new task modal' },
      preventDefault: true,
    },
  );

  useHotkey(
    'ArrowLeft',
    (event) => {
      if (isSearchOpen || isCreateModalOpen || isEditableTarget(event.target)) {
        return;
      }

      const currentIndex = routes.findIndex((route) => pathname.startsWith(route));
      const previousRoute = routes[Math.max(currentIndex - 1, 0)];

      if (previousRoute && previousRoute !== pathname) {
        void navigate({ to: previousRoute });
      }
    },
    { ignoreInputs: false, preventDefault: false },
  );

  useHotkey(
    'ArrowRight',
    (event) => {
      if (isSearchOpen || isCreateModalOpen || isEditableTarget(event.target)) {
        return;
      }

      const currentIndex = routes.findIndex((route) => pathname.startsWith(route));
      const nextRoute = routes[Math.min(currentIndex + 1, routes.length - 1)];

      if (nextRoute && nextRoute !== pathname) {
        void navigate({ to: nextRoute });
      }
    },
    { ignoreInputs: false, preventDefault: false },
  );

  return (
    <>
      <button
        className="inline-flex items-center gap-2 rounded-md border border-zinc-800 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/30"
        onClick={() => setIsSearchOpen(true)}
        title="Search tasks"
        type="button"
      >
        <span>Search</span>
        <kbd className="rounded border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 text-[11px] text-zinc-400">
          Ctrl+K
        </kbd>
      </button>

      {isSearchOpen ? (
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      ) : null}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
