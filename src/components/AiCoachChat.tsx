import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  Bot,
  RefreshCw,
  Lightbulb,
  Zap,
  Heart,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { UserProfile } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AiCoachChatProps {
  user: UserProfile;
  onOpenSessionByName?: (title: string) => void;
}

export const AiCoachChat: React.FC<AiCoachChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Hello ${user.name.split(' ')[0]}! I am your ZenFit AI Coach. I can help tailor today's movement to your energy level, explain pose alignment, suggest modifications for joints or injuries, and build customized recovery protocols. How is your body feeling right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'My lower back is stiff from sitting all day',
    'I only have 15 minutes for an energizing burn',
    'How do I modify Downward Dog for wrist sensitivity?',
    'What should I eat before morning vinyasa flow?',
    'Guide me through an evening restorative wind-down',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const res = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history,
          userProfile: {
            name: user?.name || 'Practitioner',
            goal: user?.fitnessGoal || user?.preferences?.goal || 'Flexibility & Posture',
            level: user?.experienceLevel || user?.preferences?.experienceLevel || 'Intermediate',
            preferredTime: user?.preferences?.availableTimeMinutes || 30,
          },
        }),
      });

      const data = await res.json();
      const replyText =
        data.reply ||
        "I'm here to support your practice. Focus on smooth, even diaphragmatic breathing and honor your body's limits today.";

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('AI Coach Chat Error:', err);
      const fallbackMsg: Message = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: "I'm temporarily experiencing connection delays, but here is a quick tip: Listen to your joints. If you feel pinching or numbness, back off to Child's Pose and focus on slow exhales.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-8 shadow-xl overflow-hidden border border-emerald-800/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Movement & Biomechanics Specialist</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
            ZenFit AI Coach
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-300">
            Real-time anatomical guidance, pose modifications, routine recommendations, and mindful recovery advice.
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm flex flex-col h-[600px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-stone-800 text-white'
                      : 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-stone-900 text-white rounded-tr-none'
                      : 'bg-stone-50 border border-stone-200/70 text-stone-800 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      isUser ? 'text-stone-400 text-right' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 ring-1 ring-emerald-300">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-stone-50 border border-stone-200/70 rounded-2xl rounded-tl-none p-3.5 text-xs text-stone-500 flex items-center space-x-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                <span>Coach is formulating tailored anatomical guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-stone-50 border-t border-stone-100 overflow-x-auto scrollbar-none flex items-center space-x-2">
          <span className="text-[11px] font-semibold text-stone-400 flex items-center space-x-1 whitespace-nowrap">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            <span>Try asking:</span>
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="px-3 py-1 rounded-xl bg-white border border-stone-200/80 text-stone-700 text-xs whitespace-nowrap hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-900 transition-colors disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask about poses, modifications, soreness, or workout ideas..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white disabled:opacity-40 transition-colors shadow-sm"
              title="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
