import React from 'react';
import { Brain, Database, ArrowRight, ShieldCheck, Cpu, GitCommit, FileCode, CheckCircle2 } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fadeIn max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Hindsight Memory System Architecture
              </h3>
              <p className="text-xs text-slate-400">
                How persistent compliance memory powers proactive AI governance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Diagram Flow */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Stage 1 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-cyan-400 font-mono font-bold text-[11px]">
                <Database className="w-3.5 h-3.5" />
                <span>1. Ingestion &amp; Retain</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Audits, non-conformities, and auditor reactions are retained as structured entities with tags, dates, and evidence format constraints.
              </p>
              <div className="p-2 rounded bg-slate-900 text-[10px] font-mono text-slate-400">
                hindsight.retain(&#123; content, metadata, tags &#125;)
              </div>
            </div>

            {/* Stage 2 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2">
              <div className="flex items-center space-x-2 text-indigo-400 font-mono font-bold text-[11px]">
                <Cpu className="w-3.5 h-3.5" />
                <span>2. Multi-Stage Recall</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                When a user queries the agent, Hindsight executes semantic vector search across system IDs, auditor dossiers, and remediation deadlines.
              </p>
              <div className="p-2 rounded bg-slate-900 text-[10px] font-mono text-slate-400">
                hindsight.recall(&#123; query, topK, tags &#125;)
              </div>
            </div>

            {/* Stage 3 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>3. Synthesis &amp; Evidence</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                The agent injects recalled memories into prompt instructions to warn about auditor dislikes and compile compliant raw JSON logs.
              </p>
              <div className="p-2 rounded bg-slate-900 text-[10px] font-mono text-emerald-400">
                evidence_pack_vance_compliant.json
              </div>
            </div>
          </div>

          {/* Key Advantages */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <h4 className="font-mono text-slate-300 uppercase tracking-wider text-[11px] font-bold">
              Why Memory is the Core, Not a Feature
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Orphaned Ownership Detection:</strong> Flags open remediations when technical leads leave the bank.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Auditor Preference Retention:</strong> Stops teams from re-submitting rejected screenshots to strict assessors.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Testing Staleness Warnings:</strong> Alerts compliance officers when controls exceed 180 days without test runs.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Rediscovery Cost:</strong> Institutional knowledge compounds over years instead of vanishing with staff turnover.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Close Architecture
          </button>
        </div>
      </div>
    </div>
  );
};
