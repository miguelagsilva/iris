import { Navigate } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserSignIn } from "./pages/user/user-sign-in";
import "@/index.css";
import UserProtectedRoute from "./routes/user-protected-route";
import NotFound from "./pages/NotFound";
import { UserDashboardGroups } from "./pages/user/dashboard/groups";
import { UserDashboardUsers } from "./pages/user/dashboard/users/users";
import { UserDashboardEmployees } from "./pages/user/dashboard/employees";
import { UserDashboardSettings } from "./pages/user/dashboard/settings";
import { UserDashboardHome } from "./pages/user/dashboard/home";
import UserDashboardLayout from "./pages/user/dashboard/layout";
import { UserDashboardSupport } from "./pages/user/dashboard/support";
import AuthProvider from "./providers/AuthProvider";
import NoOrganization from "./pages/user/NoOrganization";
import OrganizationProtectedRoute from "./routes/organization-protected-route";
import { UserDashboardUserNew } from "./pages/user/dashboard/users/new";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route errorElement={<NotFound />}>
            <Route path="user">
              <Route path="sign-in" element={<UserSignIn />} />
              <Route element={<UserProtectedRoute />}>
                <Route path="no-organization" element={<NoOrganization />} />
                <Route element={<OrganizationProtectedRoute userType="user" />}>
                  <Route path="dashboard" element={<UserDashboardLayout />}>
                    <Route index element={<UserDashboardHome />} />
                    <Route path="users">
                      <Route index element={<UserDashboardUsers />} />
                      <Route path="new" element={<UserDashboardUserNew />} />
                      <Route
                        path=":userId"
                        loader={({ params }) => {
                          return console.log(params.userId);
                        }}
                      />
                      ;
                    </Route>
                    <Route path="groups" element={<UserDashboardGroups />} />
                    <Route
                      path="employees"
                      element={<UserDashboardEmployees />}
                    />
                    <Route
                      path="settings"
                      element={<UserDashboardSettings />}
                    />
                    <Route path="support" element={<UserDashboardSupport />} />
                  </Route>
                </Route>
                {/*
  <Route path="profile" element={<UserProfile />} />
  <Route path="settings" element={<UserSettings />} />
  */}
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/user/sign-in" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
