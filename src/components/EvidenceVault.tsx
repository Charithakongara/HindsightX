import React, { useState } from 'react';
import { FileText, Copy, Check, Download, ShieldCheck, Database, Code, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { SAMPLE_RAW_EVIDENCE_JSON, INITIAL_AI_SYSTEMS } from '../data/mockEnterpriseData';
import { EvidencePackage } from '../types';
import { createEvidencePackage } from '../services/agentEngine';

interface EvidenceVaultProps {
  initialPackage?: EvidencePackage | null;
}

export const EvidenceVault: React.FC<EvidenceVaultProps> = ({ initialPackage }) => {
  const [selectedPack, setSelectedPack] = useState<EvidencePackage>(
    initialPackage || createEvidencePackage()
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'SECTIONS' | 'RAW_JSON'>('SECTIONS');

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedPack.rawJsonLogs, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(selectedPack.rawJsonLogs, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `${selectedPack.systemId}_evidence_pack_vance_approved.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Regulatory Evidence Package Vault
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                Auditor-Formatted Dossiers
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Pre-compiled technical submissions structured to match historical acceptance profiles (omits rejected UI screenshots; provides machine-readable logs).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Raw JSON'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center space-x-1.5 cursor-pointer shadow-md shadow-blue-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .JSON</span>
          </button>
        </div>
      </div>

      {/* Package Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Auditor-Approved Format
              </span>
              <span className="text-xs text-slate-400 font-mono">{selectedPack.id}</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">{selectedPack.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Prepared for: <strong className="text-slate-200">{selectedPack.targetAuditor}</strong> • System: <strong className="text-slate-200">{selectedPack.systemName}</strong>
            </p>
          </div>

          {/* Toggle between Structured Sections & Raw JSON */}
          <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveView('SECTIONS')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeView === 'SECTIONS'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Structured Verification
            </button>
            <button
              onClick={() => setActiveView('RAW_JSON')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeView === 'RAW_JSON'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Machine JSON
            </button>
          </div>
        </div>

        {/* High-Level Verification Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <span className="text-slate-400 text-[11px]">Audit Readiness</span>
            <div className="text-base font-bold text-emerald-400 font-mono">
              {selectedPack.auditReadinessScore}% Pass Prob.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <span className="text-slate-400 text-[11px]">Holdout Validation</span>
            <div className="text-base font-bold text-white font-mono">50,000 Records</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <span className="text-slate-400 text-[11px]">Min Disparate Ratio</span>
            <div className="text-base font-bold text-emerald-400 font-mono">0.834 (Benchmark)</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <span className="text-slate-400 text-[11px]">Screenshots Included</span>
            <div className="text-base font-bold text-cyan-400 font-mono">0 (Raw Logs Only)</div>
          </div>
        </div>

        {/* View 1: Structured Sections */}
        {activeView === 'SECTIONS' && (
          <div className="space-y-3 pt-2">
            {selectedPack.sections.map((sec, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white">{sec.title}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        sec.status === 'COMPLIANT'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {sec.status}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                    {sec.format}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{sec.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* View 2: Raw Machine JSON Stream */}
        {activeView === 'RAW_JSON' && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-cyan-400 text-[11px]">
                Machine-Readable JSON Dump (Dr. Elena Vance Mandate)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-[460px] scrollbar-thin">
              <pre>{JSON.stringify(selectedPack.rawJsonLogs, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
