import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { openTaskDetail } from '../store';
import { ReactHookTaskForm } from './ReactHookTaskForm';
import { TaskForm } from './TaskForm';

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const navigate = useNavigate();
  const [createFormLibrary, setCreateFormLibrary] = useState<
    'tanstack' | 'react-hook-form'
  >('tanstack');

  if (!isOpen) {
    return null;
  }

  const handleSuccess = (task: { id: string }) => {
    onClose();
    openTaskDetail(task.id);
    void navigate({
      params: { taskId: task.id },
      to: '/tasks/$taskId',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 py-6">
      <div className="w-full max-w-2xl rounded-md border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <p className="text-xs font-medium uppercase text-teal-300">
              Form libraries
            </p>
            <h2 className="mt-1 text-lg font-semibold text-white">New task</h2>
          </div>
          <button
            className="rounded-md border border-zinc-800 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/30"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto px-5 py-5">
          <div className="mb-5 flex rounded-md border border-zinc-800 bg-zinc-950 p-1">
            {[
              { label: 'TanStack Form', value: 'tanstack' },
              { label: 'React Hook Form', value: 'react-hook-form' },
            ].map((item) => (
              <button
                className={`flex-1 rounded px-3 py-2 text-xs font-medium transition ${
                  createFormLibrary === item.value
                    ? 'bg-teal-400 text-zinc-950'
                    : 'text-zinc-400 hover:text-white'
                }`}
                key={item.value}
                onClick={() =>
                  setCreateFormLibrary(item.value as typeof createFormLibrary)
                }
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>

          {createFormLibrary === 'tanstack' ? (
            <TaskForm mode="create" onSuccess={handleSuccess} />
          ) : (
            <ReactHookTaskForm onSuccess={handleSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}
