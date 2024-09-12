import { useEffect, useState } from 'react'
import { ChatSidebar } from '@/components/ui/chat-sidebar'
import { EmployeeChatInterface } from './[id]/index.tsx'
import { Outlet } from 'react-router-dom'
import { NavItem, Sidebar } from '@/components/ui/sidebar.tsx'
import { getOrganizationGroups } from '@/lib/api.ts'
import { useUser } from '@/hooks/user.tsx'
import { MessageSquare } from 'lucide-react'
import { useEmployee } from '@/hooks/employee.tsx'

type ChatBot = {
  id: string
  name: string
  avatar: string
}

const chatBots: ChatBot[] = [
  { id: 'general', name: 'General Assistant', avatar: '🤖' },
  { id: 'code', name: 'Code Helper', avatar: '👨‍💻' },
  { id: 'math', name: 'Math Tutor', avatar: '🧮' },
  { id: 'history', name: 'History Expert', avatar: '📜' },
]

export default function EmployeeLayout() {
  const [selectedBot, setSelectedBot] = useState<ChatBot>(chatBots[0])
  const [navItems, setNavItems] = useState<NavItem[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { employee } = useEmployee();

  const handleBotSelect = (bot: ChatBot) => {
    setSelectedBot(bot)
    setIsSidebarOpen(false)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groups = await getOrganizationGroups(employee.organization.id);
        groups.items.map((group) => {
          const navItem = { to: group.id, icon: <MessageSquare className="h-4 w-4" />, label: group.name };
          navItems.push(navItem);
          setNavItems(navItems);
        })
      } catch (error) {
        console.error(error);
      }
    }
    fetchGroups();
  }, [])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        title={""}
        navItems={navItems}
      />
      <ChatSidebar
        chatBots={chatBots}
        selectedBot={selectedBot}
        onSelectBot={handleBotSelect}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />
      <Outlet />
    </div>
  )
}
