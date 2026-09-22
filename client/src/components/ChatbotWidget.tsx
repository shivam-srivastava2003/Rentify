import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  Minus
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isError?: boolean;
}

const ChatbotWidget: React.FC = () => {
  const { currentUser, role, isAuthenticated } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine user role string for Make.com webhook: "renter" | "owner" | "admin" | "guest"
  const userRoleString = !isAuthenticated
    ? 'guest'
    : role === 'USER'
    ? 'renter'
    : role === 'OWNER'
    ? 'owner'
    : role === 'ADMIN'
    ? 'admin'
    : 'guest';

  // Initialize Session ID & Initial Greeting Message
  useEffect(() => {
    let existingSession = sessionStorage.getItem('rentify_ai_session_id');
    if (!existingSession) {
      existingSession = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      sessionStorage.setItem('rentify_ai_session_id', existingSession);
    }
    setSessionId(existingSession);

    // Initial role-aware greeting
    let greeting = '';
    if (isAuthenticated && currentUser) {
      if (role === 'USER') {
        greeting = `Hi ${currentUser.name}! I'm your Rentify AI assistant. Looking for a room, PG, or flat? Ask me anything!`;
      } else if (role === 'OWNER') {
        greeting = `Hello ${currentUser.name}! I'm your Rentify AI assistant. Need help managing your properties, room availability, or tenant inquiries? Ask away!`;
      } else {
        greeting = `Welcome Admin ${currentUser.name}! How can I assist you with system management today?`;
      }
    } else {
      greeting = `Hello! Welcome to Rentify. Ask me anything about finding rooms, PGs, zero-brokerage deals, or listing your property!`;
    }

    setMessages([
      {
        id: 'welcome_1',
        sender: 'ai',
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [isAuthenticated, currentUser, role]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputMessage).trim();
    if (!messageText || loading) return;

    const userMsgId = 'msg_' + Date.now();
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    // Prepare exact JSON payload requested by user
    const payload = {
      userID: currentUser?._id || 'guest',
      role: userRoleString,
      message: messageText,
      sessionId: sessionId,
      userName: currentUser?.name || 'Guest Visitor',
      userEmail: currentUser?.email || '',
    };

    try {
      // Send HTTP POST request to backend chat webhook proxy
      const response = await axios.post('/chat/webhook', payload, {
        timeout: 25000,
      });

      let aiReplyText = '';

      if (response.data && response.data.reply) {
        aiReplyText = response.data.reply;
      } else if (typeof response.data === 'string') {
        aiReplyText = response.data;
      } else {
        aiReplyText = 'Thank you for your inquiry! Your request has been processed.';
      }

      const aiMessage: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('Make.com webhook error:', err);

      let errorMsgText = 'Unable to connect to Make.com AI webhook.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMsgText = err.response.data.message;
      } else if (err.code === 'ECONNABORTED') {
        errorMsgText = 'The request timed out. Please try again.';
      }

      const errorMessage: ChatMessage = {
        id: 'msg_err_' + Date.now(),
        sender: 'ai',
        text: errorMsgText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Role-aware suggestion chips
  const getSuggestionChips = () => {
    if (userRoleString === 'renter') {
      return [
        'Find a PG in Noida under 10000',
        'Single room in HSR Layout',
        'How zero brokerage works?',
      ];
    } else if (userRoleString === 'owner') {
      return [
        'How to list a new property?',
        'Tips to fill vacant rooms faster',
        'How tenants contact me?',
      ];
    }
    return [
      'Find PGs in Bengaluru',
      'How to register as owner?',
      'Rooms under 8000',
    ];
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end max-w-[calc(100vw-32px)]">
      {/* CHAT CONTAINER POPUP WIDGET */}
      {isOpen && (
        <div className="w-[calc(100vw-32px)] sm:w-[380px] md:w-[400px] h-[min(480px,68vh)] sm:h-[520px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* HEADER BAR */}
          <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-950 p-3 sm:p-4 text-white flex items-center justify-between border-b border-slate-800/80 shadow-md shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold shadow-xs">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
              </div>

              <div className="min-w-0">
                <h3 className="font-extrabold text-xs sm:text-sm flex items-center gap-1.5 leading-tight truncate">
                  <span className="truncate">Rentify AI Assistant</span>
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                </h3>
                <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-teal-200 mt-0.5 font-medium">
                  <span className="uppercase font-extrabold tracking-wider px-1.5 py-0.2 rounded bg-teal-600/60 text-white shrink-0">
                    {userRoleString}
                  </span>
                  <span>• Online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 sm:p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                title="Minimize Chat"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 sm:p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MESSAGES & CHAT INTERFACE */}
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-950">
            {/* MESSAGES LIST */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] sm:max-w-[85%] p-3 sm:p-3.5 rounded-2xl text-[11px] sm:text-xs leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-br-none'
                        : msg.isError
                        ? 'bg-rose-950/80 border border-rose-800 text-rose-200 rounded-bl-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* TYPING INDICATOR */}
              {loading && (
                <div className="flex flex-col items-start">
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1">Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* QUICK SUGGESTIONS CHIPS */}
            <div className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-900/90 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {getSuggestionChips().map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="whitespace-nowrap bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-300 text-[9px] sm:text-[10px] font-semibold px-2.5 py-1 rounded-full border border-slate-700 transition-all shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* INPUT FORM BAR */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-2.5 sm:p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask AI (${userRoleString})...`}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-0"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white p-2 sm:p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTON (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-500 hover:to-teal-700 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-center transition-all transform hover:scale-105 shrink-0"
        title="Open Rentify AI Assistant"
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 fill-amber-300 animate-pulse" />
          </div>
        )}

        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950 animate-ping"></span>
        )}
      </button>
    </div>
  );
};

export default ChatbotWidget;
