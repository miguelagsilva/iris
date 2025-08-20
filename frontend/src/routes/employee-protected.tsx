import { useAuth } from "@/hooks/auth";
import { Navigate, Outlet } from "react-router-dom";

export default function EmployeeProtectedRoute() {
  const { employee, loading } = useAuth();

  if (loading) {
    return <div>Loading employee route</div>;
  }

  if (!employee) {
    console.log("Redirecting to sign-in");
    return <Navigate to={`/employee/sign-in`} replace />;
  }

  return <Outlet />;
}
