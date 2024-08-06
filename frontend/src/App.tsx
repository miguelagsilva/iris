import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import { UserLogin } from "./pages/user/user-login";
import "@/index.css";
import ProtectedRoute from "./layouts/protected-route";
import NotFound from "./pages/NotFound";
import { UserDashboardGroups } from "./pages/user/dashboard/groups";
import { UserDashboardUsers } from "./pages/user/dashboard/users";
import { UserDashboardEmployees } from "./pages/user/dashboard/employees";
import { UserDashboardSettings } from "./pages/user/dashboard/settings";
import { UserDashboardHome } from "./pages/user/dashboard/home";
import UserDashboardLayout from "./pages/user/dashboard/layout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<NotFound />}>
      <Route path="/login">
        {/*
        <Route path="admin" element={<AdminLogin />} />
        <Route path="employee" element={<EmployeeLogin />} />
        */}
      </Route>

      <Route path="user/login" element={<UserLogin />} />

      <Route path="user" element={<ProtectedRoute userType="user" />}>
        <Route path="dashboard" element={<UserDashboardLayout />}>
          <Route index element={<UserDashboardHome />} />
          <Route path="users" element={<UserDashboardUsers />} />
          <Route path="groups" element={<UserDashboardGroups />} />
          <Route path="employees" element={<UserDashboardEmployees />} />
          <Route path="settings" element={<UserDashboardSettings />} />
        </Route>
        {/*
  <Route path="profile" element={<UserProfile />} />
  <Route path="settings" element={<UserSettings />} />
  */}
      </Route>
      {/*
        <Route path="admin" element={<ProtectedRoute userType="admin" />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="employees" element={<AdminEmployees />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        <Route path="employee" element={<ProtectedRoute userType="employee" />}>
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="tasks" element={<EmployeeTasks />} />
          <Route path="timesheet" element={<EmployeeTimesheet />} />
        </Route>
    */}

      <Route path="/" element={<Navigate to="/login/user" replace />} />
      {/*
        <Route path="*" element={<NotFound />} /> 
        */}
    </Route>,
  ),
);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
