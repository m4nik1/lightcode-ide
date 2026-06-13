import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './components/ThemeProvider';
import { EditorTabsProvider } from './context/EditorTabsContext';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Renderer root element was not found');
}

ReactDOM.createRoot(rootElement).render(
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
  </ThemeProvider>,
);
