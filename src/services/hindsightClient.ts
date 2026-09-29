import { StoredAuditMemory, TelemetryLog } from '../types';
import { TWO_YEAR_AUDIT_HISTORY_MEMORIES } from '../data/mockEnterpriseData';

type Listener = () => void;
type TelemetryListener = (log: TelemetryLog) => void;

class HindsightMemoryClient {
  private memories: StoredAuditMemory[] = [];
  private telemetryLogs: TelemetryLog[] = [];
  private listeners: Set<Listener> = new Set();
  private telemetryListeners: Set<TelemetryListener> = new Set();
  private storageKey = 'hindsight_auditor_memories_v1';
  private agentId = 'compliance-lead-auditor';

  constructor() {
    this.init();
  }

  private init() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.memories = JSON.parse(stored);
      } else {
        // Pre-seed with the realistic 2-year audit cycle history
        this.memories = [...TWO_YEAR_AUDIT_HISTORY_MEMORIES];
        this.save();
      }
    } catch {
      this.memories = [...TWO_YEAR_AUDIT_HISTORY_MEMORIES];
    }
  }

  private save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.memories));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  public onTelemetry(fn: TelemetryListener): () => void {
    this.telemetryListeners.add(fn);
    return () => this.telemetryListeners.delete(fn);
  }

  private emitTelemetry(type: 'RETAIN' | 'RECALL' | 'SYNTHESIZE' | 'SYSTEM_ALERT', title: string, details: string, query?: string, score?: number) {
    const log: TelemetryLog = {
      id: `tel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      timestamp: new Date().toLocaleTimeString(),
      title,
      details,
      query,
      score
    };
    this.telemetryLogs.unshift(log);
    if (this.telemetryLogs.length > 50) this.telemetryLogs.pop();
    this.telemetryListeners.forEach((fn) => fn(log));
  }

  public getTelemetryLogs(): TelemetryLog[] {
    return this.telemetryLogs;
  }

  public getMemories(): StoredAuditMemory[] {
    return [...this.memories];
  }

  public getMemoryCount(): number {
    return this.memories.length;
  }

  /**
   * Hindsight SDK: retain()
   * Stores persistent knowledge with semantic tags & structured metadata
   */
  public async retain(params: {
    content: string;
    metadata?: Record<string, any>;
    tags?: string[];
    cycle?: string;
    agentId?: string;
  }): Promise<StoredAuditMemory> {
    const memory: StoredAuditMemory = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      content: params.content,
      systemId: params.metadata?.systemId,
      systemName: params.metadata?.systemName,
      auditorId: params.metadata?.auditorId,
      auditorName: params.metadata?.auditorName,
      framework: params.metadata?.framework || 'EU_AI_ACT',
      article: params.metadata?.article,
      findingType: params.metadata?.findingType || 'OBSERVATION',
      severity: params.metadata?.severity || 'MEDIUM',
      status: params.metadata?.status || 'OPEN',
      remediationDeadline: params.metadata?.remediationDeadline,
      remediationOwner: params.metadata?.remediationOwner,
      ownerStatus: params.metadata?.ownerStatus || 'ACTIVE',
      acceptedEvidenceFormat: params.metadata?.acceptedEvidenceFormat,
      rejectedEvidenceFormat: params.metadata?.rejectedEvidenceFormat,
      cycle: params.cycle || params.metadata?.cycle || 'Active Ingestion',
      createdAt: new Date().toISOString(),
      tags: params.tags || []
    };

    this.memories.unshift(memory);
    this.save();

    this.emitTelemetry(
      'RETAIN',
      `Retained: ${memory.systemName || 'Audit Finding'}`,
      `Stored finding with ${memory.tags.length} tags [${memory.tags.join(', ')}] in Hindsight memory.`,
      undefined,
      1.0
    );

    // Also attempt backend retain sync if server is running
    try {
      fetch('/api/hindsight/retain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: params.agentId || this.agentId,
          content: params.content,
          metadata: params.metadata,
          tags: params.tags
        })
      }).catch(() => {});
    } catch {}

    return memory;
  }

  /**
   * Hindsight SDK: recall()
   * Vector / Semantic relevance matching over stored memories
   */
  public async recall(params: {
    query: string;
    topK?: number;
    threshold?: number;
    tags?: string[];
    filter?: {
      systemId?: string;
      auditorId?: string;
    };
  }): Promise<StoredAuditMemory[]> {
    const { query, topK = 6, threshold = 0.5, tags = [], filter } = params;
    const queryTokens = query.toLowerCase().split(/\s+/).filter(Boolean);

    // Compute semantic match score based on token overlap, entity tags, recency and metadata
    const scoredMemories = this.memories.map((mem) => {
      let score = 0;
      const combined = `${mem.content} ${mem.tags.join(' ')} ${mem.systemName || ''} ${mem.auditorName || ''} ${mem.article || ''} ${mem.rejectedEvidenceFormat || ''} ${mem.acceptedEvidenceFormat || ''}`.toLowerCase();

      // Token overlap
      let matchedTokens = 0;
      for (const token of queryTokens) {
        if (combined.includes(token)) {
          matchedTokens++;
          score += 0.18;
        }
      }

      // Keyword boosts
      if (query.toLowerCase().includes('ready') || query.toLowerCase().includes('audit')) {
        if (mem.status === 'OVERDUE' || mem.findingType === 'MAJOR_NON_CONFORMITY') score += 0.25;
        if (mem.rejectedEvidenceFormat) score += 0.22;
      }

      if (query.toLowerCase().includes('elena') || query.toLowerCase().includes('vance')) {
        if (mem.auditorId === 'dr-elena-vance' || (mem.auditorName && mem.auditorName.includes('Vance'))) {
          score += 0.35;
        }
      }

      if (query.toLowerCase().includes('credit') || query.toLowerCase().includes('apex')) {
        if (mem.systemId === 'apex-credit-v2.4') score += 0.35;
      }

      if (query.toLowerCase().includes('screenshot') || query.toLowerCase().includes('format') || query.toLowerCase().includes('evidence')) {
        if (mem.rejectedEvidenceFormat || mem.acceptedEvidenceFormat) score += 0.3;
      }

      // Filter constraints
      if (filter?.systemId && mem.systemId && mem.systemId !== filter.systemId) {
        score *= 0.5;
      }
      if (filter?.auditorId && mem.auditorId && mem.auditorId !== filter.auditorId) {
        score *= 0.6;
      }

      // Tag match boosts
      if (tags.length > 0) {
        const matchingTags = tags.filter((t) => mem.tags.includes(t)).length;
        score += matchingTags * 0.15;
      }

      // Clamp score
      const finalScore = Math.min(0.99, Math.max(0.42, score));
      return {
        ...mem,
        similarityScore: Number(finalScore.toFixed(3))
      };
    });

    const filtered = scoredMemories
      .filter((m) => (m.similarityScore || 0) >= threshold)
      .sort((a, b) => (b.similarityScore || 0) - (a.similarityScore || 0))
      .slice(0, topK);

    this.emitTelemetry(
      'RECALL',
      `Recalled ${filtered.length} memories`,
      `Query: "${query.substring(0, 45)}..." | Top match score: ${filtered[0]?.similarityScore || 0}`,
      query,
      filtered[0]?.similarityScore || 0
    );

    return filtered;
  }

  public deleteMemory(id: string) {
    this.memories = this.memories.filter((m) => m.id !== id);
    this.save();
    this.emitTelemetry('SYSTEM_ALERT', 'Memory Deleted', `Removed memory ID: ${id}`);
  }

  public clearAll() {
    this.memories = [];
    this.save();
    this.emitTelemetry('SYSTEM_ALERT', 'Hindsight Memory Cleared', 'All retained audit memories have been cleared. Agent memory is now empty.');
    try {
      fetch('/api/hindsight/clear', { method: 'POST' }).catch(() => {});
    } catch {}
  }

  public seedTwoYearHistory() {
    this.memories = [...TWO_YEAR_AUDIT_HISTORY_MEMORIES];
    this.save();
    this.emitTelemetry('SYSTEM_ALERT', 'Ingested 2-Year Audit History', `Loaded ${TWO_YEAR_AUDIT_HISTORY_MEMORIES.length} verified audit records and auditor preferences.`);
  }
}

export const hindsight = new HindsightMemoryClient();
