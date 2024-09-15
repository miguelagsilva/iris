import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Brain, Menu, X } from 'lucide-react'

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavContent = () => (
    <>
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <div className="flex items-center gap-2 truncate">
          <Brain className="h-6 w-6 flex-shrink-0" />
          <span className="font-semibold truncate">{title}</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ""}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  isActive ? "bg-muted text-primary" : "text-muted-foreground"
                } truncate`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 bg-background rounded-md"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background md:hidden">
          <div className="flex h-full flex-col">
            <NavContent />
          </div>
        </div>
      )}
      <div className="hidden border-r bg-muted/40 md:block max-w-xs">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <NavContent />
        </div>
      </div>
    </>
  )
}
