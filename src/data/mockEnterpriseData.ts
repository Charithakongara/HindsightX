import { AISystem, AuditorProfile, StoredAuditMemory, EvidencePackage } from '../types';

export const INITIAL_AI_SYSTEMS: AISystem[] = [
  {
    id: 'apex-credit-v2.4',
    name: 'Apex-CreditScorer',
    version: 'v2.4.1',
    category: 'Credit & Loan Underwriting',
    euAiActArticle: 'Annex III, Point 5(b) (High-Risk Creditworthiness Assessment)',
    riskTier: 'HIGH_RISK_ANNEX_III',
    businessOwner: 'Julian Sterling (Head of Consumer Lending)',
    technicalLead: 'Sarah Chen (Departed July 2025)',
    leadStatus: 'DEPARTED',
    assignedAuditorId: 'dr-elena-vance',
    lastTestedDate: '2024-10-22',
    daysSinceLastTest: 341,
    openFindingsCount: 2,
    complianceScore: 64,
    description: 'Ensemble gradient boosting model scoring 1.8M retail loan applicants annually across 14 European markets.',
    controls: [
      { code: 'EU-AI-ACT-ART10', name: 'Bias Mitigation & Data Governance', status: 'FAILED', lastTested: '2025-03-14' },
      { code: 'EU-AI-ACT-ART13', name: 'Transparency & Adverse Action Notices', status: 'PASSED', lastTested: '2025-03-14' },
      { code: 'EU-AI-ACT-ART14', name: 'Human Oversight & Underwriter Override Logs', status: 'PASSED', lastTested: '2025-09-02' },
      { code: 'EU-AI-ACT-ART15', name: 'Adversarial Robustness & Drift Validation', status: 'STALE', lastTested: '2024-10-22' }
    ]
  },
  {
    id: 'fraudguard-v3.1',
    name: 'FraudGuard-RealTime',
    version: 'v3.1.0',
    category: 'AML & Payment Fraud Detection',
    euAiActArticle: 'Article 6(2) / Critical Banking Infrastructure Support',
    riskTier: 'HIGH_RISK_ANNEX_III',
    businessOwner: 'Miriam Al-Mansoor (VP Financial Crime)',
    technicalLead: 'David Kalu (Principal ML Engineer)',
    leadStatus: 'ACTIVE',
    assignedAuditorId: 'marcus-thorne',
    lastTestedDate: '2025-08-14',
    daysSinceLastTest: 45,
    openFindingsCount: 0,
    complianceScore: 96,
    description: 'Ultra-low latency streaming inference engine evaluating credit card transactions at 45,000 TPS.',
    controls: [
      { code: 'EU-AI-ACT-ART9', name: 'Continuous Risk Management System', status: 'PASSED', lastTested: '2025-08-14' },
      { code: 'EU-AI-ACT-ART12', name: 'Automated Audit Logging & Tamper-Proof Storage', status: 'PASSED', lastTested: '2025-08-14' },
      { code: 'EU-AI-ACT-ART14', name: 'Automated Kill-Switch & Human Escalation (<10ms)', status: 'PASSED', lastTested: '2025-08-14' }
    ]
  },
  {
    id: 'talentmatch-v1.8',
    name: 'TalentMatch-Screener',
    version: 'v1.8.2',
    category: 'HR & Candidate Resume Screening',
    euAiActArticle: 'Annex III, Point 4(a) (High-Risk Employment & Recruitment)',
    riskTier: 'HIGH_RISK_ANNEX_III',
    businessOwner: 'Chantal Dubois (Chief People Officer)',
    technicalLead: 'Siddharth Rao (Senior ML Engineer)',
    leadStatus: 'ACTIVE',
    assignedAuditorId: 'dr-elena-vance',
    lastTestedDate: '2025-03-10',
    daysSinceLastTest: 202,
    openFindingsCount: 1,
    complianceScore: 78,
    description: 'NLP embedding pipeline screening internal & external applicant resumes for engineering and operations roles.',
    controls: [
      { code: 'EU-AI-ACT-ART10', name: 'Training Data Lineage & Provenance Consent', status: 'STALE', lastTested: '2025-03-10' },
      { code: 'EU-AI-ACT-ART14', name: 'Recruiter Override Ratio & Second-Look Safeguards', status: 'PASSED', lastTested: '2025-03-10' }
    ]
  },
  {
    id: 'omnicare-v2.0',
    name: 'OmniCare-TriageAssist',
    version: 'v2.0.4',
    category: 'Health Insurance Claims & Triage',
    euAiActArticle: 'Annex III, Point 5(a) (Essential Private Services & Benefits)',
    riskTier: 'HIGH_RISK_ANNEX_III',
    businessOwner: 'Dr. Henrik Lindqvist (Medical Claims Lead)',
    technicalLead: 'Elena Rostova (Staff Data Scientist)',
    leadStatus: 'ACTIVE',
    assignedAuditorId: 'claire-dupont',
    lastTestedDate: '2025-05-18',
    daysSinceLastTest: 133,
    openFindingsCount: 1,
    complianceScore: 82,
    description: 'Automated clinical claims parsing and eligibility triage for employee health insurance claims.',
    controls: [
      { code: 'EU-AI-ACT-ART10', name: 'Clinical Demographic Representation', status: 'PASSED', lastTested: '2025-05-18' },
      { code: 'EU-AI-ACT-ART13', name: 'Clinician Adverse Determination Reasoning Log', status: 'PASSED', lastTested: '2025-05-18' }
    ]
  },
  {
    id: 'riskshield-kyc-v1.2',
    name: 'RiskShield-BiometricKYC',
    version: 'v1.2.3',
    category: 'Biometric Verification & Anti-Spoofing',
    euAiActArticle: 'Annex III, Point 1(a) (Remote Biometric Identification)',
    riskTier: 'HIGH_RISK_ANNEX_III',
    businessOwner: 'Liam O’Connor (Head of Digital Onboarding)',
    technicalLead: 'Hannah Becker (Computer Vision Lead)',
    leadStatus: 'ACTIVE',
    assignedAuditorId: 'marcus-thorne',
    lastTestedDate: '2024-11-05',
    daysSinceLastTest: 327,
    openFindingsCount: 1,
    complianceScore: 71,
    description: '3D passive liveness detection and facial biometric matching for mobile bank account creation.',
    controls: [
      { code: 'EU-AI-ACT-ART15', name: 'Presentation Attack Detection (ISO/IEC 30107-3)', status: 'STALE', lastTested: '2024-11-05' },
      { code: 'EU-AI-ACT-ART14', name: 'Manual Reviewer Fallback for Low Confidence Fits', status: 'PASSED', lastTested: '2025-02-11' }
    ]
  },
  {
    id: 'customercare-v4.0',
    name: 'CustomerCare-GenAssist',
    version: 'v4.0.0',
    category: 'Generative Customer Support',
    euAiActArticle: 'Article 50 (Transparency for AI Systems Interacting with Natural Persons)',
    riskTier: 'LIMITED_RISK',
    businessOwner: 'Rachel Greene (Customer Experience VP)',
    technicalLead: 'Tyler Hayes (Conversational AI Lead)',
    leadStatus: 'ACTIVE',
    assignedAuditorId: 'claire-dupont',
    lastTestedDate: '2025-07-20',
    daysSinceLastTest: 70,
    openFindingsCount: 0,
    complianceScore: 98,
    description: 'RAG-powered conversational assistant answering general retail banking and account FAQ questions.',
    controls: [
      { code: 'EU-AI-ACT-ART50', name: 'Clear Disclosure of AI Identity to Users', status: 'PASSED', lastTested: '2025-07-20' },
      { code: 'EU-AI-ACT-ART52', name: 'Synthesized Content Watermarking', status: 'PASSED', lastTested: '2025-07-20' }
    ]
  }
];

export const INITIAL_AUDITORS: AuditorProfile[] = [
  {
    id: 'dr-elena-vance',
    name: 'Dr. Elena Vance',
    organization: 'TÜV Rheinland / EU Notified Body #0197',
    accreditation: 'Lead Conformity Assessment Assessor (AI Act & ISO/IEC 42001)',
    title: 'Principal AI Regulatory Assessor',
    strictness: 'VERY_STRICT',
    acceptedFormats: [
      'Raw machine-readable JSON logs (confusion matrices, ROC data)',
      'Deterministic reproducible Python test scripts (with fixed random seed)',
      'Subgroup demographic parity calculations (disparate impact ratio < 0.80)',
      'Signed Git SHA commit traces of model weights & feature pipelines'
    ],
    rejectedFormats: [
      'UI dashboard screenshots (e.g. Grafana, PowerBI, Tableau)',
      'Aggregated high-level slide decks without underlying test data',
      'Unsigned verbal assertions of model fairness',
      'Synthetic test sets without certified provenance chain'
    ],
    keyDirectives: [
      'Zero tolerance for orphaned remediations across cycles',
      'Requires raw prediction logs on minimum 10,000 validation records',
      'Enforces strict 4/5ths rule on all demographic sub-segments'
    ],
    historicalQuote: 'I will not certify a credit risk model based on screenshots of a Grafana dashboard. Provide machine-readable raw prediction logs or I will issue a formal refusal to certify.',
    lastAuditDate: '2025-03-18'
  },
  {
    id: 'marcus-thorne',
    name: 'Marcus Thorne',
    organization: 'Deloitte AI Assurance Practice',
    accreditation: 'Global Lead Partner, NIST AI RMF & ISO 42001',
    title: 'Lead Partner, Algorithmic Risk Assurance',
    strictness: 'STRICT',
    acceptedFormats: [
      'Human-in-the-loop kill-switch latency benchmarks (<15ms)',
      'Structured incident escalation audit trails',
      'Executive risk summaries with drill-down API logs',
      'Hardware security module (HSM) key rotation certificates'
    ],
    rejectedFormats: [
      'Unstructured gigabyte raw terminal dumps without index',
      'Outdated static documentation (>6 months unreviewed)'
    ],
    keyDirectives: [
      'Focuses heavily on human override capability and emergency stop triggers',
      'Validates whether engineering leads are actively employed and certified'
    ],
    historicalQuote: 'Your models can be mathematically brilliant, but if your human supervisor cannot kill a rogue pipeline within 500 milliseconds, it fails our audit.',
    lastAuditDate: '2025-08-14'
  },
  {
    id: 'claire-dupont',
    name: 'Claire Dupont',
    organization: 'CNIL / European Data Protection Board Working Group',
    accreditation: 'Senior Data Protection & Algorithmic Governance Inspector',
    title: 'Senior Regulatory Inspector',
    strictness: 'STRICT',
    acceptedFormats: [
      'GDPR Article 22 human intervention logs',
      'Data lineage DAGs from raw ingest to token embeddings',
      'Consent record checksums for training inputs'
    ],
    rejectedFormats: [
      'Proprietary black-box third-party vendor claims without source contracts',
      'Scraped data sets without explicit EU consent documentation'
    ],
    keyDirectives: [
      'Inspects candidate screening and health claims systems for covert proxies'
    ],
    historicalQuote: 'Where did this resume dataset originate? If there is no explicit user consent for algorithmic profiling, the entire training run is legally toxic.',
    lastAuditDate: '2025-05-18'
  }
];

export const TWO_YEAR_AUDIT_HISTORY_MEMORIES: StoredAuditMemory[] = [
  {
    id: 'mem_2025_03_01',
    content: 'CRITICAL AUDITOR REJECTION: During the March 2025 supervisory audit, Dr. Elena Vance (TÜV Rheinland) formally REJECTED the compliance dossier for Apex-CreditScorer v2.4 because evidence was submitted as Grafana dashboard screenshots. Dr. Vance stated: "Screenshots are unverifiable and inadmissible. All future submissions must include raw JSON confusion matrix logs, subgroup disparate impact ratios, and reproducible test run hashes."',
    systemId: 'apex-credit-v2.4',
    systemName: 'Apex-CreditScorer',
    auditorId: 'dr-elena-vance',
    auditorName: 'Dr. Elena Vance',
    framework: 'EU_AI_ACT',
    article: 'Article 10(2) & Annex IV Technical Documentation',
    findingType: 'MAJOR_NON_CONFORMITY',
    severity: 'CRITICAL',
    status: 'OPEN',
    remediationDeadline: '2025-06-30',
    remediationOwner: 'Sarah Chen (Senior Credit Modeler)',
    ownerStatus: 'DEPARTED',
    acceptedEvidenceFormat: 'RAW_MACHINE_READABLE_JSON_LOGS',
    rejectedEvidenceFormat: 'UI_DASHBOARD_SCREENSHOTS',
    cycle: 'March 2025 Supervisory Audit',
    createdAt: '2025-03-18T14:22:00Z',
    tags: ['apex-credit', 'elena-vance', 'rejected-format', 'screenshot-refusal', 'eu-ai-act-art10']
  },
  {
    id: 'mem_2025_03_02',
    content: 'BIAS DISPARITY VIOLATION: Finding #2025-03-B2 filed against Apex-CreditScorer v2.4. Demographic test on 45,000 retail loan applicants revealed a Disparate Impact Ratio of 0.74 for age group 18-25 vs benchmark group 35-55 (legal minimum is 0.80 under EU four-fifths rule). Remediation action plan promised by Sarah Chen to re-weight loss function and re-balance training cohort by Q2 2025 (June 30, 2025).',
    systemId: 'apex-credit-v2.4',
    systemName: 'Apex-CreditScorer',
    auditorId: 'dr-elena-vance',
    auditorName: 'Dr. Elena Vance',
    framework: 'EU_AI_ACT',
    article: 'Article 10(2)(f) - Examination for Bias',
    findingType: 'MAJOR_NON_CONFORMITY',
    severity: 'CRITICAL',
    status: 'OVERDUE',
    remediationDeadline: '2025-06-30',
    remediationOwner: 'Sarah Chen',
    ownerStatus: 'DEPARTED',
    acceptedEvidenceFormat: 'DEMOGRAPHIC_PARITY_LOGS',
    cycle: 'March 2025 Supervisory Audit',
    createdAt: '2025-03-18T15:10:00Z',
    tags: ['apex-credit', 'bias-violation', 'disparate-impact', 'overdue-remediation', 'sarah-chen']
  },
  {
    id: 'mem_2025_07_01',
    content: 'ORPHANED REMEDIATION ALERT: Sarah Chen (lead modeler responsible for Apex-CreditScorer bias remediation #2025-03-B2) departed the bank on July 14, 2025. Jira ticket ML-8841 was left unassigned. The Q2 deadline (June 30, 2025) lapsed without new validation logs or model re-deployment.',
    systemId: 'apex-credit-v2.4',
    systemName: 'Apex-CreditScorer',
    framework: 'INTERNAL_MODEL_RISK',
    article: 'Model Governance Policy §4.2 (Ownership Continuity)',
    findingType: 'OBSERVATION',
    severity: 'HIGH',
    status: 'ORPHANED',
    remediationOwner: 'Sarah Chen (Departed)',
    ownerStatus: 'DEPARTED',
    cycle: 'Q3 2025 Governance Check',
    createdAt: '2025-07-20T09:00:00Z',
    tags: ['apex-credit', 'sarah-chen-departed', 'orphaned-ticket', 'unassigned-remediation']
  },
  {
    id: 'mem_2025_08_01',
    content: 'AUDITOR ACCEPTANCE SUCCESS: Marcus Thorne (Deloitte) commended FraudGuard-RealTime v3.1 during the August 2025 AML audit. Evidence format accepted: Real-time kill-switch response log (measured 8.4ms latency) coupled with automated incident escalation webhooks. Marcus noted: "This is the gold standard for Article 14 human oversight evidence."',
    systemId: 'fraudguard-v3.1',
    systemName: 'FraudGuard-RealTime',
    auditorId: 'marcus-thorne',
    auditorName: 'Marcus Thorne',
    framework: 'EU_AI_ACT',
    article: 'Article 14 - Human Oversight',
    findingType: 'COMMENDATION',
    severity: 'LOW',
    status: 'CLOSED',
    acceptedEvidenceFormat: 'REALTIME_KILLSWITCH_LOGS_AND_WEBHOOKS',
    cycle: 'August 2025 AML Audit',
    createdAt: '2025-08-14T11:45:00Z',
    tags: ['fraudguard', 'marcus-thorne', 'killswitch-approved', 'commendation', 'gold-standard']
  },
  {
    id: 'mem_2025_03_03',
    content: 'DATA PROVENANCE CONCERN: Auditor Dr. Elena Vance raised Minor Non-Conformity #2025-03-HR1 on TalentMatch-Screener v1.8. While adverse impact ratios for gender were acceptable (0.88), the applicant resume dataset included 12,000 public CVs scraped in 2023 without recorded GDPR Article 6 consent tokens. Required action: complete synthetic data replacement or purge.',
    systemId: 'talentmatch-v1.8',
    systemName: 'TalentMatch-Screener',
    auditorId: 'dr-elena-vance',
    auditorName: 'Dr. Elena Vance',
    framework: 'EU_AI_ACT',
    article: 'Article 10(3) - Data Provenance',
    findingType: 'MINOR_NON_CONFORMITY',
    severity: 'MEDIUM',
    status: 'IN_REVIEW',
    remediationDeadline: '2025-11-30',
    remediationOwner: 'Siddharth Rao',
    ownerStatus: 'ACTIVE',
    acceptedEvidenceFormat: 'GDPR_CONSENT_AUDIT_TRAIL',
    cycle: 'March 2025 Supervisory Audit',
    createdAt: '2025-03-19T10:15:00Z',
    tags: ['talentmatch', 'elena-vance', 'data-provenance', 'gdpr-consent']
  },
  {
    id: 'mem_2025_05_01',
    content: 'CLINICAL AUDIT PASS: Claire Dupont (CNIL/EDPB) inspected OmniCare-TriageAssist v2.0. Accepted evidence: Clinician override log table where doctors altered the model recommendation in 14.2% of high-acuity cases with mandatory clinical justification notes. Verified Article 13 & 14 compliance.',
    systemId: 'omnicare-v2.0',
    systemName: 'OmniCare-TriageAssist',
    auditorId: 'claire-dupont',
    auditorName: 'Claire Dupont',
    framework: 'EU_AI_ACT',
    article: 'Article 13 & 14 - Transparency & Oversight',
    findingType: 'COMMENDATION',
    severity: 'LOW',
    status: 'CLOSED',
    acceptedEvidenceFormat: 'CLINICAL_OVERRIDE_LOG_TABLE',
    cycle: 'May 2025 Healthcare Audit',
    createdAt: '2025-05-18T16:00:00Z',
    tags: ['omnicare', 'claire-dupont', 'clinical-override', 'article14-pass']
  },
  {
    id: 'mem_2024_10_01',
    content: 'TESTING STALENESS WARNING: Apex-CreditScorer v2.4 adversarial perturbation and drift testing (Control EU-AI-ACT-ART15) was last executed on 2024-10-22 (over 340 days ago). Internal Model Risk policy §6.1 requires semi-annual robustness testing (<180 days). Model drift risk is elevated due to recent European Central Bank rate fluctuations.',
    systemId: 'apex-credit-v2.4',
    systemName: 'Apex-CreditScorer',
    framework: 'INTERNAL_MODEL_RISK',
    article: 'Article 15 - Robustness & Cybersecurity',
    findingType: 'OBSERVATION',
    severity: 'HIGH',
    status: 'OPEN',
    cycle: 'October 2024 Drift Review',
    createdAt: '2024-10-22T08:30:00Z',
    tags: ['apex-credit', 'drift-stale', 'robustness-gap', 'over-180-days']
  },
  {
    id: 'mem_2024_11_01',
    content: 'BIOMETRIC SPOOFING BENCHMARK STALE: RiskShield-BiometricKYC v1.2 Presentation Attack Detection (PAD) was tested against ISO/IEC 30107-3 standards on 2024-11-05. Marcus Thorne noted that deepfake generative video threats have evolved rapidly and demanded updated test logs prior to the next annual review.',
    systemId: 'riskshield-kyc-v1.2',
    systemName: 'RiskShield-BiometricKYC',
    auditorId: 'marcus-thorne',
    auditorName: 'Marcus Thorne',
    framework: 'EU_AI_ACT',
    article: 'Article 15 - Cybersecurity & Robustness',
    findingType: 'OBSERVATION',
    severity: 'MEDIUM',
    status: 'OPEN',
    cycle: 'November 2024 Biometrics Review',
    createdAt: '2024-11-05T13:40:00Z',
    tags: ['riskshield', 'marcus-thorne', 'biometric-pad', 'deepfake-drift']
  }
];

export const SAMPLE_RAW_EVIDENCE_JSON = {
  model_id: 'Apex-CreditScorer-v2.4.1',
  audit_reference: 'EU-AI-ACT-ANNEX-III-COMPLIANCE-DRAFT',
  auditor_recipient: 'Dr. Elena Vance (TÜV Rheinland #0197)',
  evidence_format: 'RAW_JSON_CONFUSION_MATRIX_AND_PARITY_METRICS',
  verification_sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  test_timestamp: '2026-09-28T18:00:00Z',
  evaluation_dataset: {
    total_samples: 50000,
    cohort_period: '2025-Q1 to 2026-Q2',
    demographic_breakdown: {
      under_25: { count: 8200, positive_rate: 0.612, disparate_impact_vs_benchmark: 0.834 },
      age_25_to_55: { count: 32100, positive_rate: 0.734, disparate_impact_vs_benchmark: 1.000 },
      over_55: { count: 9700, positive_rate: 0.718, disparate_impact_vs_benchmark: 0.978 }
    }
  },
  confusion_matrix: {
    true_positives: 34120,
    false_positives: 2450,
    true_negatives: 11890,
    false_negatives: 1540,
    accuracy: 0.9202,
    precision: 0.9329,
    recall: 0.9568,
    f1_score: 0.9447
  },
  four_fifths_rule_status: {
    benchmark_cohort: 'age_25_to_55',
    lowest_cohort_ratio: 0.834,
    statutory_threshold: 0.800,
    determination: 'PASS_STATUTORILY_COMPLIANT'
  },
  human_oversight_telemetry: {
    underwriter_overrides_logged: 412,
    underwriter_override_agreement_rate: 0.941,
    kill_switch_test_timestamp: '2026-09-20T12:00:00Z',
    kill_switch_trip_latency_ms: 11.2
  }
};
