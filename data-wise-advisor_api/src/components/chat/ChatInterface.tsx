import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { geminiService } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      const response = await geminiService.sendMessage(input);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-12">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-bizoracle-blue" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              Ask me anything about your business data
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              I can analyze your data, generate insights, and help you make data-driven decisions for your business.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl">
              <Button 
                variant="outline" 
                className="text-left justify-start h-auto py-3"
                onClick={() => setInput("Show me sales trends over the past 3 months")}
              >
                Show me sales trends over the past 3 months
              </Button>
              <Button 
                variant="outline" 
                className="text-left justify-start h-auto py-3"
                onClick={() => setInput("Who are my top 10 customers by revenue?")}
              >
                Who are my top 10 customers by revenue?
              </Button>
              <Button 
                variant="outline" 
                className="text-left justify-start h-auto py-3"
                onClick={() => setInput("What's my website conversion rate?")}
              >
                What's my website conversion rate?
              </Button>
              <Button 
                variant="outline" 
                className="text-left justify-start h-auto py-3"
                onClick={() => setInput("Analyze my product performance")}
              >
                Analyze my product performance
              </Button>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        {isLoading && <ChatMessage message={{ id: "loading", role: "assistant", content: "Thinking...", timestamp: new Date() }} isLoading={true} />}
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t pt-4 mt-auto">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your business data..."
            className="min-h-16 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
