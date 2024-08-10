import { useAuth } from "@/providers/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ userType }) {
  //const isAuthenticated = true; // Implement this function
  const currentUserType = useAuth(); // Implement this function

  console.log("currentUserType", currentUserType);
  console.log("UserType", userType);

  if (!currentUserType.user) {
    return <Navigate to={`/${userType}/sign-in`} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
