// @ts-expect-error static import
import '@/App.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider, ThemeProvider, ToastProvider } from '@/contexts';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
