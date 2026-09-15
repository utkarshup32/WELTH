"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Bot,
  Send,
  X,
  User,
  Trash2,
  FileText,
  TrendingUp,
  CreditCard,
  Target,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SUGGESTED_PROMPTS = [
  {
    icon: CreditCard,
    label: "Total account balances",
    text: "What is my total balance across all accounts?",
  },
  {
    icon: Target,
    label: "Budget checkup",
    text: "How am I doing on my monthly budget?",
  },
  {
    icon: TrendingUp,
    label: "Top expenses",
    text: "What were my top expense categories recently?",
  },
  {
    icon: FileText,
    label: "Search documents",
    text: "Search my uploaded bank statements and documents for any fee deductions.",
  },
];

export function AiCopilotDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi! I'm **WELTH AI**, your AI Financial Copilot. Ask me anything about your balances, spending habits, budget, or uploaded financial documents!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input.trim();
    if (!text || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          messages: newMessages
            .filter((m) => m.id !== "welcome")
            .map((m) => ({
              role: m.role,
              content: m.content,
            })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to reach WELTH AI server");
      }

      const data = await res.json();
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.content,
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: `⚠️ Sorry, I encountered an issue: ${err.message}. Please try again!`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Chat reset! Ask me anything about your finances or search through your uploaded documents.",
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="relative group h-14 px-5 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2.5 transition-all duration-300 hover:scale-105 border border-white/20"
        >
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <Bot className="h-6 w-6 animate-pulse" />
          <span className="font-semibold text-sm tracking-wide hidden sm:inline">
            Ask WELTH AI
          </span>
          <Sparkles className="h-4 w-4 text-amber-300" />
        </Button>
      </div>

      {/* Slide-out Backdrop and Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Backdrop Click Dismiss */}
          <div className="flex-1" onClick={() => setIsOpen(false)} />

          {/* Drawer Container */}
          <div className="w-full max-w-lg bg-background h-full shadow-2xl flex flex-col border-l border-border animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-muted/40">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground">WELTH AI</h3>
                    <Badge
                      variant="secondary"
                      className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none px-1.5 py-0"
                    >
                      AI Copilot
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Connected to live accounts & documents
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  title="Clear conversation"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2`}>
                    <div
                      className={`p-3.5 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-none shadow-md"
                          : "bg-muted/70 text-foreground border rounded-bl-none shadow-sm"
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed space-y-1.5">
                        {msg.content}
                      </div>
                    </div>

                    {/* Sources Badge if RAG used */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <FileText className="h-3 w-3" /> Sources:
                        </span>
                        {msg.sources.map((source, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-[10px] py-0 px-2 bg-background/80"
                          >
                            {source.filename} ({source.similarity})
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shrink-0">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="bg-muted/70 border p-3 rounded-2xl rounded-bl-none flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Analyzing your finances and documents...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Prompt Suggestions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-[11px] text-muted-foreground mb-1.5 font-medium">
                  Quick suggestions:
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {SUGGESTED_PROMPTS.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSend(item.text)}
                        className="text-left p-2 rounded-lg border bg-card hover:bg-accent/50 text-xs transition-colors flex items-center gap-2 group"
                      >
                        <Icon className="h-3.5 w-3.5 text-blue-500 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-4 border-t bg-background">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask WELTH AI about balances, spending, or documents..."
                  className="flex-1 bg-muted/50 border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || loading}
                  className="h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shrink-0 transition-transform active:scale-95"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-[10px] text-center text-muted-foreground mt-2">
                WELTH AI is grounded in your real-time WELTH transactions &
                uploaded files.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
