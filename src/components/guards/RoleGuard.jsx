import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

export default function RoleGuard({ children, allowedRoles = [] }) {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || "owner";

  // If no specific roles are required, allow access
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user's role is in the allowed roles
  if (!allowedRoles.includes(userRole)) {
    // Redirect based on user role
    if (userRole === "cashier") {
      return <Navigate to="/pos" replace />;
    } else if (userRole === "kitchen") {
      return <Navigate to="/orders" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
