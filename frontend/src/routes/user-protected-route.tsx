import { useAuth } from "@/providers/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

function UserProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading user route</div>;
  }

  if (!user) {
    console.log("Redirecting to sign-in");
    return <Navigate to={`/user/sign-in`} replace />;
  }

  return <Outlet />;
}

export default UserProtectedRoute;
