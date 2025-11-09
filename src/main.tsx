import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@/App.css';
import { AuthProvider, ThemeProvider, ToastProvider } from '@/contexts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
);
