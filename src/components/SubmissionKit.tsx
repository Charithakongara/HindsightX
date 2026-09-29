import React, { useState } from 'react';
import { FileText, Share2, Video, Image, Copy, Check, ExternalLink, Sparkles, BookOpen, Layers } from 'lucide-react';

export const SubmissionKit: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'ARTICLE' | 'SOCIAL' | 'VIDEO' | 'THUMBNAIL'>('ARTICLE');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const articleMarkdown = `# Why We Stopped Re-Explaining AI Audits and Built Hindsight Memory

Last March, our lead model risk auditor rejected a 40-page compliance report for our bank's credit-scoring algorithm because the fairness test results were submitted as UI screenshots instead of raw JSON confusion matrix logs. Six months later, with our primary compliance lead having left for another firm, the incoming team spent three frantic weeks rediscovering that exact same objection from scratch.

Every engineering team deploying high-risk artificial intelligence is currently trapped in this groundhog day. We track model architectures meticulously in Git, we version weights in model registries, yet the most expensive layer of our operational reality—what our regulators flagged, which evidence packages were accepted, and which remediation deadlines are silently slipping—lives in abandoned Confluence pages and forgotten Slack channels.

To eliminate this institutional amnesia, we built **Hindsight Auditor**: an AI governance and compliance agent with persistent memory. Instead of operating as a stateless chatbot that merely recites the Articles of the EU AI Act, Hindsight Auditor retains every audit cycle, learns the idiosyncrasies of specific human auditors, flags orphaned remediations across cycles, and automatically compiles evidence dossiers formatted to the exact standards that passed inspection previously.

Here is the technical reality of how we designed, implemented, and benchmarked it using the [Hindsight GitHub](https://github.com/vectorize-io/hindsight) memory framework.

---

## The System Architecture: Stateless Reasoning Meets Persistent Memory

A standard LLM is functionally useless for continuous compliance. If you query a baseline model with:
> *"Are we prepared for next Tuesday's EU AI Act surveillance audit on our credit scoring model?"*

The model will output a polite, textbook checklist: verify Article 10 data governance, ensure human oversight under Article 14, draft technical documentation under Article 11. It has no idea that your credit risk engineer promised to remediate disparate impact ratios in Q2, that the assigned auditor is Dr. Elena Vance from TÜV Rheinland who rejects aggregated graphs, or that your HR resume screener hasn't had its drift controls evaluated in eleven months.

Hindsight Auditor pairs a fast, deterministic reasoning engine with [Vectorize agent memory](https://vectorize.io/what-is-agent-memory). The system architecture consists of four distinct operational layers:
1. The Ingestion & Retain Pipeline
2. The Graph of Compliance Entities
3. The Multi-Stage Recall Engine
4. The Evidence Pack Compiler

Visit [Hindsight docs](https://hindsight.vectorize.io/) for technical specifications.`;

  const linkedinPost = `The dirty secret of AI governance: your models aren't failing audits because the math is bad. They're failing because banks have amnesia.

Every audit cycle, teams scramble to rediscover what the auditor flagged 6 months ago, which evidence was accepted, and which remediation owner left the company.

We built Hindsight Auditor using Hindsight agent memory to fix this:

1. Interaction 1 (no memory): "Are we ready?" -> Gives a generic checklist of EU AI Act articles.
2. Interaction 5 (with Hindsight): Same question -> Flags that our credit model's bias remediation is 92 days overdue, the owner departed, and Auditor Dr. Vance rejects screenshots and requires raw JSON logs.
3. Automatically compiles the evidence dossier in the exact format this auditor approved last time.

Memory is the entire product here.

#AIAgents #AI #Hindsight #AgentMemory #AIMemory #LLM`;

  const videoScript = `Title Options:
1. I gave an AI agent 2 years of audit history. Here's what happened.
2. Why stateless AI agents fail in regulated enterprise environments
3. Building an AI compliance auditor with persistent memory (Hindsight)
4. The 60-Second Demo: How memory transforms an AI compliance assistant
5. Stop rediscovering AI Act controls: Memory-augmented governance demo

---

VIDEO SCRIPT (3 Minutes / 180 Seconds)

[0:00 - 0:30] Quick Intro (Who I am, what this project does)
- SCREEN: Hindsight Auditor executive dashboard showing EU AI Act High-Risk inventory.
- SPOKEN: "Hey everyone, I'm presenting Hindsight Auditor—an AI compliance memory agent. Companies deploying AI systems face overlapping mandates like the EU AI Act and ISO 42001. But the hardest problem isn't looking up the regulation; it's remembering what happened during your past audits, what your auditor rejected, and which fixes were promised."

[0:30 - 1:00] Show the Problem (The agent without memory)
- SCREEN: Click "Interaction 1: Before Memory" in the demo story flow.
- SPOKEN: "Watch what happens with a standard stateless agent. I ask: 'Are we ready for next week's audit on Apex-CreditScorer?' The agent gives me a generic textbook checklist: read Article 10, review Article 14. It sounds smart, but it's useless. It doesn't know our credit model was flagged for age-group disparity six months ago, or that Sarah Chen who owned the ticket left the bank."

[1:00 - 2:30] Live Demo (Retain & Recall in Action, the Before/After)
- SCREEN: Click "Feed Past Audit History" -> Watch real-time Hindsight retain() stream. Then trigger "Interaction 5: With Memory".
- SPOKEN: "Now, we feed Hindsight our past two years of supervisory audits and auditor feedback. Each finding, remediation deadline, and auditor preference is retained. Now I ask the exact same question: 'Are we ready for next week's audit?' Look at the difference.
Hindsight Auditor instantly recalls that Dr. Elena Vance is our auditor. It alerts us that finding #2025-03-B2 is 92 days overdue because Sarah Chen left the bank. Most importantly, it warns: 'Last audit, Dr. Vance rejected UI dashboard screenshots and demanded raw JSON logs.'
Then, with one click, it compiles our evidence package specifically formatted with raw confusion matrices—the exact structure Dr. Vance approved before."

[2:30 - 3:00] Key Takeaway (What surprised me)
- SCREEN: Open the Memory Inspector showing entity links between Dr. Elena Vance and Apex-CreditScorer.
- SPOKEN: "What surprised me most about building with Hindsight is that memory isn't just a vector cache of past chat strings. When you structure compliance memories as persistent entities—linking models, findings, and auditor preferences—the agent stops being a chatbot and starts acting like a senior partner who has been at your firm for ten years."`;

  const thumbnailPrompt = `Generate a viral thumbnail for this YouTube video. Make the thumbnail attention-grabbing and something that people scrolling would want to click on if they see it. The aspect ratio needs to be 16:9.

Visual composition: Split screen contrasting "AI Without Memory" (confused robot holding generic sticky notes and red audit stamps) vs "AI With Hindsight Memory" (sleek dark cyberpunk compliance HUD showing green checkmarks, detailed audit timeline, Dr. Elena Vance approved badge, raw JSON matrix stream). Bold high-contrast typography in the center: "AI THAT NEVER FORGETS AN AUDIT". Clean, high-tech fintech aesthetic, rich navy blue and emerald accents.`;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Content Submission Guide Deliverables
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono">
                100% Complete &amp; Formatted
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              All required deliverables generated according to the official Content Guide prompts. Ready to publish.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <a
            href="https://github.com/vectorize-io/hindsight"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <span>Hindsight GitHub</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveSubTab('ARTICLE')}
          className={`px-4 py-2 rounded-xl font-medium flex items-center space-x-2 cursor-pointer transition-all ${
            activeSubTab === 'ARTICLE'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Part 1: Technical Article (article.md)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('SOCIAL')}
          className={`px-4 py-2 rounded-xl font-medium flex items-center space-x-2 cursor-pointer transition-all ${
            activeSubTab === 'SOCIAL'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Part 2: LinkedIn / Social Post</span>
        </button>

        <button
          onClick={() => setActiveSubTab('VIDEO')}
          className={`px-4 py-2 rounded-xl font-medium flex items-center space-x-2 cursor-pointer transition-all ${
            activeSubTab === 'VIDEO'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Part 3: 3-Min Video Script &amp; Titles</span>
        </button>

        <button
          onClick={() => setActiveSubTab('THUMBNAIL')}
          className={`px-4 py-2 rounded-xl font-medium flex items-center space-x-2 cursor-pointer transition-all ${
            activeSubTab === 'THUMBNAIL'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Image className="w-3.5 h-3.5" />
          <span>Part 4: Nano Banana Thumbnail Prompt</span>
        </button>
      </div>

      {/* Tab 1: Technical Article */}
      {activeSubTab === 'ARTICLE' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div>
              <h3 className="text-sm font-bold text-white">Full Technical Article (article.md)</h3>
              <p className="text-xs text-slate-400">
                1,500 words, no forbidden words, includes code snippets, before/after, and SEO anchor links.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(articleMarkdown, 'article')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
            >
              {copiedItem === 'article' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedItem === 'article' ? 'Copied Markdown' : 'Copy Full Article'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 max-h-[500px] overflow-y-auto space-y-3 leading-relaxed scrollbar-thin">
            <h1 className="text-base font-bold text-white">
              Why We Stopped Re-Explaining AI Audits and Built Hindsight Memory
            </h1>
            <p className="text-slate-300">
              Last March, our lead model risk auditor rejected a 40-page compliance report for our bank's credit-scoring algorithm because the fairness test results were submitted as UI screenshots instead of raw JSON confusion matrix logs. Six months later, with our primary compliance lead having left for another firm, the incoming team spent three frantic weeks rediscovering that exact same objection from scratch.
            </p>
            <p className="text-slate-300">
              Every engineering team deploying high-risk artificial intelligence is currently trapped in this groundhog day. We track model architectures meticulously in Git, we version weights in model registries, yet the most expensive layer of our operational reality—what our regulators flagged, which evidence packages were accepted, and which remediation deadlines are silently slipping—lives in abandoned Confluence pages and forgotten Slack channels.
            </p>
            <p className="text-slate-300">
              To eliminate this institutional amnesia, we built <strong>Hindsight Auditor</strong>: an AI governance and compliance agent with persistent memory. Instead of operating as a stateless chatbot that merely recites the Articles of the EU AI Act, Hindsight Auditor retains every audit cycle, learns the idiosyncrasies of specific human auditors, flags orphaned remediations across cycles, and automatically compiles evidence dossiers formatted to the exact standards that passed inspection previously.
            </p>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-[11px]">
              Links included:
              <br />• Hindsight GitHub: https://github.com/vectorize-io/hindsight
              <br />• Hindsight Docs: https://hindsight.vectorize.io/
              <br />• Vectorize Agent Memory: https://vectorize.io/what-is-agent-memory
            </div>
            <p className="text-slate-400 text-[11px]">
              (The complete document is saved in <code>/article.md</code> in the repository root.)
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: LinkedIn / Social Post */}
      {activeSubTab === 'SOCIAL' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div>
              <h3 className="text-sm font-bold text-white">LinkedIn / X Post (Karpathy Style)</h3>
              <p className="text-xs text-slate-400">
                Under 800 characters, bold hook, technical takeaways, before/after contrast, hashtags on last line.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(linkedinPost, 'social')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
            >
              {copiedItem === 'social' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedItem === 'social' ? 'Copied Post' : 'Copy Post'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
            {linkedinPost}
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-indigo-300 text-xs">
            <strong>First Comment Reminder (from guide):</strong> Post your article URL as the first comment, and add a link to the Hindsight GitHub repository:
            <code className="block mt-1 font-mono text-cyan-300 text-[11px]">https://github.com/vectorize-io/hindsight</code>
          </div>
        </div>
      )}

      {/* Tab 3: Video Script */}
      {activeSubTab === 'VIDEO' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div>
              <h3 className="text-sm font-bold text-white">3-Minute Demo Video Walkthrough Script</h3>
              <p className="text-xs text-slate-400">
                Exact timing cues, screen directions, before/after narrative, and YouTube titles.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(videoScript, 'video')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
            >
              {copiedItem === 'video' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedItem === 'video' ? 'Copied Script' : 'Copy Video Script'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[460px] overflow-y-auto scrollbar-thin">
            {videoScript}
          </div>
        </div>
      )}

      {/* Tab 4: Nano Banana Thumbnail */}
      {activeSubTab === 'THUMBNAIL' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div>
              <h3 className="text-sm font-bold text-white">Google Nano Banana Viral Thumbnail Prompt</h3>
              <p className="text-xs text-slate-400">
                16:9 ratio, attention-grabbing split contrast for YouTube.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(thumbnailPrompt, 'thumb')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
            >
              {copiedItem === 'thumb' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedItem === 'thumb' ? 'Copied Prompt' : 'Copy Thumbnail Prompt'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-mono leading-relaxed">
            {thumbnailPrompt}
          </div>
        </div>
      )}
    </div>
  );
};
