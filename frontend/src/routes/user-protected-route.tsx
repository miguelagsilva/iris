import { useAuth } from "@/providers/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

function UserProtectedRoute({ userType }) {
  //const isAuthenticated = true; // Implement this function
  const currentUserType = useAuth();

  if (!currentUserType || !currentUserType[`${userType}`]) {
    return <Navigate to={`/${userType}/sign-in`} replace />;
  }

  return <Outlet />;
}

export default UserProtectedRoute;
