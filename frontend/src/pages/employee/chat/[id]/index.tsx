import { useEffect, useState } from 'react'
import { Send, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useParams } from 'react-router-dom'
import { toast } from '@/components/ui/use-toast'
import { SafeGroupDto } from '@/types/api'
import { getGroupById } from '@/lib/api'

type Message = {
  id: number
  text: string
  sender: 'user' | 'bot'
}

type ChatBot = {
  id: string
  name: string
  avatar: string
}

export function EmployeeChatInterface() {
  const { groupId } = useParams();
  const [group, setGroup] = useState<SafeGroupDto>();
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState<boolean>(false);

  const fetchGroup = async () => {
    if (!groupId) {
      console.error("No group ID provided.");
      toast({
        variant: "destructive",
        title: "An error occurred while fetching the bot",
      });
      return;
    };
    try {
      setLoading(true);
      const group = await getGroupById(groupId);
      setGroup(group);
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  }

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: Message = { id: messages.length + 1, text: input, sender: 'user' }
      setMessages([...messages, newMessage])
      setInput('')
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse: Message = { 
          id: messages.length + 2, 
          text: `I'm the a bot. I can't actually process your request, but I'm here to demonstrate the chat interface!`, 
          sender: 'bot' 
        }
        setMessages(prevMessages => [...prevMessages, botResponse])
      }, 1000)
    }
  }

  useEffect(() => {
    fetchGroup()
  }, [])

  if (loading) {
    return "Loading..."
  }

  return (
    <div className="flex-grow flex flex-col">


      <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chat with {group?.name}</h1>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </div>


      <ScrollArea className="flex-grow p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-lg p-2 max-w-[80%] ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </ScrollArea>


      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex space-x-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask something...`}
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
