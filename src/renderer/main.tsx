import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { EditorTabsProvider } from './context/EditorTabsContext';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Renderer root element was not found');
}

ReactDOM.createRoot(rootElement).render(
  <EditorTabsProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </EditorTabsProvider>,
);
