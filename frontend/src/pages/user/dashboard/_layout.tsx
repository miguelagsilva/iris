import { Outlet, NavLink, Link } from "react-router-dom";

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <NavLink
            to="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Organization name</span>
          </NavLink>
          <NavLink
            to="/user/dashboard"
            className={({ isActive }) =>
              `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Home className="h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <ShoppingCart className="h-5 w-5" />
            Users
            <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
              6
            </Badge>
          </NavLink>
          <NavLink
            to="/groups"
            className={({ isActive }) =>
              `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Package className="h-5 w-5" />
            Groups
          </NavLink>
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Users className="h-5 w-5" />
            Employees
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <LineChart className="h-5 w-5" />
            Settings
          </NavLink>
          <NavLink
            to="/support"
            className={({ isActive }) =>
              `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <CircleHelp className="h-5 w-5" />
            Support
          </NavLink>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function Header() {
  const { handleUserSignOut } = useAuth();

  return (
    <header className="flex h-14 justify-end items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleUserSignOut} >Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

import {
  Briefcase,
  CircleHelp,
  Home,
  IdCard,
  Settings,
  Users,
  CircleUser,
  Sheet,
  Menu,
  Package2,
  ShoppingCart,
  Package,
  LineChart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/auth";
import { signOutUser } from "@/lib/api";

const navItems = [
  { to: "", icon: <Home className="h-4 w-4" />, label: "Dashboard" },
  { to: "users", icon: <IdCard className="h-4 w-4" />, label: "Users" },
  { to: "groups", icon: <Briefcase className="h-4 w-4" />, label: "Groups" },
  { to: "employees", icon: <Users className="h-4 w-4" />, label: "Employees" },
  { to: "settings", icon: <Settings className="h-4 w-4" />, label: "Settings" },
  { to: "support", icon: <CircleHelp className="h-4 w-4" />, label: "Support" },
]

function UserDashboardLayout() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar
        title="My Organization"
        navItems={navItems}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default UserDashboardLayout;