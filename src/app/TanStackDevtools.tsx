import { onlineManager } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { TanStackDevtools as TanStackDevtoolsShell } from '@tanstack/react-devtools';
import type { TanStackDevtoolsReactPlugin } from '@tanstack/react-devtools';
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools';
import { TanstackQueryDevtoolsPanel } from '@tanstack/query-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/router-devtools';
import { useEffect, useMemo, useRef } from 'react';
import { queryClient } from '../lib/query-client';

function QueryDevtoolsPluginPanel() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const panel = new TanstackQueryDevtoolsPanel({
      client: queryClient,
      initialIsOpen: true,
      onlineManager,
      queryFlavor: 'React Query',
      version: '5',
    });

    panel.mount(rootRef.current);

    return () => {
      panel.unmount();
    };
  }, []);

  return <div className="h-full w-full" ref={rootRef} />;
}

export function TanStackDevtools() {
  const router = useRouter();
  const devtoolsPlugins = useMemo<Array<TanStackDevtoolsReactPlugin>>(
    () => [
      {
        id: 'tanstack-query',
        name: 'TanStack Query',
        render: <QueryDevtoolsPluginPanel />,
      },
      {
        id: 'tanstack-router',
        name: 'TanStack Router',
        render: <TanStackRouterDevtoolsPanel router={router} />,
      },
      formDevtoolsPlugin(),
    ],
    [router],
  );

  return <TanStackDevtoolsShell plugins={devtoolsPlugins} />;
}
