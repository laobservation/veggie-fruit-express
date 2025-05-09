
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { CartNotificationProvider } from './hooks/use-cart';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { LanguageProvider } from './hooks/use-language';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <CartNotificationProvider>
          <App />
          <Toaster />
          <SonnerToaster position="bottom-left" closeButton toastOptions={{ style: { background: 'white' } }} />
        </CartNotificationProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
