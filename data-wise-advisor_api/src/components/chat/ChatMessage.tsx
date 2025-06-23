import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageProps {
  message: {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  };
  isLoading?: boolean;
}

const ChatMessage = ({ message, isLoading = false }: MessageProps) => {
  const isUser = message.role === "user";
  
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <Card
        className={cn(
          "max-w-[80%] w-fit",
          isUser
            ? "bg-bizoracle-blue text-white"
            : "bg-white border border-gray-200 shadow-sm text-gray-900",
          isLoading && "animate-pulse"
        )}
        style={{ wordBreak: "break-word" }}
      >
        <CardContent className={cn(
          "p-4 text-sm",
          isUser ? "" : "prose prose-sm prose-blue max-w-none"
        )}>
          {isUser ? (
            <span>{message.content}</span>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-2" {...props} />,
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                strong: ({ node, ...props }) => <strong className="text-blue-700 font-semibold" {...props} />,
                h1: ({ node, ...props }) => <h1 className="text-lg font-bold mt-4 mb-2" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-base font-bold mt-3 mb-1" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-base font-semibold mt-2 mb-1" {...props} />,
                p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                code: ({ node, ...props }) => <code className="bg-gray-100 px-1 rounded text-xs" {...props} />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
          <div className={cn("text-xs mt-2 text-right", isUser ? "text-blue-200" : "text-muted-foreground")}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatMessage;
