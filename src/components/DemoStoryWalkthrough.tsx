import React, { useState } from 'react';
import { Sparkles, ArrowRight, Database, Brain, AlertOctagon, CheckCircle2, FileText, ArrowLeft, RefreshCw, Terminal, UserX, Copy, Check } from 'lucide-react';
import { hindsight } from '../services/hindsightClient';
import { askAgent, createEvidencePackage } from '../services/agentEngine';
import { ChatMessage, EvidencePackage } from '../types';

interface DemoStoryWalkthroughProps {
  onGoToChat: () => void;
  onGoToInspector: () => void;
  onViewEvidence: (pack: EvidencePackage) => void;
}

export const DemoStoryWalkthrough: React.FC<DemoStoryWalkthroughProps> = ({
  onGoToChat,
  onGoToInspector,
  onViewEvidence
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [step1Response, setStep1Response] = useState<ChatMessage | null>(null);
  const [isFeedingHistory, setIsFeedingHistory] = useState<boolean>(false);
  const [ingestionLogs, setIngestionLogs] = useState<string[]>([]);
  const [step3Response, setStep3Response] = useState<ChatMessage | null>(null);
  const [evidencePack, setEvidencePack] = useState<EvidencePackage | null>(null);
  const [copiedRaw, setCopiedRaw] = useState(false);

  // Step 1: Run interaction without memory
  const handleRunStep1 = async () => {
    // Clear memory temporarily for true cold-start baseline
    hindsight.clearAll();
    const response = await askAgent("Are we ready for next week's audit on Apex-CreditScorer?", 'FORCE_NO_MEMORY');
    setStep1Response(response);
  };

  // Step 2: Feed past history (Hindsight Retain)
  const handleFeedHistory = async () => {
    setIsFeedingHistory(true);
    setIngestionLogs([]);

    const logMessages = [
      'Ingesting March 2025 Supervisory Audit report (TÜV Rheinland)...',
      'RETAIN: Dr. Elena Vance rejected UI dashboard screenshots (Apex-CreditScorer v2.4)',
      'RETAIN: Major Non-Conformity #2025-03-B2 (Age 18-25 Disparate Impact 0.74 < 0.80)',
      'RETAIN: Remediation assigned to Sarah Chen with deadline 2025-06-30',
      'RETAIN: Sarah Chen departed bank in July 2025 — ticket ML-8841 left unassigned',
      'RETAIN: Dr. Elena Vance mandate: Machine-readable raw JSON confusion matrix logs required',
      'RETAIN: Marcus Thorne (Deloitte) accepted FraudGuard v3.1 kill-switch latency log (8.4ms)',
      'RETAIN: Apex-CreditScorer adversarial robustness testing untested for 341 days',
      'Vectorizing entities & indexing semantic graph in Hindsight Memory...'
    ];

    for (let i = 0; i < logMessages.length; i++) {
      await new Promise((r) => setTimeout(r, 220));
      setIngestionLogs((prev) => [...prev, logMessages[i]]);
    }

    hindsight.seedTwoYearHistory();
    setIsFeedingHistory(false);
    setCurrentStep(3);
  };

  // Step 3: Run interaction WITH memory active
  const handleRunStep3 = async () => {
    const response = await askAgent("Are we ready for next week's audit on Apex-CreditScorer?", 'USE_HINDSIGHT');
    setStep3Response(response);
    if (response.evidencePackage) {
      setEvidencePack(response.evidencePackage);
    }
  };

  // Step 4: Payoff
  const handleGeneratePayoff = () => {
    const pack = createEvidencePackage();
    setEvidencePack(pack);
    setCurrentStep(4);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Explainer Header */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official 60-Second Demo Storyboard</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Watch How Memory Transforms a Compliance Agent
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Stateless chatbots give generic textbook checklists. An agent with Hindsight memory pinpoints past rejected evidence, overdue remediations, and former employees who left with critical context.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setCurrentStep(1);
                setStep1Response(null);
                setStep3Response(null);
                setEvidencePack(null);
                setIngestionLogs([]);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restart Demo</span>
            </button>
          </div>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            { num: 1, title: 'Interaction 1', desc: 'Cold Start (No Memory)' },
            { num: 2, title: 'Hindsight Retain', desc: 'Feed 2-Yr History' },
            { num: 3, title: 'Interaction 5', desc: 'Memory-Augmented' },
            { num: 4, title: 'The Payoff', desc: 'Compliant Evidence Pack' }
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                currentStep === s.num
                  ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                  : currentStep > s.num
                  ? 'bg-slate-900/60 border-emerald-500/40 text-slate-300'
                  : 'bg-slate-900/30 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Step {s.num}
                </span>
                {currentStep > s.num ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : currentStep === s.num ? (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                ) : null}
              </div>
              <div className="text-xs font-semibold text-slate-200">{s.title}</div>
              <div className="text-[11px] text-slate-400 truncate">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Interaction 1 (Before Memory) */}
      {currentStep === 1 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                1
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Interaction 1: The Cold Start (Stateless Chatbot)</h3>
                <p className="text-xs text-slate-400">
                  Ask the compliance lead's standard question without any Hindsight memory loaded.
                </p>
              </div>
            </div>

            <button
              onClick={handleRunStep1}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center space-x-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Ask: "Are we ready for next week's audit?"</span>
            </button>
          </div>

          {step1Response ? (
            <div className="space-y-4 animate-fadeIn">
              {/* User Prompt Bubble */}
              <div className="flex justify-end">
                <div className="bg-slate-800 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-2xl rounded-tr-none text-xs max-w-lg">
                  <p className="font-semibold text-cyan-400 text-[11px] mb-1">Compliance Lead (User)</p>
                  "Are we ready for next week's audit on Apex-CreditScorer?"
                </div>
              </div>

              {/* Naive Agent Reply */}
              <div className="flex justify-start">
                <div className="bg-slate-950 border border-amber-500/30 text-slate-300 p-5 rounded-2xl rounded-tl-none text-xs max-w-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4 text-amber-400" />
                      Stateless AI (Zero Historical Context)
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Hindsight Memory: 0 active</span>
                  </div>

                  <div className="prose prose-invert prose-xs max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {step1Response.text}
                  </div>

                  <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 text-amber-300/90 text-[11px] flex items-start space-x-2">
                    <AlertOctagon className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                    <div>
                      <strong>The Problem:</strong> The agent gave a standard textbook summary of the EU AI Act. It has no clue that Dr. Elena Vance is coming, that Sarah Chen left the bank, or that our fairness fix is 92 days overdue.
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white flex items-center space-x-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <span>Step 2: Feed Hindsight Audit History</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
              <p className="text-xs text-slate-400 mb-3">
                Click the button above to simulate the compliance officer asking if the bank is ready for its upcoming audit.
              </p>
              <button
                onClick={handleRunStep1}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors inline-flex items-center space-x-2 cursor-pointer"
              >
                <span>Trigger Interaction 1</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Feed Past History (Hindsight Retain) */}
      {currentStep === 2 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                2
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Ingestion: Feed 2 Years of Audit History via Hindsight</h3>
                <p className="text-xs text-slate-400">
                  Ingest past supervisory audits, Dr. Elena Vance's strict rules, Sarah Chen's departure, and control logs into Hindsight memory.
                </p>
              </div>
            </div>

            <button
              onClick={handleFeedHistory}
              disabled={isFeedingHistory}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 cursor-pointer transition-colors ${
                isFeedingHistory
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isFeedingHistory ? 'Retaining in Hindsight...' : 'Batch Retain Audit Records'}</span>
            </button>
          </div>

          {/* Terminal / Ingestion Stream */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Hindsight SDK \`retain()\` Stream
              </span>
              <span>Vectorize Engine v1.0</span>
            </div>

            {ingestionLogs.length === 0 ? (
              <p className="text-slate-500 py-6 text-center">
                Ready to ingest 2 years of audit cycles into persistent agent memory. Click "Batch Retain Audit Records" above.
              </p>
            ) : (
              <div className="space-y-1.5 py-1">
                {ingestionLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-[11px]">
                    <span className="text-cyan-500 select-none">›</span>
                    <span className={log.includes('RETAIN') ? 'text-indigo-300 font-semibold' : 'text-slate-300'}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {ingestionLogs.length > 0 && !isFeedingHistory && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Successfully retained 8 high-risk compliance memories in Hindsight.</span>
              </div>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Continue to Interaction 5</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Interaction 5 (With Hindsight Memory) */}
      {currentStep === 3 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                3
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Interaction 5: Re-asking with Hindsight Memory Active</h3>
                <p className="text-xs text-slate-400">
                  Ask the exact same question. Watch how persistent memory transforms the answer.
                </p>
              </div>
            </div>

            <button
              onClick={handleRunStep3}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center space-x-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Ask: "Are we ready for next week's audit?"</span>
            </button>
          </div>

          {step3Response ? (
            <div className="space-y-4 animate-fadeIn">
              {/* User Prompt */}
              <div className="flex justify-end">
                <div className="bg-slate-800 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-2xl rounded-tr-none text-xs max-w-lg">
                  <p className="font-semibold text-cyan-400 text-[11px] mb-1">Compliance Lead (User)</p>
                  "Are we ready for next week's audit on Apex-CreditScorer?"
                </div>
              </div>

              {/* Memory Recall Badges */}
              <div className="rounded-xl bg-slate-950/70 border border-indigo-500/30 p-3">
                <div className="flex items-center space-x-2 text-[11px] font-semibold text-indigo-400 mb-2">
                  <Brain className="w-3.5 h-3.5" />
                  <span>Hindsight Recall Activated (Top Matches Retrieved)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px]">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    <span className="text-cyan-400 font-bold">98% Match:</span> Dr. Elena Vance rejected UI screenshots (March 2025)
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    <span className="text-rose-400 font-bold">95% Match:</span> Sarah Chen left; Q2 bias remediation overdue (ML-8841)
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    <span className="text-amber-400 font-bold">89% Match:</span> Control EU-AI-ACT-ART15 untested for 341 days
                  </div>
                </div>
              </div>

              {/* Agent Response */}
              <div className="flex justify-start">
                <div className="bg-slate-950 border border-cyan-500/40 text-slate-300 p-5 rounded-2xl rounded-tl-none text-xs max-w-3xl space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      Hindsight Auditor (Memory-Augmented)
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      Grounded in 2-Yr History
                    </span>
                  </div>

                  <div className="prose prose-invert prose-xs max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {step3Response.text}
                  </div>
                </div>
              </div>

              {/* Next Action */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 flex items-center space-x-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleGeneratePayoff}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-slate-950 font-bold flex items-center space-x-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <span>Step 4: See The Payoff (Draft Evidence Pack)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
              <p className="text-xs text-slate-400 mb-3">
                Click the button above to query the agent again now that Hindsight has retained your audit records.
              </p>
              <button
                onClick={handleRunStep3}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors inline-flex items-center space-x-2 cursor-pointer"
              >
                <span>Trigger Interaction 5</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 4: The Payoff (Compliant Evidence Pack) */}
      {currentStep === 4 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                4
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-semibold text-white">The Payoff: Evidence Pack Drafted to Auditor Specs</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Dr. Elena Vance Approved Format
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Because Hindsight remembered that Dr. Vance rejected UI screenshots, it drafted raw JSON confusion matrix logs and demographic parity metrics.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  if (evidencePack) {
                    navigator.clipboard.writeText(JSON.stringify(evidencePack.rawJsonLogs, null, 2));
                    setCopiedRaw(true);
                    setTimeout(() => setCopiedRaw(false), 2000);
                  }
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                {copiedRaw ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRaw ? 'Copied JSON' : 'Copy Raw JSON'}</span>
              </button>
            </div>
          </div>

          {/* Evidence Pack Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Target System</span>
              <div className="text-sm font-bold text-white">Apex-CreditScorer v2.4.1</div>
              <span className="text-[10px] text-cyan-400 font-mono">EU AI Act High-Risk Annex III</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Designated Auditor</span>
              <div className="text-sm font-bold text-white">Dr. Elena Vance</div>
              <span className="text-[10px] text-amber-400 font-mono">TÜV Rheinland Notified Body #0197</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Calculated Disparate Impact</span>
              <div className="text-sm font-bold text-emerald-400">0.834 (Legal Minimum: 0.800)</div>
              <span className="text-[10px] text-slate-400 font-mono">Remediation Target Met on Holdout</span>
            </div>
          </div>

          {/* Evidentiary Sections */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Pre-Compiled Verification Dossier
            </h4>

            {createEvidencePackage().sections.map((sec, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-white">{sec.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      sec.status === 'COMPLIANT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {sec.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{sec.content}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0 px-2 py-1 rounded bg-slate-900 border border-slate-800">
                  {sec.format}
                </span>
              </div>
            ))}
          </div>

          {/* Code/Raw JSON Snippet that Dr. Vance mandated */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px] text-cyan-400">
                evidence_pack_vance_compliant.json (Machine-Readable Stream)
              </span>
              <span className="text-[10px] text-slate-500">Format: JSON Lines / SHA-256 Hashed</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto max-h-56 scrollbar-thin">
              <pre className="text-[11px] font-mono text-emerald-400 leading-relaxed">
                {JSON.stringify(createEvidencePackage().rawJsonLogs, null, 2)}
              </pre>
            </div>
          </div>

          {/* Bottom Callouts */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              🎉 <strong>Demo Finished!</strong> You have seen the complete before, retain, recall, and payoff cycle.
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onGoToChat}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
              >
                Open Agent Chat Console
              </button>
              <button
                onClick={onGoToInspector}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
              >
                Inspect Hindsight Memories
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
