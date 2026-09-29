export type RiskTier = 'HIGH_RISK_ANNEX_III' | 'LIMITED_RISK' | 'MINIMAL_RISK' | 'GPAI_SYSTEMIC';

export type ComplianceFramework = 'EU_AI_ACT' | 'ISO_42001' | 'NIST_AI_RMF' | 'INTERNAL_MODEL_RISK';

export type FindingSeverity = 'MAJOR_NON_CONFORMITY' | 'MINOR_NON_CONFORMITY' | 'OBSERVATION' | 'COMMENDATION';

export type RemediationStatus = 'OPEN' | 'OVERDUE' | 'IN_REVIEW' | 'CLOSED' | 'ORPHANED';

export interface AISystem {
  id: string;
  name: string;
  version: string;
  category: string;
  euAiActArticle: string;
  riskTier: RiskTier;
  businessOwner: string;
  technicalLead: string;
  leadStatus: 'ACTIVE' | 'DEPARTED';
  assignedAuditorId: string;
  lastTestedDate: string; // ISO string
  daysSinceLastTest: number;
  openFindingsCount: number;
  complianceScore: number; // 0 - 100
  description: string;
  controls: {
    code: string;
    name: string;
    status: 'PASSED' | 'FAILED' | 'STALE' | 'NOT_TESTED';
    lastTested: string;
  }[];
}

export interface AuditorProfile {
  id: string;
  name: string;
  organization: string;
  accreditation: string;
  title: string;
  avatarUrl?: string;
  strictness: 'VERY_STRICT' | 'STRICT' | 'MODERATE';
  acceptedFormats: string[];
  rejectedFormats: string[];
  keyDirectives: string[];
  historicalQuote: string;
  lastAuditDate: string;
}

export interface StoredAuditMemory {
  id: string;
  content: string;
  systemId?: string;
  systemName?: string;
  auditorId?: string;
  auditorName?: string;
  framework?: ComplianceFramework;
  article?: string;
  findingType?: FindingSeverity;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status?: RemediationStatus;
  remediationDeadline?: string;
  remediationOwner?: string;
  ownerStatus?: 'ACTIVE' | 'DEPARTED';
  acceptedEvidenceFormat?: string;
  rejectedEvidenceFormat?: string;
  cycle: string; // e.g. "March 2025 Supervisory Audit"
  createdAt: string;
  tags: string[];
  similarityScore?: number;
}

export interface EvidenceSection {
  title: string;
  status: 'COMPLIANT' | 'WARNING' | 'GAP';
  content: string;
  format: string;
  dataSnippet?: Record<string, any> | string;
}

export interface EvidencePackage {
  id: string;
  systemId: string;
  systemName: string;
  title: string;
  framework: ComplianceFramework;
  targetAuditor: string;
  formatCompliantWith: string;
  generatedAt: string;
  disparateImpactRatio?: number;
  sections: EvidenceSection[];
  rawJsonLogs: Record<string, any>;
  auditReadinessScore: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  hasMemoryRecall?: boolean;
  recalledMemories?: StoredAuditMemory[];
  evidencePackage?: EvidencePackage;
  mode?: 'BEFORE_MEMORY' | 'AFTER_MEMORY' | 'STANDARD';
}

export interface TelemetryLog {
  id: string;
  type: 'RETAIN' | 'RECALL' | 'SYNTHESIZE' | 'SYSTEM_ALERT';
  timestamp: string;
  title: string;
  details: string;
  query?: string;
  score?: number;
}
