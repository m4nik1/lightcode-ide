import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './utils/trpc';
import { AIWindow } from './AIWindow';
import { ViewProvider } from './context/useView';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Renderer root element was not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ViewProvider>
        <AIWindow />
      </ViewProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);