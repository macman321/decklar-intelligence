"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Bot,
  Send,
  User,
  X,
  Sparkles,
  Loader2,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface GavinChatProps {
  customerId?: string;
  customerName?: string;
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_PROMPTS = [
  "What's the health status?",
  "Summarize recent calls",
  "Any open items?",
  "Suggest next steps",
];

export function GavinChat({ customerId, customerName, isOpen, onClose }: GavinChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: customerName
        ? `Hi! I'm Gavin. I can help you with ${customerName}'s account — health status, open items, call summaries, or next steps.`
        : "Hi! I'm Gavin, your Decklar AI assistant. Ask me about any customer, or how to onboard a new account.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          customerId,
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: data.reply || "I'm not sure how to respond to that.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now. Try again in a moment.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col sm:max-w-md border-l border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.95)] backdrop-blur-xl">
        <SheetHeader className="border-b border-[rgba(96,56,251,0.15)] pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#6038FB] to-[#7B5CFF] shadow-[0_0_15px_rgba(96,56,251,0.4)]">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <SheetTitle className="text-base text-white">Gavin AI</SheetTitle>
              {customerName && (
                <Badge variant="outline" className="text-xs border-[rgba(96,56,251,0.3)] text-[#7B5CFF]">{customerName}</Badge>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden py-3">
          <ScrollArea className="h-full" ref={scrollRef}>
            <div className="space-y-4 px-1">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback
                      className={
                        msg.role === "user"
                          ? "bg-[rgba(255,255,255,0.1)] text-white text-xs"
                          : "bg-gradient-to-br from-[#6038FB] to-[#7B5CFF] text-white text-xs"
                      }
                    >
                      {msg.role === "user" ? (
                        <User className="h-3 w-3" />
                      ) : (
                        <Bot className="h-3 w-3" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-[#6038FB] text-white"
                        : "bg-[rgba(19,22,32,0.8)] border border-[rgba(96,56,251,0.2)] text-white"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-[#6038FB] to-[#7B5CFF] text-white text-xs">
                      <Bot className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1 rounded-lg bg-[rgba(19,22,32,0.8)] border border-[rgba(96,56,251,0.15)] px-3 py-2 text-sm text-[rgba(255,255,255,0.5)]">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Quick prompts */}
        {messages.length <= 2 && (
          <div className="flex flex-wrap gap-2 pb-2">
            {QUICK_PROMPTS.map((prompt) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                className="text-xs border-[rgba(96,56,251,0.2)] text-[rgba(255,255,255,0.7)] hover:border-[rgba(96,56,251,0.4)] hover:text-white hover:bg-[rgba(96,56,251,0.1)]"
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
              >
                <Sparkles className="mr-1 h-3 w-3 text-[#7B5CFF]" />
                {prompt}
              </Button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-[rgba(96,56,251,0.15)] pt-3">
          <Input
            placeholder="Ask Gavin..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] text-white placeholder:text-[rgba(255,255,255,0.4)]"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-[#6038FB] text-white hover:bg-[#7B5CFF]">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function GavinChatButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-gradient-to-br from-[#6038FB] to-[#7B5CFF] shadow-[0_0_30px_rgba(96,56,251,0.5)] hover:shadow-[0_0_40px_rgba(96,56,251,0.7)]"
      size="icon"
    >
      <MessageSquare className="h-5 w-5 text-white" />
    </Button>
  );
}
