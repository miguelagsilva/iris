import { useAuth } from "@/hooks/auth";
import { Navigate, Outlet } from "react-router-dom";

export default function OrganizationProtectedRoute({
  userType,
}: {
  userType: "user" | "admin" | "employee";
}) {
  const { user, employee, loading } = useAuth();

  if (loading) {
    return <div>Loading organization</div>;
  }

  if (userType === "employee" && !employee?.organization) {
    return <Navigate to={`/employee/no-organization`} replace />;
  } else if (userType === "user" && !user?.organization) {
    return <Navigate to={`/user/no-organization`} replace />;
  } 

  return <Outlet />;
}
