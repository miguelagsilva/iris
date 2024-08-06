import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import { ErrorPage } from "./pages/dashboard/Error-page";
import DashboardLayout from "./pages/dashboard/_layout";
import Settings from "./pages/dashboard/Settings";
import Profile from "./pages/dashboard/Profile";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<DashboardLayout />} errorElement={<ErrorPage />}>
      <Route index element={<Dashboard />} />
      <Route path="settings" element={<Settings />} />
      <Route path="profile" element={<Profile />} />
    </Route>
  )
);

function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;
