import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, Sparkles, MessageCircle, Package, ShoppingCart, BarChart, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';

const quickSuggestions = [
  { label: "How to add a product?", icon: Package, category: "products" },
  { label: "Process a sale", icon: ShoppingCart, category: "pos" },
  { label: "View sales reports", icon: BarChart, category: "analytics" },
  { label: "Manage low stock alerts", icon: Package, category: "inventory" },
  { label: "Refund a transaction", icon: ShoppingCart, category: "sales" },
  { label: "Export data to CSV", icon: BarChart, category: "data" },
];

export default function Help() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    initConversation();
    
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initConversation = async () => {
    try {
      const conv = await base44.agents.createConversation({
        agent_name: "inventory_assistant",
        metadata: {
          name: "Help Chat",
          description: "AI Assistant for Inventory Management"
        }
      });
      setConversation(conv);
      
      // Subscribe to updates
      unsubscribeRef.current = base44.agents.subscribeToConversation(conv.id, (data) => {
        setMessages(data.messages || []);
        setSending(false);
      });
    } catch (error) {
      console.error("Error initializing conversation:", error);
      setSending(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim() || !conversation || sending) return;
    
    setSending(true);
    try {
      await base44.agents.addMessage(conversation, {
        role: "user",
        content: text
      });
      setInput('');
    } catch (error) {
      console.error("Error sending message:", error);
      setSending(false);
    }
  };

  const handleQuickSuggestion = (suggestion) => {
    sendMessage(suggestion.label);
  };

  return (
    <div className="p-4 md:p-8 h-[calc(100vh-5rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Help & Support</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Get instant help from our AI assistant
        </p>
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Quick Suggestions */}
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Sparkles className="w-5 h-5" />
              Quick Help
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {quickSuggestions.map((suggestion, idx) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleQuickSuggestion(suggestion)}
                    disabled={sending}
                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {suggestion.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Need more help?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Type your question in the chat or explore our tutorial section
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Section */}
        <Card className="lg:col-span-2 flex flex-col border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              AI Assistant
              <Badge variant="outline" className="ml-auto bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                {conversation ? 'Online' : 'Connecting...'}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Welcome to Help Center
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Ask me anything about managing your inventory, processing sales, or using the system features
                  </p>
                </div>
              ) : (
                messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        <ReactMarkdown className="text-sm prose prose-sm dark:prose-invert max-w-none">
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </div>
                    )}
                  </div>
                ))
              )}
              {sending && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex gap-3"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  disabled={sending || !conversation}
                  className="flex-1 dark:bg-gray-800 dark:border-gray-700"
                />
                <Button
                  type="submit"
                  disabled={sending || !input.trim() || !conversation}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}