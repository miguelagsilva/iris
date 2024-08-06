import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ userType }) {
  const isAuthenticated = true; // Implement this function
  const currentUserType = "user"; // Implement this function

  if (!isAuthenticated) {
    return <Navigate to={`/login/${userType}`} replace />;
  }

  if (currentUserType !== userType) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
