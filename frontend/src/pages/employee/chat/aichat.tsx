import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface StreamData {
  content?: string;
  done?: boolean;
  error?: string;
}

const AiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsLoading(true);

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) throw new Error('API URL is not defined');

      eventSourceRef.current = new EventSource(`${apiUrl}/api/v1/ai/stream?prompt=${encodeURIComponent(input)}`);

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      eventSourceRef.current.onmessage = (event: MessageEvent) => {
        const data: StreamData = JSON.parse(event.data);
        if (data.content) {
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage.role === 'assistant') {
              return [
                ...prev.slice(0, -1),
                { ...lastMessage, content: lastMessage.content + data.content },
              ];
            }
            return prev;
          });
        }
        if (data.done) {
          setIsLoading(false);
          eventSourceRef.current?.close();
        }
        if (data.error) {
          console.error('Server error:', data.error);
          setMessages((prev) => [...prev, { role: 'system', content: 'An error occurred. Please try again.' }]);
          setIsLoading(false);
          eventSourceRef.current?.close();
        }
      };

      eventSourceRef.current.onerror = (error: Event) => {
        console.error('EventSource failed:', error);
        setMessages((prev) => [...prev, { role: 'system', content: 'Connection error. Please try again.' }]);
        setIsLoading(false);
        eventSourceRef.current?.close();
      };
    } catch (error) {
      console.error('Failed to establish SSE connection:', error);
      setMessages((prev) => [...prev, { role: 'system', content: 'Failed to connect. Please try again.' }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow p-4 space-y-4">
        <div ref={scrollAreaRef}>
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`rounded-lg p-2 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : message.role === 'system'
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading} size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AiChat;
