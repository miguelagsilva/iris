import React from 'react'
import { NavLink } from 'react-router-dom'
import { Brain } from 'lucide-react'

export type NavItem = {
  to: string
  icon: React.ReactNode
  label: string
}

type SidebarProps = {
  title: string
  navItems: NavItem[]
}

export function Sidebar({ 
  title, 
  navItems
}: SidebarProps) {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            <span className="font-semibold">{title}</span>
          </div>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === ""}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    isActive ? "bg-muted text-primary" : "text-muted-foreground"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
