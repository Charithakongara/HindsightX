import { ChatMessage, EvidencePackage, StoredAuditMemory } from '../types';
import { hindsight } from './hindsightClient';
import { SAMPLE_RAW_EVIDENCE_JSON, INITIAL_AI_SYSTEMS, INITIAL_AUDITORS } from '../data/mockEnterpriseData';

export async function askAgent(
  userQuery: string,
  memoryMode: 'FORCE_NO_MEMORY' | 'USE_HINDSIGHT' = 'USE_HINDSIGHT'
): Promise<ChatMessage> {
  const isMemoryActive = memoryMode === 'USE_HINDSIGHT' && hindsight.getMemoryCount() > 0;

  let recalledMemories: StoredAuditMemory[] = [];
  if (isMemoryActive) {
    recalledMemories = await hindsight.recall({
      query: userQuery,
      topK: 6,
      threshold: 0.45
    });
  }

  // Attempt backend API call first
  try {
    const res = await fetch('/api/agent/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userQuery,
        recalledMemories,
        systemContext: {
          organization: 'Aegis Continental Bank AG',
          jurisdiction: 'EU (Frankfurt / BaFin & ECB SSM)',
          systemsCount: INITIAL_AI_SYSTEMS.length
        },
        hasMemoryActive: isMemoryActive
      })
    });

    if (res.ok) {
      const data = await res.json();
      return {
        id: `msg_${Date.now()}`,
        sender: 'agent',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasMemoryRecall: isMemoryActive && recalledMemories.length > 0,
        recalledMemories: isMemoryActive ? recalledMemories : [],
        mode: isMemoryActive ? 'AFTER_MEMORY' : 'BEFORE_MEMORY',
        evidencePackage: isMemoryActive && (userQuery.toLowerCase().includes('evidence') || userQuery.toLowerCase().includes('pack') || userQuery.toLowerCase().includes('ready')) ? createEvidencePackage() : undefined
      };
    }
  } catch {
    // If backend route isn't available, proceed to high-fidelity client engine
  }

  // High-fidelity client cognitive engine
  if (!isMemoryActive) {
    const text = `### General EU AI Act High-Risk Audit Preparation Checklist

To prepare for an upcoming AI compliance audit, standard governance frameworks (EU AI Act, ISO/IEC 42001, NIST AI RMF) recommend verifying:

1. **Risk Management System (Article 9)**: Ensure continuous risk identification and mitigation procedures are documented across the model lifecycle.
2. **Data & Data Governance (Article 10)**: Review training, validation, and testing datasets for quality, representative distributions, and bias mitigation.
3. **Technical Documentation (Article 11 & Annex IV)**: Verify architectural diagrams, training parameters, and performance validation benchmarks are stored in the compliance repository.
4. **Record-Keeping & Automated Logging (Article 12)**: Ensure automated logging of system events and traceability is operational.
5. **Transparency & Information to Deployers (Article 13)**: Ensure user-facing instructions and output interpretability are available.
6. **Human Oversight (Article 14)**: Confirm human-in-the-loop stop mechanisms and operational override controls.
7. **Accuracy, Robustness & Cybersecurity (Article 15)**: Run accuracy benchmarks and adversarial resilience tests.

*Note: As a stateless assistant without historical audit memory, I cannot see your past audit findings, overdue remediations, or assigned auditor evidentiary requirements.*`;

    return {
      id: `msg_${Date.now()}`,
      sender: 'agent',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hasMemoryRecall: false,
      recalledMemories: [],
      mode: 'BEFORE_MEMORY'
    };
  }

  // With Hindsight Memory
  const text = `### ⚠️ AUDIT READINESS ASSESSMENT: NOT READY (2 Critical Gaps)

Based on **Hindsight Memory Recall** across the past 2 years of audit cycles, here is your organizational compliance briefing:

---

#### 1. 🚨 Critical Overdue Finding: #2025-03-B2 (Apex-CreditScorer v2.4)
- **Violation**: EU AI Act Article 10(2)(f) — Disparate impact ratio for applicants aged 18–25 fell to **0.74** (below the 0.80 four-fifths legal threshold).
- **History**: Issued during the March 2025 supervisory audit by **Dr. Elena Vance (TÜV Rheinland)**.
- **Commitment**: Sarah Chen promised re-weighted training calibration and validation by **June 30, 2025**.
- **CRITICAL RISK**: **Sarah Chen left the bank in July 2025.** This remediation is currently **orphaned and 92 days overdue**.

---

#### 2. ⚡ Critical Auditor Preference Alert: Dr. Elena Vance
- **Auditor History**: In the March 2025 audit, Dr. Vance **formally rejected UI dashboard screenshots** for model fairness and issued a Major Non-Conformity notice.
- **Strict Requirement**: Mandates **raw confusion matrix logs (JSON)**, ROC curves with exact cross-validation folds, and demographic parity calculations down to 4 decimal places.
- *Action*: Do not submit Grafana or Tableau screenshots; submit the attached raw JSON log package generated below.

---

#### 3. ⏱️ Testing Staleness Gaps
- **Control EU-AI-ACT-ART15 (Adversarial Robustness Testing)** for \`Apex-CreditScorer\`: Last tested **341 days ago** (October 22, 2024). Regulators flag any control untested for >180 days.
- **TalentMatch-Screener v1.8**: Candidate resume training provenance consent documentation remains unverified since September 2025.

---

#### Recommended Pre-Audit Action Plan:
1. Re-assign orphaned finding #2025-03-B2 to **Alex Rivera (ML Ops)** immediately.
2. Click **"Review Evidence Package"** below to inspect the raw JSON logs in the format Dr. Elena Vance approved for FraudGuard last cycle.`;

  return {
    id: `msg_${Date.now()}`,
    sender: 'agent',
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    hasMemoryRecall: true,
    recalledMemories,
    mode: 'AFTER_MEMORY',
    evidencePackage: createEvidencePackage()
  };
}

export function createEvidencePackage(): EvidencePackage {
  return {
    id: `ev_pack_${Date.now()}`,
    systemId: 'apex-credit-v2.4',
    systemName: 'Apex-CreditScorer v2.4.1',
    title: 'EU AI Act Article 10 & 14 Evidence Dossier (Raw Log Specification)',
    framework: 'EU_AI_ACT',
    targetAuditor: 'Dr. Elena Vance (TÜV Rheinland #0197)',
    formatCompliantWith: 'Raw JSON Logs & Confusion Matrix (Screenshots Omitted)',
    generatedAt: new Date().toISOString(),
    disparateImpactRatio: 0.834,
    auditReadinessScore: 88,
    sections: [
      {
        title: '1. Machine-Readable Confusion Matrix & Parity Verification',
        status: 'COMPLIANT',
        format: 'JSON Structure',
        content: 'Calculated across 50,000 holdout validation records. Lowest demographic subgroup disparate impact ratio: 0.834 (legal threshold: 0.800). Complies with Dr. Vance 4/5ths evidentiary mandate.'
      },
      {
        title: '2. Deterministic Reproducibility Traces',
        status: 'COMPLIANT',
        format: 'Git SHA & Model Weights Checksum',
        content: 'Verification SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855. Fixed seed random state: 42.'
      },
      {
        title: '3. Human-in-the-Loop Override Latency Logs',
        status: 'COMPLIANT',
        format: 'Telemetry Table',
        content: 'Underwriter overrides logged: 412. Average kill-switch trip latency: 11.2ms. Passes Article 14 human oversight requirements.'
      },
      {
        title: '4. Orphaned Remediation Re-Assignment Notice',
        status: 'WARNING',
        format: 'Administrative Delegation Record',
        content: 'Ticket ML-8841 reassigned from Sarah Chen (departed) to Alex Rivera (ML Ops Lead) on 2026-09-28.'
      }
    ],
    rawJsonLogs: SAMPLE_RAW_EVIDENCE_JSON
  };
}
