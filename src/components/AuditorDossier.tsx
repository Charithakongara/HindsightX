import React, { useState } from 'react';
import { UserCheck, AlertOctagon, CheckCircle2, XCircle, Quote, Shield, FileText, ArrowRight } from 'lucide-react';
import { INITIAL_AUDITORS } from '../data/mockEnterpriseData';
import { AuditorProfile } from '../types';

interface AuditorDossierProps {
  onDraftForAuditor: (auditor: AuditorProfile) => void;
}

export const AuditorDossier: React.FC<AuditorDossierProps> = ({ onDraftForAuditor }) => {
  const [selectedAuditor, setSelectedAuditor] = useState<AuditorProfile>(INITIAL_AUDITORS[0]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Auditor Profiles &amp; Learned Evidentiary Preferences
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                Memory-Augmented Dossiers
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Hindsight learns and retains the distinct evidentiary formats, historical objections, and scrutiny patterns of every assigned auditor.
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Updated: Q3 2026 Audit Prep
        </span>
      </div>

      {/* Auditor Cards Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INITIAL_AUDITORS.map((auditor) => {
          const isSelected = selectedAuditor.id === auditor.id;
          return (
            <div
              key={auditor.id}
              onClick={() => setSelectedAuditor(auditor)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                isSelected
                  ? 'bg-slate-900 border-amber-500 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{auditor.name}</h3>
                  <span className="text-[11px] text-amber-400 font-medium block">{auditor.organization}</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    auditor.strictness === 'VERY_STRICT'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {auditor.strictness.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs text-slate-400">{auditor.accreditation}</p>

              <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
                <span>Last Audit: {auditor.lastAuditDate}</span>
                <span className="text-amber-400 flex items-center gap-1 font-semibold">
                  Inspect Dossier &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Auditor Dossier Sheet */}
      {selectedAuditor && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white">{selectedAuditor.name}</h3>
                <span className="text-xs text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-800">
                  {selectedAuditor.title}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedAuditor.organization}</p>
            </div>

            <button
              onClick={() => onDraftForAuditor(selectedAuditor)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md shadow-amber-500/20 self-start sm:self-auto"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Draft Evidence for {selectedAuditor.name.split(' ')[1]}</span>
            </button>
          </div>

          {/* Historical Quote Callout */}
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-amber-200/90 text-xs italic flex items-start space-x-3">
            <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              "{selectedAuditor.historicalQuote}"
              <span className="block not-italic text-[11px] text-slate-400 font-mono mt-1">
                — Recorded in March 2025 Audit Retain Log
              </span>
            </div>
          </div>

          {/* Accepted vs Rejected Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Accepted Formats */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Mandated / Accepted Evidence Formats</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {selectedAuditor.acceptedFormats.map((fmt, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold select-none">✓</span>
                    <span>{fmt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rejected Formats */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-3">
              <div className="flex items-center space-x-2 text-rose-400 font-semibold text-xs">
                <XCircle className="w-4 h-4" />
                <span>Strictly Refused / Inadmissible Formats</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {selectedAuditor.rejectedFormats.map((fmt, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-rose-400 font-bold select-none">✕</span>
                    <span>{fmt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Directives */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <h4 className="font-mono text-slate-400 uppercase tracking-wider text-[11px]">
              Key Behavioral Patterns Retained by Hindsight
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {selectedAuditor.keyDirectives.map((dir, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  {dir}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
