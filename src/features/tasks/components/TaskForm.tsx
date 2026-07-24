import { Button, FormField, Input, Select, Textarea } from '../../../components/ui';
import { useUsersQuery } from '../../users';
import { getFieldError, useTaskForm } from '../hooks';
import { taskPriorityOptions, taskStatusOptions } from '../taskFormFields';
import type { TaskFormValues } from '../schemas';

type TaskFormProps = Parameters<typeof useTaskForm>[0];

export function TaskForm(props: TaskFormProps) {
  const usersQuery = useUsersQuery();
  const { form, isPending, mutationError } = useTaskForm(props);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      {mutationError ? (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {mutationError}
        </div>
      ) : null}

      <form.Field
        name="title"
        children={(field) => (
          <FormField error={getFieldError(field)} label="Title">
            <Input
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Task title"
              value={field.state.value}
            />
          </FormField>
        )}
      />

      <form.Field
        name="description"
        children={(field) => (
          <FormField error={getFieldError(field)} label="Description">
            <Textarea
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="What needs to happen?"
              value={field.state.value}
            />
          </FormField>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field
          name="status"
          children={(field) => (
            <FormField error={getFieldError(field)} label="Status">
              <Select
                name={field.name}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(
                    event.target.value as TaskFormValues['status'],
                  )
                }
                value={field.state.value}
              >
                {taskStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>
          )}
        />

        <form.Field
          name="priority"
          children={(field) => (
            <FormField error={getFieldError(field)} label="Priority">
              <Select
                name={field.name}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(
                    event.target.value as TaskFormValues['priority'],
                  )
                }
                value={field.state.value}
              >
                {taskPriorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field
          name="assigneeId"
          children={(field) => (
            <FormField error={getFieldError(field)} label="Assignee">
              <Select
                disabled={usersQuery.isLoading}
                name={field.name}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                value={field.state.value}
              >
                <option value="">Select assignee</option>
                {usersQuery.data?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </FormField>
          )}
        />

        <form.Field
          name="dueDate"
          children={(field) => (
            <FormField error={getFieldError(field)} label="Due date">
              <Input
                name={field.name}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                type="date"
                value={field.state.value}
              />
            </FormField>
          )}
        />
      </div>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting] as const}
        children={([canSubmit, isSubmitting]) => (
          <Button
            className="w-full"
            disabled={!canSubmit || isSubmitting || isPending}
            type="submit"
          >
            {isPending
              ? 'Saving...'
              : props.mode === 'create'
                ? 'Create task'
                : 'Save changes'}
          </Button>
        )}
      />
    </form>
  );
}
