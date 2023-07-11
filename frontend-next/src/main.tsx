import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import * as Sentry from '@sentry/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { EventsProvider } from './components/EventsProvider.tsx';
import AppLayout from './components/layout/app-layout.tsx';
import Automation from './pages/automation.tsx';
import Channels from './pages/channels.tsx';
import Dashboard from './pages/dashboard.tsx';
import store from './stores/index.ts';

Sentry.init({
  dsn: "https://c6ece6f926054aa9bb8b6a680c4a0174@o148875.ingest.sentry.io/4505411029172224",
  integrations: [
    new Sentry.BrowserTracing({
      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost"],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children:[
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: "/channels",
        element: <Channels />,
      },
      {
        path: "/automation",
        element: <Automation />,
      },
    ],
  },
]);

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <EventsProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </EventsProvider>
    </Provider>
  </React.StrictMode>,
)
