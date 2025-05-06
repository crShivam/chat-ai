import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Dashboard from "./pages/dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Auth from "./pages/auth";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/auth/protected-route";
import { AuthProvider } from "./contexts/auth-context";
import NewNote from "./pages/new";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
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
            <Route path="/new" element={
              <ProtectedRoute>
                <NewNote />
              </ProtectedRoute>
            } />
            <Route path="/auth" element={<Auth />} />
          </Routes>
          <Toaster
            toastOptions={{
              classNames: {
                toast: "!border-2 !shadow-sm",
                title: "!font-semibold !text-foreground",
                description: "!text-muted-foreground",
                icon: "!text-muted-foreground",
              },
              style: {
                backgroundColor: "var(--muted)",
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
