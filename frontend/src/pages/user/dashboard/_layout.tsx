import { Outlet } from "react-router-dom";

import {
  Briefcase,
  CircleHelp,
  Home,
  IdCard,
  Settings,
  Users,
} from "lucide-react";
import { Sidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/auth";
import { Header } from "@/components/ui/header";

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
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar
        title="My Organization"
        navItems={navItems}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header handleSignOut={handleUserSignOut} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
