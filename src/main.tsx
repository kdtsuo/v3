// @ts-expect-error static import
import '@/App.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider, ThemeProvider, ToastProvider } from '@/contexts';
import App from './App';

import { MetaProvider } from '@/contexts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <MetaProvider>
            <App />
          </MetaProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
