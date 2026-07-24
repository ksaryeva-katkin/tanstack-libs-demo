# Mini Kanban Board

Mini Kanban Board is a demo application for exploring the TanStack ecosystem on a compact task-management product. The app combines a Kanban board, table view, task detail overlay, activity feed, and global search on top of Vite, React, TypeScript, Tailwind CSS, and MSW.

The project is intentionally small enough to inspect, but broad enough to show where the TanStack libraries overlap and where each one owns a different part of the UI/data flow.

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- MSW for the mock API
- dnd-kit for Kanban drag and drop
- Zod for form validation
- TanStack Router `^1.170.18`
- TanStack Query `^5.101.4`
- TanStack Query Devtools `^5.101.4`
- TanStack DB `0.6.16`
- TanStack React DB `0.1.94`
- TanStack Query DB Collection `1.2.0`
- TanStack Store `0.11.0` / React Store `0.11.0`
- TanStack Form `1.33.2`
- TanStack Form Devtools `^0.2.31`
- TanStack Table `^8.21.3`
- TanStack Virtual `^3.14.8`
- TanStack Pacer `0.22.1`
- TanStack Pacer Devtools `0.7.1`
- TanStack Hotkeys `0.10.0`
- TanStack Hotkeys Devtools `0.7.0`
- TanStack React Devtools `^0.10.9`
- TanStack Router Devtools `^1.167.0`

## Functionality

- Kanban board with drag and drop status changes.
- Optimistic status updates for Kanban status changes.
- Table view with sorting, filtering, and pagination.
- Shared board/table filters through Router search params.
- Task create/edit/detail overlay with TanStack Form and Zod validation.
- Activity feed with plain and virtualized rendering modes for 1000+ events.
- TanStack DB collections layered over Query data.
- Global task search via `Ctrl+K` / `Cmd+K`.
- Keyboard shortcuts for search, create task, escape, and route navigation.

## Running The Project

The repo is configured with `pnpm` and includes a `pnpm-lock.yaml`.

```bash
pnpm install
pnpm dev
```

Vite starts on `http://localhost:5173` by default. Open `http://localhost:5173/board` for the main board.

Equivalent npm commands usually work too:

```bash
npm install
npm run dev
```

Useful checks:

```bash
pnpm lint
pnpm check-types
pnpm build
```

## How TanStack Is Used

| Library          | Where it is used                                             | Pattern demonstrated                                                                                         |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| TanStack Router  | `src/routes/*`                                               | File-based routes, root layout, overlay route for task details, shared search params for board/table filters |
| TanStack Query   | `src/features/*/api`                                         | Server-state fetching, mutations, invalidation, optimistic update/rollback                                   |
| TanStack DB      | `src/features/*/collections`                                 | Query-backed collections and derived collection queries                                                      |
| TanStack Store   | `src/features/tasks/store`, `src/lib/offline`                | Small client-side state slices for selected task, view mode, and offline queue internals                     |
| TanStack Form    | `src/features/tasks/components/TaskForm.tsx`                 | Typed task forms with Zod validation and submit state                                                        |
| TanStack Table   | `src/features/tasks/components/TaskTable.tsx`                | Sortable/filterable/paginated task table                                                                     |
| TanStack Virtual | `src/features/activities/components/ActivityFeedVirtual.tsx` | Rendering 1000+ activity rows without mounting every row                                                     |
| TanStack Pacer   | `TaskFiltersBar`, `TaskForm`                                 | Debounced filters and throttled form draft metadata                                                          |
| TanStack Hotkeys | `KeyboardShortcuts`                                          | App-wide shortcuts with input-aware guards                                                                   |

## Comparison Notes

| Task             | TanStack         | Alternative         |
| ---------------- | ---------------- | ------------------- |
| Routing          | TanStack Router  | React Router        |
| Server State     | TanStack Query   | Redux Toolkit Query |
| State Management | TanStack Store   | Zustand             |
| Forms            | TanStack Form    | React Hook Form     |
| Tables           | TanStack Table   | MUI DataGrid        |
| Virtualization   | TanStack Virtual | react-window        |

Routing: TanStack Router felt strongest where the board and table needed to share URL search params as typed app state. React Router would be familiar and lighter to many teams, but this project benefited from Router making the URL contract explicit.

Server State: TanStack Query was the smoothest fit in the app. The optimistic Kanban status move, rollback, detail cache update, and list invalidation all stayed close to the mutation code instead of spreading into a wider Redux slice.

State Management: TanStack Store worked well for tiny local state, especially selected task and board view state. Zustand would probably be more familiar and more documented for the same job; Store was enough here, but it still feels like the less battle-tested choice.

Forms: TanStack Form gave a strongly typed form model and paired cleanly with Zod. React Hook Form is still easier to reach for from habit and has a larger ecosystem, which is why the project keeps a small comparison hook/component around, but the main task form uses TanStack Form.

Tables: TanStack Table matched the project because the table needed behavior, not a full visual component framework. MUI DataGrid would be faster if the goal were a polished enterprise grid out of the box, but it would also bring a heavier UI dependency.

Virtualization: TanStack Virtual made the activity contrast very visible: the virtual mode mounts only the visible/overscan rows, while the plain mode mounts the whole feed. `react-window` could cover this demo too; TanStack Virtual felt more natural in this codebase because the rest of the data/UI stack was already TanStack.

## Known Limitations

- TanStack DB, React DB, Store, Pacer, and Hotkeys are used in versions that are still evolving quickly compared with Query/Table/Virtual.
- Some devtool packages are included for exploration and may not be necessary in a production app.
- Offline queue internals are present in the codebase, but the UI no longer exposes a manual offline simulation control.
- Global shortcuts use TanStack Hotkeys directly with local guards for editable fields.
- The mock API is in-memory MSW data, so a browser refresh resets server-side mock changes.
