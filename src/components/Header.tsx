import React from 'react';
import { Shield, Brain, Sparkles, RefreshCw, Database, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  memoryCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onResetMemory: () => void;
  onSeedMemory: () => void;
  onOpenDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  memoryCount,
  activeTab,
  setActiveTab,
  onResetMemory,
  onSeedMemory,
  onOpenDemo
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 text-slate-100">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-[1.5px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Hindsight Auditor
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  EU AI Act • ISO 42001
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              AI Governance &amp; Compliance Memory Agent • Powered by Vectorize Hindsight
            </p>
          </div>
        </div>

        {/* Global Memory Health & Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Memory Status Pill */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <div className={`w-2 h-2 rounded-full ${memoryCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-xs font-mono text-slate-300">
              Hindsight Memory: <strong className="text-white">{memoryCount}</strong> Retained
            </span>
          </div>

          {/* 60s Demo CTA */}
          <button
            onClick={onOpenDemo}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>60s Demo Story</span>
          </button>

          {/* Quick Memory Seeder / Reset */}
          <div className="flex items-center space-x-1">
            {memoryCount === 0 ? (
              <button
                onClick={onSeedMemory}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
                title="Feed 2-year enterprise audit history into Hindsight"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Feed 2-Yr History</span>
              </button>
            ) : (
              <button
                onClick={onResetMemory}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700/60 hover:border-rose-500/30 transition-colors cursor-pointer"
                title="Wipe Hindsight memory to test cold-start / before state"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Wipe Memory</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto scrollbar-none border-t border-slate-900 text-xs">
        <button
          onClick={() => setActiveTab('demo')}
          className={`py-2.5 px-4 font-medium border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'demo'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Interactive 60s Demo Story</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-500/20 text-cyan-300">Key Story</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`py-2.5 px-4 font-medium border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'chat'
              ? 'border-indigo-400 text-indigo-300 bg-indigo-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4 text-indigo-400" />
          <span>Compliance Agent Chat</span>
        </button>

        <button
          onClick={() => setActiveTab('memory')}
          className={`py-2.5 px-4 font-medium border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'memory'
              ? 'border-purple-400 text-purple-300 bg-purple-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Brain className="w-4 h-4 text-purple-400" />
          <span>Hindsight Memory Inspector</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">{memoryCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('systems')}
          className={`py-2.5 px-4 font-medium border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'systems'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>AI Systems Risk Matrix (6)</span>
        </button>

        <button
          onClick={() => setActiveTab('auditors')}
          className={`py-2.5 px-4 font-medium border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'auditors'
              ? 'border-amber-400 text-amber-300 bg-amber-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Auditor Dossiers &amp; Preferences</span>
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          className={`py-2.5 px-4 font-medium border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'evidence'
              ? 'border-blue-400 text-blue-300 bg-blue-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Evidence Package Vault</span>
        </button>

        <button
          onClick={() => setActiveTab('submission')}
          className={`py-2.5 px-4 font-medium border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'submission'
              ? 'border-rose-400 text-rose-300 bg-rose-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 text-rose-400" />
          <span>Article &amp; Video Deliverables</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500/20 text-rose-300 font-mono">Guide</span>
        </button>
      </div>
    </header>
  );
};
