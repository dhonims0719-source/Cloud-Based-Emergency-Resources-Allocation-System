import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  RotateCcw,
  Shield,
  Flame,
  AlertTriangle,
  Building2,
  Truck,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import { useEmergency } from '@/src/context/EmergencyContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIAssistantView: React.FC = () => {
  const { incidents, teams, resources, hospitals, shelters } = useEmergency();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: `Hello Commander. I am your **Tactical AI Emergency Assistant** integrated directly into the Metro Resource Allocation System.\n\nI can assist you with:\n- **Surge Resource Allocation** models for complex Multi-Casualty Incidents (MCI)\n- **Secondary Hazard & Plume Modeling** (chemical toxicity, collapse radius, flash fires)\n- **Hospital Trauma Bed & ICU Optimization** routing plans\n- **Mass Civilian Evacuation Corridors** and safe assembly zones\n\nSelect a tactical prompt below or describe an active scenario:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Recommend full allocation for a 6-alarm high-rise fire with 18 trapped casualties',
    'Calculate emergency hospital surge distribution for 25 severe smoke inhalation cases',
    'Analyze secondary hazards and evacuation perimeter for an industrial chemical gas leak',
    'Generate an emergency civilian evacuation broadcast alert for Sector 4 Flood zone',
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          context: {
            activeIncidentsCount: incidents.filter((i) => i.status !== 'Resolved').length,
            availableTeamsCount: teams.filter((t) => t.status === 'Available').length,
            availableAmbulances: resources
              .filter((r) => r.category === 'Ambulance')
              .reduce((a, b) => a + b.availableCount, 0),
            availableHospitalBeds: hospitals.reduce((a, b) => a + b.availableBeds, 0),
            availableShelterCapacity: shelters.reduce((a, b) => a + b.availableCapacity, 0),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const replyText =
        data.reply ||
        'Tactical AI recommendation generated. Maintain standard ICS protocols and prioritize life safety.';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      // Fallback heuristics response
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'assistant',
        text: `### 🚨 Tactical Advisory (Offline Fallback Engine)\n\n**Operational Recommendation for:** "${query}"\n\n1. **Incident Command System (ICS):** Establish Unified Command post 500m upwind from the perimeter.\n2. **Resource Dispatch Priority:** Mobilize 2 Urban Search & Rescue teams, 4 Advanced Life Support (ALS) ambulances, and 2 Aerial Platform Fire Engines.\n3. **Hospital Surge Protocol:** Alert Memorial General (Level-1 Trauma) and St. Jude Trauma Center to prepare MCI receiving bays.\n4. **Evacuation Safety:** Establish a 400m exclusion perimeter and route displaced residents to Civic Center Arena Shelter.\n\n*All units must maintain tactical channel Bravo-4.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 pb-12 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini AI Tactical Decision Support</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            AI Operations Advisor
          </h2>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'msg-0',
                sender: 'assistant',
                text: 'Chat history reset. How can I assist field operations, Commander?',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Session</span>
        </button>
      </div>

      {/* Chat messages viewport */}
      <div className="flex-1 overflow-y-auto glass-card rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 space-y-4 shadow-xl">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-rose-600 text-white'
                    : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 relative group ${
                  isUser
                    ? 'bg-rose-600 text-white rounded-tr-xs'
                    : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-tl-xs shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-70 pb-1 border-b border-black/10 dark:border-white/10">
                  <span className="font-semibold">{isUser ? 'Incident Commander' : 'Tactical AI Advisor'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap font-sans text-xs">
                  {msg.text}
                </div>

                {!isUser && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Advisory</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-tl-xs text-xs flex items-center gap-2 text-slate-500">
              <Sparkles className="w-4 h-4 text-purple-500 animate-spin" />
              <span>Analyzing live incident geometry and generating tactical dispatch briefing...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 shrink-0">
        <span className="text-[11px] font-bold text-slate-400 shrink-0">Suggestions:</span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp)}
            className="px-3 py-1.5 rounded-xl text-[11px] font-medium whitespace-nowrap bg-white/70 dark:bg-slate-800/70 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-purple-300 transition shrink-0"
          >
            {qp.slice(0, 48)}...
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask tactical question (e.g. 'How many burn beds are open?' or 'What is the hazmat perimeter?')..."
          className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs shadow-xs focus:ring-2 focus:ring-purple-500 outline-hidden"
        />
        <button
          type="submit"
          disabled={isLoading || !inputPrompt.trim()}
          className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send Query</span>
        </button>
      </form>
    </div>
  );
};
