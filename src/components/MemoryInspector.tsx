import React, { useState, useEffect } from 'react';
import { Brain, Search, Plus, Trash2, Tag, Calendar, User, ShieldAlert, CheckCircle, Database, Download, Sparkles, Filter } from 'lucide-react';
import { hindsight } from '../services/hindsightClient';
import { StoredAuditMemory, ComplianceFramework, FindingSeverity } from '../types';
import { INITIAL_AI_SYSTEMS, INITIAL_AUDITORS } from '../data/mockEnterpriseData';

export const MemoryInspector: React.FC = () => {
  const [memories, setMemories] = useState<StoredAuditMemory[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSystem, setSelectedSystem] = useState<string>('ALL');
  const [selectedAuditor, setSelectedAuditor] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [expandedMemoryId, setExpandedMemoryId] = useState<string | null>(null);

  // New Memory Form State
  const [newContent, setNewContent] = useState<string>('');
  const [newSystemId, setNewSystemId] = useState<string>('apex-credit-v2.4');
  const [newAuditorId, setNewAuditorId] = useState<string>('dr-elena-vance');
  const [newSeverity, setNewSeverity] = useState<FindingSeverity>('MAJOR_NON_CONFORMITY');
  const [newTags, setNewTags] = useState<string>('audit-finding, new-inspection');
  const [newRejectedFormat, setNewRejectedFormat] = useState<string>('UI_SCREENSHOTS');
  const [newAcceptedFormat, setNewAcceptedFormat] = useState<string>('RAW_JSON_LOGS');

  const refresh = () => {
    setMemories(hindsight.getMemories());
  };

  useEffect(() => {
    refresh();
    const unsub = hindsight.subscribe(refresh);
    return () => unsub();
  }, []);

  const handleRetain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const tagsArray = newTags.split(',').map((t) => t.trim()).filter(Boolean);
    const system = INITIAL_AI_SYSTEMS.find((s) => s.id === newSystemId);
    const auditor = INITIAL_AUDITORS.find((a) => a.id === newAuditorId);

    await hindsight.retain({
      content: newContent,
      metadata: {
        systemId: newSystemId,
        systemName: system?.name || newSystemId,
        auditorId: newAuditorId,
        auditorName: auditor?.name || newAuditorId,
        framework: 'EU_AI_ACT',
        findingType: newSeverity,
        severity: newSeverity === 'MAJOR_NON_CONFORMITY' ? 'CRITICAL' : 'HIGH',
        status: 'OPEN',
        rejectedEvidenceFormat: newRejectedFormat,
        acceptedEvidenceFormat: newAcceptedFormat,
        cycle: 'Q3 2026 Audit Session'
      },
      tags: [...tagsArray, newSystemId, newAuditorId]
    });

    setNewContent('');
    setShowAddModal(false);
  };

  const filteredMemories = memories.filter((mem) => {
    const matchesSearch =
      searchTerm === '' ||
      mem.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mem.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mem.systemName && mem.systemName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mem.auditorName && mem.auditorName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSystem = selectedSystem === 'ALL' || mem.systemId === selectedSystem;
    const matchesAuditor = selectedAuditor === 'ALL' || mem.auditorId === selectedAuditor;

    return matchesSearch && matchesSystem && matchesAuditor;
  });

  const exportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(memories, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `hindsight_compliance_memories_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Hindsight Persistent Memory Inspector
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                {memories.length} Active Records
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live inspection of episodic audit records, learned auditor biases, rejected evidence types, and remediation timelines.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center space-x-1.5 transition-colors cursor-pointer shadow-md shadow-purple-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Retain New Memory</span>
          </button>
          <button
            onClick={exportJson}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
            title="Download memories as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search memories, tags, findings, auditors..."
            className="w-full bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-purple-500"
          />
        </div>

        <select
          value={selectedSystem}
          onChange={(e) => setSelectedSystem(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-purple-500"
        >
          <option value="ALL">All AI Systems (6)</option>
          {INITIAL_AI_SYSTEMS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.version})
            </option>
          ))}
        </select>

        <select
          value={selectedAuditor}
          onChange={(e) => setSelectedAuditor(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-purple-500"
        >
          <option value="ALL">All Auditors &amp; Assessors (3)</option>
          {INITIAL_AUDITORS.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.organization})
            </option>
          ))}
        </select>
      </div>

      {/* Memory Cards Grid */}
      <div className="space-y-3">
        {filteredMemories.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/40">
            <Brain className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No memories matched your search filters.</p>
          </div>
        ) : (
          filteredMemories.map((mem) => {
            const isExpanded = expandedMemoryId === mem.id;
            return (
              <div
                key={mem.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3 text-xs"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] text-purple-400 font-bold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                      {mem.cycle}
                    </span>
                    {mem.systemName && (
                      <span className="font-semibold text-white flex items-center gap-1">
                        <Database className="w-3 h-3 text-cyan-400" />
                        {mem.systemName}
                      </span>
                    )}
                    {mem.auditorName && (
                      <span className="text-slate-400 flex items-center gap-1">
                        <User className="w-3 h-3 text-amber-400" />
                        {mem.auditorName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {mem.findingType && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                          mem.findingType === 'MAJOR_NON_CONFORMITY'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : mem.findingType === 'COMMENDATION'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {mem.findingType.replace('_', ' ')}
                      </span>
                    )}
                    <button
                      onClick={() => hindsight.deleteMemory(mem.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                      title="Delete from Hindsight memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content body */}
                <p className="text-slate-200 leading-relaxed">{mem.content}</p>

                {/* Metadata highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  {mem.rejectedEvidenceFormat && (
                    <div className="text-rose-400">
                      <strong>Rejected Format:</strong> {mem.rejectedEvidenceFormat}
                    </div>
                  )}
                  {mem.acceptedEvidenceFormat && (
                    <div className="text-emerald-400">
                      <strong>Mandated Format:</strong> {mem.acceptedEvidenceFormat}
                    </div>
                  )}
                  {mem.remediationOwner && (
                    <div className="text-slate-300">
                      <strong>Owner:</strong> {mem.remediationOwner}{' '}
                      {mem.ownerStatus === 'DEPARTED' && (
                        <span className="text-rose-400 font-bold">(DEPARTED)</span>
                      )}
                    </div>
                  )}
                  {mem.remediationDeadline && (
                    <div className="text-amber-300">
                      <strong>Deadline:</strong> {mem.remediationDeadline} ({mem.status})
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {mem.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Retain New Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                Retain Audit Finding in Hindsight
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRetain} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Audit Finding / Directive Text</label>
                <textarea
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="e.g. Auditor requested raw confusion matrices and flagged demographic parity on credit models..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Target AI System</label>
                  <select
                    value={newSystemId}
                    onChange={(e) => setNewSystemId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                  >
                    {INITIAL_AI_SYSTEMS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Assigned Auditor</label>
                  <select
                    value={newAuditorId}
                    onChange={(e) => setNewAuditorId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                  >
                    {INITIAL_AUDITORS.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Severity / Non-Conformity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as FindingSeverity)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                  >
                    <option value="MAJOR_NON_CONFORMITY">Major Non-Conformity</option>
                    <option value="MINOR_NON_CONFORMITY">Minor Non-Conformity</option>
                    <option value="OBSERVATION">Observation</option>
                    <option value="COMMENDATION">Commendation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Rejected Format</label>
                  <input
                    type="text"
                    value={newRejectedFormat}
                    onChange={(e) => setNewRejectedFormat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Mandated Format</label>
                  <input
                    type="text"
                    value={newAcceptedFormat}
                    onChange={(e) => setNewAcceptedFormat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 cursor-pointer"
                >
                  Execute Hindsight Retain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
