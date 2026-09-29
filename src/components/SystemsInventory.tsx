import React, { useState } from 'react';
import { Database, AlertTriangle, ShieldCheck, Clock, UserX, UserCheck, ArrowRight, ExternalLink, Activity } from 'lucide-react';
import { INITIAL_AI_SYSTEMS, INITIAL_AUDITORS } from '../data/mockEnterpriseData';
import { AISystem } from '../types';

interface SystemsInventoryProps {
  onSelectSystemForAudit: (system: AISystem) => void;
}

export const SystemsInventory: React.FC<SystemsInventoryProps> = ({ onSelectSystemForAudit }) => {
  const [selectedSystem, setSelectedSystem] = useState<AISystem>(INITIAL_AI_SYSTEMS[0]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Enterprise AI Model Risk &amp; Governance Matrix
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                6 Production Systems
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Classified under EU AI Act Annex III (High-Risk Obligations), ISO/IEC 42001, and BaFin/ECB Internal Model Risk policies.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono">
            2 Overdue Remediations
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono">
            3 Tests &gt;180 Days Stale
          </span>
        </div>
      </div>

      {/* Grid of Systems Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INITIAL_AI_SYSTEMS.map((sys) => {
          const isSelected = selectedSystem.id === sys.id;
          const auditor = INITIAL_AUDITORS.find((a) => a.id === sys.assignedAuditorId);
          const isStale = sys.daysSinceLastTest > 180;

          return (
            <div
              key={sys.id}
              onClick={() => setSelectedSystem(sys)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 relative ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-white">{sys.name}</h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {sys.version}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{sys.category}</span>
                </div>

                <div className="text-right">
                  <div
                    className={`text-xs font-mono font-bold ${
                      sys.complianceScore >= 90
                        ? 'text-emerald-400'
                        : sys.complianceScore >= 75
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {sys.complianceScore}% Score
                  </div>
                </div>
              </div>

              {/* Regulatory Tag */}
              <div className="text-[10px] font-mono px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 truncate">
                {sys.euAiActArticle}
              </div>

              {/* Status Row */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800/80">
                <div className="flex items-center space-x-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span className={isStale ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
                    {sys.daysSinceLastTest}d ago
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 text-slate-400">
                  {sys.leadStatus === 'DEPARTED' ? (
                    <UserX className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span
                    className={
                      sys.leadStatus === 'DEPARTED'
                        ? 'text-rose-400 font-semibold'
                        : 'text-slate-300 truncate'
                    }
                  >
                    {sys.technicalLead.split(' ')[0]} {sys.leadStatus === 'DEPARTED' ? '(Left)' : ''}
                  </span>
                </div>
              </div>

              {/* Auditor & Action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400">
                  Auditor: <strong className="text-slate-300">{auditor?.name.split(' ')[1]}</strong>
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSystemForAudit(sys);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <span>Audit Prep</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Drawer for Selected System */}
      {selectedSystem && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">{selectedSystem.name} Detailed Governance Sheet</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                  {selectedSystem.version}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedSystem.description}</p>
            </div>

            <button
              onClick={() => onSelectSystemForAudit(selectedSystem)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-md shadow-cyan-500/20 self-start sm:self-auto"
            >
              <span>Query Hindsight for this Model</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Controls Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Statutory Controls &amp; Testing History
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="px-3 py-2 rounded-l-lg">Control Code</th>
                    <th className="px-3 py-2">Control Name</th>
                    <th className="px-3 py-2">Last Tested</th>
                    <th className="px-3 py-2 rounded-r-lg">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {selectedSystem.controls.map((ctrl, i) => (
                    <tr key={i} className="hover:bg-slate-800/30">
                      <td className="px-3 py-2.5 font-mono text-cyan-400 font-bold">{ctrl.code}</td>
                      <td className="px-3 py-2.5 text-slate-200">{ctrl.name}</td>
                      <td className="px-3 py-2.5 text-slate-400 font-mono">{ctrl.lastTested}</td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            ctrl.status === 'PASSED'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : ctrl.status === 'FAILED'
                              ? 'bg-rose-500/20 text-rose-400 font-bold'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {ctrl.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
