import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { NavItem, Sidebar } from '@/components/custom/sidebar.tsx'
import { getEmployeeGroups, getOrganizationGroups } from '@/lib/api.ts'
import { MessageSquare } from 'lucide-react'
import { useEmployee } from '@/hooks/employee.tsx'
import { Header } from '@/components/custom/header'
import { useAuth } from '@/hooks/auth'

export default function EmployeeLayout() {
  const [loading, setLoading] = useState<boolean>(false)
  const [navItems, setNavItems] = useState<NavItem[]>([])
  const { employee } = useEmployee();
  const { handleEmployeeSignOut } = useAuth();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const groups = await getEmployeeGroups(employee.id);
        console.log(groups);
        navItems.length = 0;
        groups.map((group) => {
          const navItem = { to: group.id, icon: <MessageSquare className="h-4 w-4" />, label: group.name };
          navItems.push(navItem);
        })
        setNavItems(navItems);
        console.log(navItems);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, [])

  if (loading) {
    return <div>Loading organization</div>;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar
        title="Iris"
        navItems={navItems}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header handleSignOut={handleEmployeeSignOut} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
