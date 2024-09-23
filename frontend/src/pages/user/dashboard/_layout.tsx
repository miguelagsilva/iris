import { Outlet } from "react-router-dom";

import {
  Briefcase,
  CircleHelp,
  Home,
  IdCard,
  Settings,
  Users,
} from "lucide-react";
import { Sidebar } from "@/components/custom/sidebar";
import { useAuth } from "@/hooks/auth";
import { Header } from "@/components/custom/header";

const navItems = [
  { to: "", icon: <Home className="h-4 w-4" />, label: "Dashboard" },
  { to: "users", icon: <IdCard className="h-4 w-4" />, label: "Users" },
  { to: "groups", icon: <Briefcase className="h-4 w-4" />, label: "Groups" },
  { to: "employees", icon: <Users className="h-4 w-4" />, label: "Employees" },
  { to: "settings", icon: <Settings className="h-4 w-4" />, label: "Settings" },
  { to: "support", icon: <CircleHelp className="h-4 w-4" />, label: "Support" },
]

export default function UserDashboardLayout() {
  const { handleUserSignOut } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        title="Iris"
        navItems={navItems}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header handleSignOut={handleUserSignOut} />
        <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-2 md:px-3 lg:px-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
