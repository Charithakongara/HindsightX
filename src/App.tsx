import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DemoStoryWalkthrough } from './components/DemoStoryWalkthrough';
import { ChatConsole } from './components/ChatConsole';
import { MemoryInspector } from './components/MemoryInspector';
import { SystemsInventory } from './components/SystemsInventory';
import { AuditorDossier } from './components/AuditorDossier';
import { EvidenceVault } from './components/EvidenceVault';
import { SubmissionKit } from './components/SubmissionKit';
import { ArchitectureModal } from './components/ArchitectureModal';
import { hindsight } from './services/hindsightClient';
import { AISystem, AuditorProfile, EvidencePackage } from './types';
import { ExternalLink, Layers, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('demo');
  const [memoryCount, setMemoryCount] = useState<number>(hindsight.getMemoryCount());
  const [activeEvidencePack, setActiveEvidencePack] = useState<EvidencePackage | null>(null);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsub = hindsight.subscribe(() => {
      setMemoryCount(hindsight.getMemoryCount());
    });
    return () => unsub();
  }, []);

  const handleSelectSystemForAudit = (system: AISystem) => {
    setActiveTab('chat');
  };

  const handleDraftForAuditor = (auditor: AuditorProfile) => {
    setActiveTab('evidence');
  };

  const handleViewEvidence = (pack: EvidencePackage) => {
    setActiveEvidencePack(pack);
    setActiveTab('evidence');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <Header
        memoryCount={memoryCount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetMemory={() => hindsight.clearAll()}
        onSeedMemory={() => hindsight.seedTwoYearHistory()}
        onOpenDemo={() => setActiveTab('demo')}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'demo' && (
          <DemoStoryWalkthrough
            onGoToChat={() => setActiveTab('chat')}
            onGoToInspector={() => setActiveTab('memory')}
            onViewEvidence={handleViewEvidence}
          />
        )}

        {activeTab === 'chat' && (
          <ChatConsole
            onViewEvidence={handleViewEvidence}
            onOpenInspector={() => setActiveTab('memory')}
          />
        )}

        {activeTab === 'memory' && <MemoryInspector />}

        {activeTab === 'systems' && (
          <SystemsInventory onSelectSystemForAudit={handleSelectSystemForAudit} />
        )}

        {activeTab === 'auditors' && (
          <AuditorDossier onDraftForAuditor={handleDraftForAuditor} />
        )}

        {activeTab === 'evidence' && (
          <EvidenceVault initialPackage={activeEvidencePack} />
        )}

        {activeTab === 'submission' && <SubmissionKit />}
      </main>

      {/* Persistent Bottom Bar with Links & Architecture Drawer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-slate-400">Hindsight Auditor</span>
            <span>•</span>
            <button
              onClick={() => setIsArchitectureOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center space-x-1 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>View System Architecture</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <a
              href="https://github.com/vectorize-io/hindsight"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors inline-flex items-center space-x-1"
            >
              <span>Hindsight GitHub</span>
              <ExternalLink className="w-3 h-3 text-slate-600" />
            </a>
            <a
              href="https://hindsight.vectorize.io/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors inline-flex items-center space-x-1"
            >
              <span>Hindsight Docs</span>
              <ExternalLink className="w-3 h-3 text-slate-600" />
            </a>
            <a
              href="https://vectorize.io/what-is-agent-memory"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors inline-flex items-center space-x-1"
            >
              <span>Vectorize Agent Memory</span>
              <ExternalLink className="w-3 h-3 text-slate-600" />
            </a>
          </div>
        </div>
      </footer>

      {/* Architecture Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
}
