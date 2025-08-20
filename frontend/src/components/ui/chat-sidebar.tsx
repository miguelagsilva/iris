import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

type ChatBot = {
  id: string
  name: string
  avatar: string
}

type ChatSidebarProps = {
  chatBots: ChatBot[]
  selectedBot: ChatBot
  onSelectBot: (bot: ChatBot) => void
  isSidebarOpen: boolean
  onCloseSidebar: () => void
}

export function ChatSidebar({ chatBots, selectedBot, onSelectBot, isSidebarOpen, onCloseSidebar }: ChatSidebarProps) {
  return (
    <div className={`bg-secondary text-secondary-foreground w-64 flex-shrink-0 ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Choose a Chat Bot</h2>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onCloseSidebar}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        {chatBots.map((bot) => (
          <button
            key={bot.id}
            onClick={() => onSelectBot(bot)}
            className={`w-full text-left p-2 rounded mb-2 flex items-center ${
              selectedBot.id === bot.id ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'
            }`}
          >
            <span className="mr-2 text-2xl">{bot.avatar}</span>
            {bot.name}
          </button>
        ))}
      </div>
    </div>
  )
}
