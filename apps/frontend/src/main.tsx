import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css';
import Dashboard from './pages/dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import Auth from './pages/auth';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/auth/protected-route';
import { AuthProvider } from './contexts/auth-context';
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>

        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

             
              <Route path="/auth" element={<Auth />} />

            
            </Routes>
            <Toaster
              toastOptions={{
                classNames: {
                  toast: '!border-2 !shadow-sm',
                  title: '!font-semibold !text-foreground',
                  description: '!text-muted-foreground',
                  icon: '!text-muted-foreground',
                },
                style: {
                  backgroundColor: 'var(--muted)',
                },
              }}
            />
          </BrowserRouter>
        </AuthProvider>

    </QueryClientProvider>
  </StrictMode>
);
