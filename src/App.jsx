import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { queryClient } from "./lib/queryClient";
import { useAuthStore } from "./stores/auth.store";
import { authService } from "./services/auth.service";
import RoleGuard from "./components/guards/RoleGuard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import KitchenDashboard from "./pages/KitchenDashboard";
import POS from "./pages/POS";
import Orders from "./pages/Orders";
import Menu from "./pages/Menu";
// import Inventory from "./pages/Inventory";
import Ingredients from "./pages/Ingredients";
import Users from "./pages/Users";
import TaxSettings from "./pages/TaxSettings";
import Reports from "./pages/Reports";
import "./App.css";

// Auth Initializer Component
function AuthInitializer({ children }) {
  const { isAuthenticated, isInitialized, setAuth, setInitialized, clearAuth } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");

      // If we have a token and user in store, try to verify authentication
      if (accessToken && isAuthenticated) {
        try {
          const data = await authService.getMe();
          setAuth(data.user);
          // eslint-disable-next-line no-unused-vars
        } catch (_error) {
          // Token is invalid, clear auth state
          clearAuth();
        }
      } else {
        // No token, mark as initialized
        setInitialized();
      }
    };

    if (!isInitialized) {
      initAuth();
    }
  }, [isInitialized, isAuthenticated, setAuth, clearAuth, setInitialized]);

  // Show loading spinner while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Public Route Component (redirect if already logged in)
function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthInitializer>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#f97316',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={["owner"]}>
                    <Dashboard />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/kitchen"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={["kitchen"]}>
                    <KitchenDashboard />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pos"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={["owner", "cashier"]}>
                    <POS />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={["owner", "cashier", "kitchen"]}>
                    <Orders />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/menu"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={["owner"]}>
                    <Menu />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            {/* Inventory temporarily disabled - using ingredient-level tracking */}
            {/* <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={["owner"]}>
                    <Inventory />
                  </RoleGuard>
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/ingredients"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={["owner"]}>
                    <Ingredients />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={["owner"]}>
                    <Users />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />

            <Route
              path="/tax-settings"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={["owner"]}>
                    <TaxSettings />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={["owner"]}>
                    <Reports />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthInitializer>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
