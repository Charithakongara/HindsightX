# HindsightX
Most meeting prep tools stop at a generic agenda. HindsightX goes further by remembering the full history of every interaction:

What concerns were raised last time

Which promises are still outstanding

The communication style that resonates best

Current sentiment toward your solution

Instead of starting from scratch, HindsightX equips you with context that actually matters, giving you an unfair advantage in every meeting.


# Why HindsightX

Most meeting prep tools stop at a generic agenda. HindsightX gives you an edge by remembering the full history of every interaction:

What concerns were raised last time

Which promises are still outstanding

The communication style that works best

Current sentiment toward your solution


# Project Structure

├── server.ts                       # Express backend server with Vite middleware & Gemini proxy routes
├── index.html                      # HTML entrypoint with metadata and SEO OpenGraph tags
├── package.json                    # Project dependencies, scripts (dev: tsx server.ts)
├── tsconfig.json                   # TypeScript configuration with path aliases
├── vite.config.ts                  # Vite build configuration with Tailwind CSS plugin
├── metadata.json                   # Applet manifest and runtime capability flags
├── article.md                      # 1,500-word technical article for publication
├── SUBMISSION_GUIDE.md             # Complete submission deliverables (LinkedIn post, video script, prompt)
│
└── src/
    ├── main.tsx                    # React application entry point (DOM root mount)
    ├── App.tsx                     # Top-level shell coordinating navigation and views
    ├── index.css                   # Global styles, Tailwind imports, custom scrollbars & keyframes
    │
    ├── types/
    │   └── index.ts                # TypeScript data contracts (AISystem, AuditorProfile, StoredAuditMemory, etc.)
    │
    ├── data/
    │   └── mockEnterpriseData.ts   # 2 years of audit cycles, 6 high-risk AI models, 3 auditor profiles
    │
    ├── services/
    │   ├── hindsightClient.ts      # Core Hindsight SDK wrapper (retain, recall, telemetry, event bus)
    │   └── agentEngine.ts          # Cognitive synthesis engine (stateless baseline vs memory-augmented)
    │
    └── components/
        ├── Header.tsx              # Top navigation bar, Copilot status indicator, memory counters
        ├── ChatConsole.tsx         # Primary HindsightX Copilot chat interface with quick action cards
        ├── DemoStoryWalkthrough.tsx# Interactive 60-second before/after demo storyboard
        ├── SystemsInventory.tsx    # High-Risk AI Systems matrix (EU AI Act Annex III, test staleness)
        ├── AuditorDossier.tsx      # Learned auditor preferences (accepted vs rejected formats)
        ├── EvidenceVault.tsx       # Pre-compiled raw JSON confusion matrices and verification hashes
        ├── MemoryInspector.tsx     # Deep-dive explorer into all retained Hindsight memory records
        ├── SubmissionKit.tsx       # In-app viewer for technical article, social post, and video script
        └── ArchitectureModal.tsx   # System diagram explaining Hindsight memory integration
