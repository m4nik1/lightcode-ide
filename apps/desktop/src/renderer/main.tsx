import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './components/ThemeProvider';
import { EditorTabsProvider } from './context/EditorTabsContext';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from ''

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Renderer root element was not found');
}

ReactDOM.createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <EditorTabsProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </EditorTabsProvider>
    </ThemeProvider>
  </QueryClientProvider>,
);
