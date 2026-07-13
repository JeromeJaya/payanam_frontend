import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import api from "../api/axios";

const SUGGESTED_QUESTIONS = [
  "How many users do we have?",
  "What's the total revenue?",
  "Show recent bookings",
  "How many vendors pending approval?",
  "Bus vs flight revenue?",
  "Which service has more bookings?",
  "This month's performance?",
];

export default function AdminChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant for the Payanam admin dashboard. I can help you with questions about users, vendors, bookings, revenue, and more. What would you like to know?",
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
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || loading) return;

    const userMessage = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/api/v1/ai/admin-chat", {
        message: messageText,
      });

      if (response.data.success) {
        const assistantMessage = {
          role: "assistant",
          content: response.data.content,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
        ]);
      }
    } catch (error) {
      console.error("Admin AI chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error.response?.data?.error || "Sorry, I'm having trouble connecting. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestedQuestion = (question) => {
    sendMessage(question);
  };

  const formatMessage = (content) => {
    // Parse markdown-like formatting into React elements
    const renderInline = (text, keyPrefix) => {
      const parts = [];
      // Split by **bold** patterns
      const boldRegex = /\*\*(.+?)\*\*/g;
      let lastIndex = 0;
      let match;
      let partIndex = 0;

      while ((match = boldRegex.exec(text)) !== null) {
        // Add text before the bold match
        if (match.index > lastIndex) {
          parts.push(<span key={`${keyPrefix}-${partIndex++}`}>{text.slice(lastIndex, match.index)}</span>);
        }
        // Add the bold text
        parts.push(<strong key={`${keyPrefix}-${partIndex++}`} className="font-semibold">{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
      }
      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(<span key={`${keyPrefix}-${partIndex++}`}>{text.slice(lastIndex)}</span>);
      }
      return parts.length > 0 ? parts : <span>{text}</span>;
    };

    return content.split("\n").map((line, i) => {
      // Handle headings (## or ###)
      if (/^#{1,3}\s/.test(line)) {
        const text = line.replace(/^#{1,3}\s/, "");
        return <div key={i} className="font-bold text-base mt-2 mb-1">{renderInline(text, `h-${i}`)}</div>;
      }
      // Handle bullet points
      if (line.startsWith("- ") || line.startsWith("• ")) {
        return (
          <div key={i} className="flex gap-2 ml-2">
            <span className="text-indigo-400">•</span>
            <span>{renderInline(line.slice(2), `b-${i}`)}</span>
          </div>
        );
      }
      // Handle numbered lists
      if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+)\.\s(.*)$/);
        if (match) {
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span className="text-indigo-400 font-medium">{match[1]}.</span>
              <span>{renderInline(match[2], `n-${i}`)}</span>
            </div>
          );
        }
      }
      // Handle empty lines
      if (line.trim() === "") {
        return <br key={i} />;
      }
      // Regular text with inline formatting
      return <span key={i}>{renderInline(line, `l-${i}`)}<br /></span>;
    });
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-slate-700 hover:bg-slate-600 rotate-0"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105"
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6 text-white" />
            <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white">Admin AI Assistant</h3>
              <p className="text-xs text-white/70">Ask about users, vendors, bookings & more</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "user"
                      ? "bg-indigo-100 dark:bg-indigo-900/50"
                      : "bg-gradient-to-br from-indigo-500 to-purple-500"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-sm"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                  }`}
                >
                  {msg.role === "user" ? msg.content : formatMessage(msg.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedQuestion(q)}
                    disabled={loading}
                    className="text-xs px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-slate-200 dark:border-slate-700 p-4 flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your platform..."
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
