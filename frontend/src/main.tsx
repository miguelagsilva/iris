import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserSignIn } from "./pages/user/sign-in";
import "@/index.css";
import NotFound from "./pages/404";
import { UserDashboardGroups } from "./pages/user/dashboard/groups";
import { UserDashboardUsers } from "./pages/user/dashboard/users/index";
import { UserDashboardSettings } from "./pages/user/dashboard/settings";
import { UserDashboardHome } from "./pages/user/dashboard/index";
import UserDashboardLayout from "./pages/user/dashboard/_layout";
import { UserDashboardSupport } from "./pages/user/dashboard/support";
import NoOrganization from "./pages/user/no-organization";
import { UserDashboardUserView } from "./pages/user/dashboard/users/[id]/index";
import { UserDashboardUserEdit } from "./pages/user/dashboard/users/[id]/edit";
import { UserDashboardEmployees } from "./pages/user/dashboard/employees/index";
import { UserDashboardEmployeeNew } from "./pages/user/dashboard/employees/new";
import { UserDashboardEmployeeView } from "./pages/user/dashboard/employees/[id]";
import { UserDashboardEmployeeEdit } from "./pages/user/dashboard/employees/[id]/edit";
import { UserDashboardUserInvite } from "./pages/user/dashboard/users/invite";
import EmployeeLayout from "./pages/employee/chat/_layout";
import { EmployeeChatInterface } from "./pages/employee/chat/[id]";
import AuthProvider from "./providers/auth";
import UserProtectedRoute from "./routes/user-protected";
import EmployeeProtectedRoute from "./routes/employee-protected";
import OrganizationProtectedRoute from "./routes/organization-protected";
import { EmployeeSignIn } from "./pages/employee/sign-in";
import { Toaster } from "./components/ui/toaster";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="employee">
            <Route index element={<Navigate to="sign-in" replace />} />
            <Route path="sign-in" element={<EmployeeSignIn />} />
            <Route element={<EmployeeProtectedRoute />}>
              <Route path="no-organization" element={<NoOrganization />} />
              <Route element={<OrganizationProtectedRoute userType="employee" />}>
                <Route path="chat" element={<EmployeeLayout />} >
                  <Route path=":employeeId">
                    <Route index element={<EmployeeChatInterface />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="user">
            <Route index element={<Navigate to="sign-in" replace />} />
            <Route path="sign-in" element={<UserSignIn />} />
            <Route element={<UserProtectedRoute />}>
              <Route path="no-organization" element={<NoOrganization />} />
              <Route element={<OrganizationProtectedRoute userType="user" />}>
                <Route path="dashboard" element={<UserDashboardLayout />}>
                  <Route index element={<UserDashboardHome />} />
                  <Route path="users">
                    <Route index element={<UserDashboardUsers />} />
                    <Route path="invite" element={<UserDashboardUserInvite />} />
                    <Route path=":userId">
                      <Route index element={<UserDashboardUserView />} />
                      <Route path="edit" element={<UserDashboardUserEdit />} />
                    </Route>
                  </Route>
                  <Route path="groups" element={<UserDashboardGroups />} />
                  <Route path="employees">
                    <Route index element={<UserDashboardEmployees />} />
                    <Route path="new" element={<UserDashboardEmployeeNew />} />
                    <Route path=":employeeId">
                      <Route index element={<UserDashboardEmployeeView />} />
                      <Route path="edit" element={<UserDashboardEmployeeEdit />} />
                    </Route>
                  </Route>
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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
    <Toaster />
  </React.StrictMode>,
);
