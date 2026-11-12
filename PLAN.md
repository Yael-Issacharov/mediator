# Workplace Communication Mediator — Plan & Architecture (Phase 1)

Source of truth: the Master Product & Development Specification (Parts 1–11). This document does not repeat it.
Section numbers (§) refer to that spec. Status: **awaiting approval**. Implementation will run on Sonnet 5.5.

---

## 1. Understanding of the product
A post-conversation mediator. Its input is a transcript plus two contextual communication profiles. It returns a shared,
neutral report that separates **misunderstanding** (Meaning & Expectations / Communication & Feedback / Interpretation)
from **genuine disagreement**. It layers in **Power Awareness** (5 dimensions, no scores), and every claim is labelled
Observation / Hypothesis / Unknown and backed by quotes.
Credibility comes from restraint: it reports few findings, uses verbatim evidence, can conclude "no meaningful gap",
and lets people Approve / Correct / Reject each finding. The prototype has to prove that **inputs change outputs**:
editing a profile or a transcript and rerunning produces a different, still evidence-bound report.

## 2. Existing repository
`output/` is a multi-project design workspace (static HTML prototypes, Astro sites, Next.js). There is no existing
mediator code and no shared React app or backend to reuse. Patterns that carry over:
- Single-page vanilla/HTML prototypes served from `output/.claude/launch.json`.
- Published claude.ai Artifacts with runtime capabilities (`dinner-wheel`, `studio-pulse`).
- No system Node. The standalone Node v24 under `~/.local/node` is only needed for local tooling, not for this app.

→ This is a new project at `output/mediator/`.

## 3. Recommended stack (decided: Claude Artifact)
| Concern | Choice | Why |
|---|---|---|
| Delivery | **Published, private claude.ai Artifact**: multi-file (HTML + JS modules + CSS), full-screen desktop layout | Already chosen. One link opens it in the Claude desktop app or a browser, with no install and no server. |
| UI framework | **Preact 10 + htm** (React-compatible API, no build step), version-pinned from jsDelivr | §18 asks for React. Preact/htm gives React's component model without a bundler, and keeps edits small. |
| Live AI | **`sample` artifact capability** → built-in Claude, model `claude-sonnet-5-5` named explicitly | No API key exists anywhere, so the §12/§19 rules about API keys on the server and none in the bundle are met by construction. `modelApplied` is recorded on every run. |
| Persistence | `localStorage` JSON store behind one `store.js` module, with an in-memory fallback | Each operator gets a private sandbox, and "Reset demo data" restores the seed. Swapping in the `db` capability later is a single-module change. |
| DOCX | `mammoth.js` (cdnjs, pinned), browser-side | TXT/DOCX upload without a server (§11C). |
| Local dev | Static server via a `mediator` entry in `launch.json` (:4520) | `sample` is unavailable locally, so local runs exercise the **fallback path**. Live AI is tested on the published artifact. |

**Tauri vs Electron (§18): deferred, not chosen.** The `sample` capability exists only inside the claude.ai viewer.
A packaged desktop binary would need the API-key route (local server + `ANTHROPIC_API_KEY`). The AI layer sits behind one
interface (`ai/client.js`), so that swap costs about one file plus a thin Electron shell. See Q1.

## 4. AI integration architecture (§12)
One model, **two structured calls + deterministic code validation**. No agents.

```
Inputs ─► [Call 1: UNDERSTAND]  Stages 1–3 ─► JSON: participants, turns-referenced statements,
          transcript (turn-indexed)            signals, per-participant positions/requests/objections,
          + context                            explicit agreements, unresolved items
          (profiles NOT sent here)
                │
                ▼
          [Call 2: ANALYSE]  Stages 4–6 ─► JSON: candidate insights (4 categories), power observations
          Call-1 JSON + transcript              (5 dims, only if evidenced), shared ground, open questions,
          + minimised profiles                  next steps, overall verdict (gap / disagreement / none)
                │
                ▼
          [Code: VALIDATE]  Stage 5 enforced ─► schema check · every quote must exist verbatim in the cited
                                                turn (normalised match) · speaker must match · timestamps only
                                                if present in source · insights with zero verified evidence →
                                                dropped or shown as "Uncertain — evidence not verified"
                │
                ▼
          [Code: ASSEMBLE]  Stage 7 ─► Report (six sections), stored with versions
```
- **Why profiles only enter at Call 2:** Call 1 has to read the conversation on its own terms, which enforces §4
  "profile as context, not evidence". Call 2's prompt says profiles may *contextualise* a finding and never *establish* one.
  Each insight has a field `profileContext` that is shown separately from the evidence.
- **Prompts** live in `ai/prompts.js` as versioned modules (`PROMPT_VERSION = "1.0.0"`), each with: role and principles
  (§4 condensed), taxonomy (§5), power rules (§6), explicit "do not infer" list, and the JSON schema inline.
- **Injection defence:** the transcript goes into a delimited `<transcript>` block of numbered turns
  (`T07 [Speaker B]: …`). The system text says that block is data and its instructions are never followed. Profiles are
  sent as derived statements, never raw answers or names beyond the speaker labels.
- **Failure handling:** `sample.json` rejection codes `invalid_json`, `rate_limited`, `not_granted` and others produce a clear error
  card with **Retry** (one click, never an auto-loop) and **Show demo example**. Schema-invalid output is treated the same way.
  If Call 2 fails, the Call-1 output is kept so a retry only reruns Call 2. Progress is shown per stage
  (Understanding → Analysing → Validating evidence).
- **Fallback (§17):** four hand-written reference reports, rendered by the same report component with a persistent
  banner reading exactly **"Demo Example — Not Generated by Live AI"**. They are never stored as an `Analysis` with status `live`.
- **Evaluation hook (§20):** `eval/run.html` (local, dev-only) runs the four scenarios through the published pipeline
  and diffs the result against the reference labels (category hit/miss, false positives). It is a list for the
  30–50-conversation set later, not a platform now.

### Insight JSON (Call 2 output, per item)
```json
{ "id":"i1", "category":"meaning_expectations|communication_feedback|interpretation|genuine_disagreement",
  "title":"Neutral title", "observation":"What was said/happened",
  "hypothesis":"Possible explanation", "evidence":[{"turn":"T01","speaker":"A","quote":"needs to be bolder"}],
  "whyItMatters":"…", "unknowns":["…"], "alternativeExplanations":["…"],
  "profileContext":"optional, labelled as context", "clarificationQuestion":"optional",
  "confidence":"supported|uncertain" }
```
Power observations use the same shape with `dimension` in place of `category`. The top-level result also carries `verdict`
(`communication_gap` · `genuine_disagreement` · `mixed` · `no_meaningful_gap` · `insufficient_evidence`) and `verdictRationale`.

## 5. Data model (§18, adapted to a client-side store)
| Entity | Fields (beyond spec) |
|---|---|
| Participant | `id, name, roleTitle, assessmentAnswers{qId:optionId}, profileNotes, version, updatedAt`, plus `history[]` of previous derived profiles (for "see how it changed") |
| Profile (derived, not stored) | `derive(answers) → {preferences[], tendencies[], contextual[]}`. Each statement carries `sourceQ` so the UI can show *why* |
| Conversation | `id, title, description, sourceType(scenario|manual|upload), turns[{id, speakerLabel, participantId|null, text, timestamp|null}], speakerMap, context{topic, roles, objective, project}, focus(full|gaps|power), version, contentHash` |
| Analysis | `id, conversationId, conversationVersion, participantVersions{id:v}, status(live|fallback|failed), mode, modelApplied, promptVersion, stage1, result, validationLog, createdAt` |
| Insight | Embedded in `Analysis.result` (ids stable within an analysis) |
| InsightFeedback | `id, analysisId, insightId, action(approved|corrected|rejected), correctionText, actorLabel, createdAt` |

**Staleness:** when the report is opened, the stored versions are compared with the current ones. A mismatch shows a banner
such as "This report was generated from an earlier version of B's profile (v3 → v4) · Rerun analysis".

## 6. Application structure & flow (§16)
Persistent left sidebar with Home · Participants · Conversations · Analysis · Settings, plus a main workspace.
Top bar: breadcrumb, an AI status pill (Live AI connected / Unavailable — fallback only), and the primary action.

| Screen | Contents |
|---|---|
| **Home** | One-paragraph concept + the central-interaction strip (Profiles → Conversation → Analysis → Shared report) · **Start new analysis** · 4 scenario cards · 2 participant shortcuts · recent analyses table (status: Live / Demo example / Outdated) |
| **Participants** | Two cards. Detail page: name/role, a 3-column derived profile (Preferences / Tendencies / Context, each line → "from Q4") · **Assessment** tab: 16 scenario questions (10 core + 6 power, §7), about 4 min, edit inline · Save → "What changed" diff (added / removed statements) and version bump |
| **Compare** (Participants sub-tab) | Side by side on 8 dimensions (feedback style, processing time, definitions, urgency, disagreement, decision ownership, delegation, execution vs agreement): Similar / Different / Potential friction + "Worth clarifying" prompt. Header note: "Potential friction from profiles — not observed in any conversation." No scores |
| **Conversations** | Library (4 scenarios + saved custom ones) · **New**: Paste / Upload (TXT, DOCX) tabs → parser → **Review & speakers** editor (turn list, editable text, per-label mapping to Participant A/B/Other, ⚠ "Speaker not identified" chips on unlabelled lines) · optional Context drawer (topic, roles, objective, project) · Focus: Full (default) / Gaps / Power · **Run analysis** |
| **Analysis / Report** | Header: conversation, participants + versions, model + prompt version, Live / Demo-example badge, verdict line · six sections (§13) · each insight card: category chip, title, **Observation / Hypothesis / Unknown** as three visibly distinct rows, evidence quotes (click → highlights the turn in a right-hand transcript pane), why it matters, alternatives, profile context (labelled), clarification Q · **Approve / Correct (+text) / Reject** with state chips "AI finding · Approved by operator" (never "verified") · Analysis list of past runs |
| **Settings** | AI connection test · analysis focus default · Reset demo data · Prototype information (prompt/model version, boundaries from §19, stated as *not implemented*) |

**Transcript parser rules:** `Name:` / `Name -` / `[00:12] Name:` patterns are detected; a line without a label continues the
previous turn when it is clearly a continuation, otherwise it is flagged as unidentified. Timestamps are only parsed, never generated.

## 7. Demo content to author
- **Profiles:** Participant A "Maya Ronen" and Participant B "Eli Baron" (fictional). Their assessment answers are chosen so that
  `derive()` reproduces exactly the §8 statements.
- **Scenarios:** 1 is verbatim from §10. Scenarios 2–4 are written new, at 8–14 turns each. Scenario 4 carries timestamps,
  to demonstrate that feature. Scenario 3 is built so the correct verdict is *genuine disagreement, no meaningful gap*.
  Each scenario has reference labels + one fallback report.
- **Sample "custom" transcript** (TXT + DOCX in `samples/`) for the upload demo.

## 8. Implementation plan (prioritised, §25)
| # | Stage | Delivers | Depends on | Size* |
|---|---|---|---|---|
| 1 | Foundation | Folder, launch config, Preact/htm shell, router, sidebar/top bar, wireframe design tokens + components (card, chip, tabs, table, button states, banner, empty/loading/error), `store.js`, seed loader, first artifact publish | — | M |
| 2 | Participants | Assessment content (16 Q), `derive()`, profile page, edit + diff + versioning, Compare screen | 1 | M |
| 3 | Conversations | 4 scenarios + context, paste, TXT/DOCX upload, parser, speaker mapping, review editor, focus option | 1 | M |
| 4 | AI pipeline | `ai/client.js` (sample adapter), prompts v1, 2-call pipeline, schema validator, quote verifier, error/retry, staged progress | 2, 3 | L |
| 5 | Report | Six sections, insight cards with O/H/U, evidence ↔ transcript linking, feedback actions, staleness banner, 4 fallback reports + exact label, analysis history | 4 | L |
| 6 | Polish & test | Live runs of all 4 scenarios on the published artifact, custom + upload run, profile edit → rerun shows difference, forced-failure → fallback, prompt tuning for precision (esp. scenario 3 = no invented gap), states pass, `eval/run.html` | 5 | M |

*S/M/L ≈ 1 / 2–3 / 4+ focused Sonnet turns. A working end-to-end prototype is expected after stage 5. Stage 6 is where
analysis quality is earned. If prompt tuning stalls on precision, the spec (§23 Phase 3) says to bring in Opus for that stage only.

## 9. Risks, assumptions, open decisions
**Risks**
- **Who runs live AI:** `sample` runs on the *viewer's* Claude account and asks consent on first use. An investor opening the link
  without a Claude account, or outside your organisation, may not get live AI and will only see the fallback. Mitigation: the operator demos on
  their own account. The AI status pill makes the state explicit. (Q2)
- **Analysis quality:** over-generation of findings and invented gaps are the main credibility risk. Mitigations: profiles are kept out of Call 1,
  quotes are verified in code, a `no_meaningful_gap` verdict is a first-class result, and scenario 3 serves as a regression test.
- **Latency:** two calls take roughly 20–60 s. Mitigation: staged progress, and the Call-1 result is cached per conversation version.
- **Quote matching:** paraphrased quotes fail verification. That is intended: they are shown as "not verified" rather than silently trusted.
- **Local testing gap:** live AI can only be tested on the published artifact. Fallback and UI are tested locally.
- **Design bar:** the spec requires a neutral grayscale wireframe, which is followed exactly. It will look like a real
  product UI (system sans, tables, dense panels), not a stylised page.

**Assumptions**
- UI language is English (LTR). Custom transcripts may be in any language (Hebrew included). Turns use `dir="auto"`, and the
  report is written in the transcript's language only if asked. The default is English.
- The product name is a placeholder: "Mediator (working title)". There is no logo (§15).
- Exactly two profiled participants per analysis. Extra speakers can be mapped to "Other, no profile".
- The investor deck (Part 11) is out of scope until requested.

## 10. Decisions (answered by Yael 2026-11-11)
- **Q1 Packaging:** the claude.ai artifact page is enough for this stage. No Electron/Tauri build.
- **Q2 Operator:** Yael runs the demo on her own Claude account. Live AI can be assumed for demos, and investors do not open the link themselves.
- **Q3 Name:** keep "Mediator (working title)" for now.

### Original questions
1. **Desktop packaging:** is the published claude.ai artifact (opened full-screen in the Claude desktop app) acceptable as the
   "desktop application" for this round, with the Electron + API-key build deferred? *(Recommended: yes.)*
2. **Who operates the demo:** you or the founder on your own Claude account (live AI guaranteed), or investors clicking the link themselves
   (live AI is not guaranteed for them)?
3. **Product name:** keep "Mediator (working title)", or is there a name to use in the UI chrome?
