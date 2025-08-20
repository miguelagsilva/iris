import React from 'react'
import { NavLink } from 'react-router-dom'
import { Brain, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export type NavItem = {
  to: string
  icon: React.ReactNode
  label: string
}

type SidebarProps = {
  title: string
  navItems: NavItem[]
}

export function Sidebar({ title, navItems }: SidebarProps) {
  const SidebarHeader = () => (
    <div className="flex items-center gap-2 px-4 py-2">
      <Brain className="h-6 w-6" />
      <span className="font-semibold">{title}</span>
    </div>
  )

  const NavContent = () => (
    <nav className="grid items-start gap-2 text-sm font-medium">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === ""}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2
            ${isActive 
              ? "bg-primary text-primary-foreground" 
              : "bg-background text-foreground hover:bg-muted" 
            }
            truncate`
          }
        >
          <span className="flex-shrink-0">{item.icon}</span>
          <span className="truncate">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )

  return (
    <>
      {/* Mobile Sheet */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden fixed top-2 left-2 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80%] max-w-sm p-0">
          <div className="flex flex-col h-full">
            <SidebarHeader />
            <div className="flex-1 overflow-auto px-4 py-2">
              <NavContent />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:block border-r bg-muted/40 w-64">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center lg:h-[60px] lg:px-2">
            <SidebarHeader />
          </div>
          <div className="flex-1 overflow-auto px-4">
            <NavContent />
          </div>
        </div>
      </div>
    </>
  )
}
