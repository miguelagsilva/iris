import { useAuth } from "@/hooks/auth";
import { Navigate, Outlet } from "react-router-dom";

export default function UserProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading user route</div>;
  }

  if (!user) {
    return <Navigate to={`/user/sign-in`} replace />;
  }

  return <Outlet />;
}
