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
import { UserDashboardSupport } from "./pages/user/dashboard/support";
import { Api } from "./lib/api";

export const api = new Api({ baseUrl: "http://localhost:3000" });

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<NotFound />}>
      <Route path="user/login" element={<UserLogin />} />

      <Route path="user" element={<ProtectedRoute userType="user" />}>
        <Route path="dashboard" element={<UserDashboardLayout />}>
          <Route index element={<UserDashboardHome />} />
          <Route path="users" element={<UserDashboardUsers />} />
          <Route path="groups" element={<UserDashboardGroups />} />
          <Route path="employees" element={<UserDashboardEmployees />} />
          <Route path="settings" element={<UserDashboardSettings />} />
          <Route path="support" element={<UserDashboardSupport />} />
        </Route>
        {/*
  <Route path="profile" element={<UserProfile />} />
  <Route path="settings" element={<UserSettings />} />
  */}
      </Route>

      <Route path="/" element={<Navigate to="/login/user" replace />} />
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
