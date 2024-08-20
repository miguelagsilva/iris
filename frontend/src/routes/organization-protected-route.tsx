import { useAuth } from "@/providers/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

function OrganizationProtectedRoute({
  userType,
}: {
  userType: "user" | "admin" | "employee";
}) {
  const { user, organization, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading organization</div>;
  }

  if (!organization) {
    console.log("Redirecting to no-organization");
    console.log("ORGANIZATION ROUTE USER", user);
    console.log("ORGANIZATION ROUTE ORG", organization);
    return <Navigate to={`/${userType}/no-organization`} replace />;
  }

  return <Outlet />;
}

export default OrganizationProtectedRoute;
