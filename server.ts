import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory persistent Hindsight store for backend
interface StoredMemory {
  id: string;
  agentId: string;
  content: string;
  metadata: Record<string, any>;
  tags: string[];
  createdAt: string;
  cycle?: string;
}

let hindsightMemoryStore: StoredMemory[] = [];

// Gemini Client initialization (if GEMINI_API_KEY is present)
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({ apiKey });
}

// REST Endpoints for Hindsight SDK compatibility
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    memoryCount: hindsightMemoryStore.length,
    geminiConfigured: !!aiClient,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/hindsight/retain', (req: Request, res: Response) => {
  const { agentId = 'compliance-lead', content, metadata = {}, tags = [] } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'content is required' });
  }

  const memory: StoredMemory = {
    id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    agentId,
    content,
    metadata,
    tags,
    createdAt: new Date().toISOString(),
    cycle: metadata.cycle || 'Active Session'
  };

  hindsightMemoryStore.unshift(memory);
  res.status(201).json({ success: true, memory });
});

app.post('/api/hindsight/recall', (req: Request, res: Response) => {
  const { query, topK = 5, tags = [] } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'query is required' });
  }

  const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

  // Score memories based on keyword & tag relevance
  const scored = hindsightMemoryStore.map((mem) => {
    let score = 0;
    const text = `${mem.content} ${mem.tags.join(' ')} ${JSON.stringify(mem.metadata)}`.toLowerCase();

    for (const term of queryTerms) {
      if (text.includes(term)) {
        score += 0.25;
      }
    }

    if (tags && tags.length > 0) {
      const tagMatches = tags.filter((t: string) => mem.tags.includes(t)).length;
      score += tagMatches * 0.3;
    }

    // Baseline minimum relevance
    const finalScore = Math.min(0.98, Math.max(0.45, score));
    return {
      id: mem.id,
      content: mem.content,
      metadata: mem.metadata,
      tags: mem.tags,
      createdAt: mem.createdAt,
      score: Number(finalScore.toFixed(3))
    };
  });

  scored.sort((a, b) => b.score - a.score);
  const results = scored.slice(0, topK);

  res.json({
    query,
    count: results.length,
    memories: results
  });
});

app.get('/api/hindsight/memories', (req: Request, res: Response) => {
  res.json({
    total: hindsightMemoryStore.length,
    memories: hindsightMemoryStore
  });
});

app.post('/api/hindsight/clear', (req: Request, res: Response) => {
  hindsightMemoryStore = [];
  res.json({ success: true, message: 'Hindsight memory reset to clean state' });
});

// Proxy route for AI-powered chat with Gemini
app.post('/api/agent/chat', async (req: Request, res: Response) => {
  const { message, recalledMemories = [], systemContext = {}, hasMemoryActive = false } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  // System instruction based on whether memory is active
  let systemInstruction = '';
  if (!hasMemoryActive || recalledMemories.length === 0) {
    systemInstruction = `You are a compliance assistant without institutional memory.
You do NOT know the organization's past audit history, past findings, or auditor preferences.
When the user asks if they are ready for an audit or about their models, provide a generic, high-level checklist based strictly on regulatory textbooks (EU AI Act, ISO 42001, NIST AI RMF).
Offer general principles: test data governance under Article 10, human oversight under Article 14, prepare technical documentation.
Do NOT pretend to know past audit dates, specific auditor requirements, or model names unless the user just typed them in this message.`;
  } else {
    systemInstruction = `You are "Hindsight Auditor", an AI governance and compliance memory agent for an enterprise bank.
You act as the organization's institutional memory. You retain all past audit findings, control tests, evidence decisions, and auditor feedback.

RECALLED AUDIT MEMORY (Retained via Hindsight):
${recalledMemories.map((m: any, i: number) => `[Memory #${i + 1} | Score: ${(m.score * 100).toFixed(0)}%]: ${m.content} (Metadata: ${JSON.stringify(m.metadata)})`).join('\n\n')}

SYSTEM CONTEXT:
${JSON.stringify(systemContext, null, 2)}

INSTRUCTIONS:
1. Ground your answer completely in the recalled Hindsight memory.
2. If there are overdue remediations, call them out specifically with dates, finding IDs, and who owned them (e.g. note if the owner left the company!).
3. Highlight known AUDITOR PREFERENCES (e.g., if Dr. Elena Vance rejected UI screenshots and demands raw JSON logs, WARN THEM explicitly).
4. Identify controls that haven't been tested in >180 days (testing staleness).
5. Be concrete, executive-level, and authoritative. Do not give generic textbook fluff when real audit history is available.`;
  }

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Question: ${message}` }] }
        ]
      });

      const replyText = response.text || 'Unable to generate response.';
      return res.json({ reply: replyText, modelUsed: 'gemini-3.8-flash' });
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to deterministic synthesizer:', err?.message);
    }
  }

  // Deterministic high-fidelity fallback if Gemini key is not configured or fails
  let reply = '';
  if (!hasMemoryActive || recalledMemories.length === 0) {
    reply = `### General EU AI Act High-Risk Audit Preparation Checklist

To prepare for an upcoming AI compliance audit, standard governance frameworks (EU AI Act, ISO/IEC 42001, NIST AI RMF) recommend verifying:

1. **Risk Management System (Article 9)**: Ensure risk identification and mitigation procedures are documented across the model lifecycle.
2. **Data & Data Governance (Article 10)**: Review training, validation, and testing datasets for quality, representative distributions, and bias mitigation.
3. **Technical Documentation (Article 11 & Annex IV)**: Verify architectural diagrams, training parameters, and performance validation benchmarks.
4. **Record-Keeping & Logging (Article 12)**: Ensure automated logging of system events and traceability is operational.
5. **Transparency & Information (Article 13)**: Ensure user-facing instructions and output interpretability are available.
6. **Human Oversight (Article 14)**: Confirm human-in-the-loop stop mechanisms and operational override controls.
7. **Accuracy, Robustness & Cybersecurity (Article 15)**: Run accuracy benchmarks and adversarial resilience tests.

*Note: As a stateless assistant without historical audit memory, I cannot see your past audit findings, overdue remediations, or assigned auditor evidentiary requirements.*`;
  } else {
    reply = `### ⚠️ AUDIT READINESS ASSESSMENT: NOT READY (2 Critical Gaps)

Based on **Hindsight Memory Recall** across the past 2 years of audit cycles, here is your organizational compliance briefing:

---

#### 1. 🚨 Critical Overdue Finding: #2025-03-B2 (Apex-CreditScorer v2.4)
- **Violation**: EU AI Act Article 10(2)(f) — Disparate impact ratio for applicants aged 18–25 fell to **0.74** (below the 0.80 four-fifths legal threshold).
- **History**: Issued during the March 2025 supervisory audit by **Dr. Elena Vance (TÜV Rheinland)**.
- **Commitment**: Sarah Chen promised re-weighted training calibration and validation by **June 30, 2025**.
- **RISK**: **Sarah Chen left the firm in July 2025.** This remediation is currently **orphaned and 92 days overdue**.

---

#### 2. ⚡ Critical Auditor Preference Alert: Dr. Elena Vance
- **Auditor History**: In the March 2025 audit, Dr. Vance **rejected UI dashboard screenshots** for model fairness and issued a formal warning.
- **Strict Requirement**: Mandates **raw confusion matrix logs (JSON)**, ROC curves with exact cross-validation folds, and demographic parity calculations down to 4 decimal places.
- *Action*: Do not submit Grafana or Tableau screenshots; use the Hindsight Evidence Generator to export the approved JSON log package.

---

#### 3. ⏱️ Testing Staleness Gaps
- **Control EU-AI-ACT-ART15 (Adversarial Robustness Testing)** for \`Apex-CreditScorer\`: Last tested **341 days ago** (October 22, 2024). Regulators flag any control untested for >180 days.
- **TalentMatch-Screener v1.8**: Candidate resume training provenance consent documentation remains unverified since September 2025.

---

#### Recommended Action Plan:
1. Re-assign orphaned finding #2025-03-B2 to **Alex Rivera (ML Ops)** immediately.
2. Click **"Generate Evidence Pack"** to export the raw JSON logs in the format Dr. Elena Vance approved for FraudGuard last cycle.`;
  }

  res.json({ reply, modelUsed: 'hindsight-synthesizer-fallback' });
});

// Setup Vite middleware in development or static in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Hindsight Auditor] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
