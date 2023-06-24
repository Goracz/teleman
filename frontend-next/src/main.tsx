import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AppLayout from './components/layout/app-layout.tsx';
import Automation from './pages/automation.tsx';
import Channels from './pages/channels.tsx';
import Dashboard from './pages/dashboard.tsx';

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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
