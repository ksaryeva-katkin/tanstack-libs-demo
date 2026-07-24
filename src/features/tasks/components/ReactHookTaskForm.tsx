import { Button, FormField, Input, Select, Textarea } from '../../../components/ui';
import type { Task } from '../../../mocks/types';
import { useUsersQuery } from '../../users';
import { useReactHookTaskForm } from '../hooks';
import type { TaskFormValues } from '../schemas';
import { taskPriorityOptions, taskStatusOptions } from '../taskFormFields';

type ReactHookTaskFormProps = {
  initialValues?: Partial<TaskFormValues>;
  onSuccess?: (task: Task) => void;
};

export function ReactHookTaskForm({
  initialValues,
  onSuccess,
}: ReactHookTaskFormProps) {
  const usersQuery = useUsersQuery();
  const {
    form,
    isPending,
    mutationError,
    onSubmit,
  } = useReactHookTaskForm({
    initialValues,
    onSuccess,
  });
  const {
    formState: { errors, isSubmitting, isValid },
    register,
  } = form;

  return (
    <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
      {mutationError ? (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {mutationError}
        </div>
      ) : null}

      <FormField error={errors.title?.message} label="Title">
        <Input placeholder="Task title" {...register('title')} />
      </FormField>

      <FormField error={errors.description?.message} label="Description">
        <Textarea
          placeholder="What needs to happen?"
          {...register('description')}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField error={errors.status?.message} label="Status">
          <Select {...register('status')}>
            {taskStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField error={errors.priority?.message} label="Priority">
          <Select {...register('priority')}>
            {taskPriorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField error={errors.assigneeId?.message} label="Assignee">
          <Select disabled={usersQuery.isLoading} {...register('assigneeId')}>
            <option value="">Select assignee</option>
            {usersQuery.data?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField error={errors.dueDate?.message} label="Due date">
          <Input type="date" {...register('dueDate')} />
        </FormField>
      </div>

      <Button
        className="w-full"
        disabled={!isValid || isSubmitting || isPending}
        type="submit"
      >
        {isPending ? 'Saving...' : 'Create task'}
      </Button>
    </form>
  );
}
