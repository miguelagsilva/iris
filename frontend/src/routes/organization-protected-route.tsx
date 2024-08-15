import { useAuth } from "@/providers/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

function OrganizationProtectedRoute({ userType }) {
  //const isAuthenticated = true; // Implement this function
  const currentEntity = useAuth()[userType];

  if (!currentEntity) {
    return <Navigate to={`/${userType}/sign-in`} replace />;
  }

  console.log("currentEntity", currentEntity);
  console.log("UserType", userType);

  if (!currentEntity || !currentEntity.organizationId) {
    return <Navigate to={`/${userType}/no-organization`} replace />;
  }

  return <Outlet />;
}

export default OrganizationProtectedRoute;
