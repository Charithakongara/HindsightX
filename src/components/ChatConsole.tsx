import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, Sparkles, AlertTriangle, ShieldCheck, Database, FileText, ChevronRight, RefreshCw, Zap } from 'lucide-react';
import { askAgent } from '../services/agentEngine';
import { hindsight } from '../services/hindsightClient';
import { ChatMessage, EvidencePackage } from '../types';

interface ChatConsoleProps {
  onViewEvidence: (pack: EvidencePackage) => void;
  onOpenInspector: () => void;
}

export const ChatConsole: React.FC<ChatConsoleProps> = ({ onViewEvidence, onOpenInspector }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [memoryMode, setMemoryMode] = useState<'USE_HINDSIGHT' | 'FORCE_NO_MEMORY'>('USE_HINDSIGHT');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialPrompts = [
    "Are we ready for next week's audit on Apex-CreditScorer?",
    "What did Dr. Elena Vance reject during our last audit?",
    "Which high-risk models have overdue remediations or departed owners?",
    "Show testing staleness across our EU AI Act high-risk models",
    "Generate the raw JSON evidence pack for Dr. Vance's audit",
    "What evidence format did Marcus Thorne accept for FraudGuard?"
  ];

  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        id: 'msg_welcome',
        sender: 'agent',
        text: `Welcome to **Hindsight Auditor**. I am your organization's AI governance memory agent.

I retain our historical supervisory audits, open non-conformities, remediation deadlines, and specific auditor preferences across the **EU AI Act**, **ISO/IEC 42001**, and **NIST AI RMF**.

Try asking a question below, or test the difference between memory-augmented and stateless reasoning using the toggle above.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasMemoryRecall: false
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const response = await askAgent(textToSend, memoryMode);
      setMessages((prev) => [...prev, response]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'agent',
          text: 'An error occurred while synthesizing compliance history. Please verify connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Mode Bar & Quick Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex items-center space-x-3">
          <span className="text-slate-400 font-medium">Memory Mode:</span>
          <div className="inline-flex p-0.5 rounded-lg bg-slate-950 border border-slate-800">
            <button
              onClick={() => setMemoryMode('USE_HINDSIGHT')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                memoryMode === 'USE_HINDSIGHT'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hindsight Memory Active ({hindsight.getMemoryCount()})
            </button>
            <button
              onClick={() => setMemoryMode('FORCE_NO_MEMORY')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                memoryMode === 'FORCE_NO_MEMORY'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Stateless (Zero Memory)
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenInspector}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
          >
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>Open Memory Inspector</span>
          </button>
          <button
            onClick={() => setMessages([])}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-6 min-h-[480px] max-h-[600px] overflow-y-auto space-y-4 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Header info */}
            <div className="flex items-center space-x-2 mb-1 px-1">
              <span className="text-[11px] font-semibold text-slate-400">
                {msg.sender === 'user' ? 'Compliance Lead' : 'Hindsight Auditor'}
              </span>
              <span className="text-[10px] text-slate-600">{msg.timestamp}</span>
              {msg.hasMemoryRecall && (
                <span className="inline-flex items-center space-x-1 px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  <Brain className="w-2.5 h-2.5" />
                  <span>Memory Recalled ({msg.recalledMemories?.length || 0})</span>
                </span>
              )}
              {msg.mode === 'BEFORE_MEMORY' && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Stateless Mode
                </span>
              )}
            </div>

            {/* Bubble */}
            <div
              className={`p-4 rounded-2xl text-xs max-w-2xl leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-slate-800 to-indigo-950 border border-indigo-500/30 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md space-y-3'
              }`}
            >
              <div className="whitespace-pre-wrap prose prose-invert prose-xs max-w-none text-slate-200">
                {msg.text}
              </div>

              {/* Recalled Memory Badges in Bubble */}
              {msg.recalledMemories && msg.recalledMemories.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                    Recalled Hindsight Memory Traces:
                  </span>
                  <div className="space-y-1">
                    {msg.recalledMemories.slice(0, 3).map((mem) => (
                      <div
                        key={mem.id}
                        className="text-[10px] p-1.5 rounded bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center justify-between"
                      >
                        <span className="truncate pr-2">{mem.content.substring(0, 85)}...</span>
                        <span className="text-cyan-400 shrink-0 font-mono">
                          {((mem.similarityScore || 0.85) * 100).toFixed(0)}% Match
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attached Evidence Package CTA */}
              {msg.evidencePackage && (
                <div className="mt-3 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {msg.evidencePackage.title}
                      </div>
                      <span className="text-[10px] text-cyan-300/80">
                        Formatted for {msg.evidencePackage.targetAuditor}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onViewEvidence(msg.evidencePackage!)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Inspect Package</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 p-2 animate-pulse">
            <Brain className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Recalling audit history and synthesizing regulatory guidance...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-1.5">
        <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-mono">
          <Zap className="w-3 h-3 text-cyan-400" />
          <span>Suggested Inquiries:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {initialPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors text-left cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about audit readiness, past findings, auditor preferences, or evidence requirements..."
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 placeholder-slate-500 text-xs rounded-xl px-4 py-3 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
