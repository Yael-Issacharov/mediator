// The shared analysis report (spec §13-14): six sections, evidence linked to the transcript,
// Observation / Hypothesis / Unknown kept visibly apart, and operator feedback per finding.
import { html, useState, useRef, useEffect } from '../lib.js';
import { useStore, update } from '../store.js';
import { DEMO_LABEL } from '../fallback.js';
import { Button, Card, Chip, Banner, Empty } from '../ui.js';

export const VERDICT = {
  communication_gap: 'Communication gap', genuine_disagreement: 'Genuine disagreement', mixed: 'Gaps and disagreement',
  no_meaningful_gap: 'No meaningful gap', insufficient_evidence: 'Insufficient evidence',
};
const VERDICT_SUB = {
  communication_gap: 'The main findings are misunderstandings or undefined expectations.',
  genuine_disagreement: 'They understand each other and still disagree. That is not a communication problem.',
  mixed: 'Both misunderstandings and genuine disagreement are present.',
  no_meaningful_gap: 'They understood each other and nothing important is unresolved.',
  insufficient_evidence: 'The conversation is too short or unclear to say.',
};
export const CAT = { meaning_expectations: 'Meaning & Expectations', communication_feedback: 'Communication & Feedback', interpretation: 'Interpretation', genuine_disagreement: 'Genuine disagreement' };
export const DIM = { formal_authority: 'Formal authority', expertise_dependency: 'Expertise & dependency', interactional_influence: 'Interactional influence', voice_participation: 'Voice & participation', decision_ownership: 'Decision ownership' };
const ACTION = { approved: ['ok', 'Approved by operator'], corrected: ['hyp', 'Corrected by operator'], rejected: ['bad', 'Rejected by operator'] };
const n = (k, w) => `${k} ${w}${k === 1 ? '' : 's'}`;

function useFeedback(analysisId) {
  const s = useStore();
  const latest = {};
  s.feedback.filter((f) => f.analysisId === analysisId).forEach((f) => { latest[f.insightId] = f; });
  const set = (insightId, action, correctionText = '') => update((st) => {
    st.feedback.push({ id: 'f' + Date.now().toString(36), analysisId, insightId, action, correctionText, createdAt: new Date().toISOString() });
  });
  return [latest, set];
}

const Ev = ({ list, onPick }) => html`<ul class="ev">${list.map((e) => html`<li class=${e.verified ? '' : 'unver'}>
  <button class="turnref" onClick=${() => onPick(e.turn)} title="Show in transcript">${e.turn}${e.ts ? ' · ' + e.ts : ''}</button>
  ${e.speaker === 'A' || e.speaker === 'B' ? html`<${Chip} tone=${e.speaker.toLowerCase()}>${e.speaker}<//>` : e.speaker === 'O' ? html`<${Chip}>Other<//>` : null}
  <q>${e.quote}</q>${e.verified ? null : html`<${Chip} tone="bad">Not found in transcript<//>`}</li>`)}</ul>`;

const Refs = ({ list, onPick }) => html`${list.filter((e) => e.verified).map((e) => html` <button class="turnref sm" onClick=${() => onPick(e.turn)}>${e.turn}</button>`)}`;

function Validation({ f, fb, set }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(fb && fb.correctionText || '');
  const cur = fb && fb.action;
  return html`<div class="valid">
    ${cur ? html`<${Chip} tone=${ACTION[cur][0]} dot>${ACTION[cur][1]}<//>` : html`<span class="small faint">AI finding · not reviewed</span>`}
    ${cur === 'corrected' && fb.correctionText && !editing ? html`<span class="small"><b>Correction:</b> ${fb.correctionText}</span>` : null}
    <span style="flex:1"></span>
    ${editing ? null : html`
      <${Button} size="sm" variant=${cur === 'approved' ? 'primary' : ''} onClick=${() => set(f.id, 'approved')} aria-pressed=${cur === 'approved'}>Approve<//>
      <${Button} size="sm" variant=${cur === 'corrected' ? 'primary' : ''} onClick=${() => setEditing(true)}>Correct<//>
      <${Button} size="sm" variant=${cur === 'rejected' ? 'primary' : 'danger'} onClick=${() => set(f.id, 'rejected')} aria-pressed=${cur === 'rejected'}>Reject<//>
      ${cur ? html`<${Button} size="sm" variant="ghost" onClick=${() => set(f.id, 'cleared')}>Undo<//>` : null}`}
    ${editing ? html`<div class="correct">
      <label class="small" for=${'c' + f.id}>What should this finding say instead?</label>
      <textarea id=${'c' + f.id} class="input" rows="2" value=${text} onInput=${(e) => setText(e.target.value)}></textarea>
      <div class="row"><${Button} size="sm" variant="primary" disabled=${!text.trim()} onClick=${() => { set(f.id, 'corrected', text.trim()); setEditing(false); }}>Save correction<//>
        <${Button} size="sm" variant="ghost" onClick=${() => setEditing(false)}>Cancel<//></div></div>` : null}
  </div>`;
}

function Finding({ f, kind, fb, set, onPick, qs }) {
  const rejected = fb && fb.action === 'rejected';
  const [open, setOpen] = useState(!rejected);
  useEffect(() => setOpen(!rejected), [rejected]);
  const [more, setMore] = useState(false);
  const hasMore = !!(f.why_it_matters || (f.alternative_explanations && f.alternative_explanations.length) || f.profile_context);
  return html`<article class=${`finding ${rejected ? 'rejected' : ''}`} id=${'f-' + f.id}>
    <header class="row"><${Chip}>${kind}<//>${f.confidence === 'uncertain' ? html`<${Chip} tone="warn">Uncertain<//>` : null}
      <h3 style="flex:1;min-width:200px">${f.title}</h3>
      ${rejected ? html`<${Button} size="sm" variant="ghost" onClick=${() => setOpen(!open)}>${open ? 'Hide' : 'Show'}<//>` : null}</header>
    ${rejected ? html`<p class="small muted">Rejected or disputed. This finding is not presented as established.</p>` : null}
    ${open ? html`
      <div class="ohu-block">
        <div class="ohu o"><span class="ohu-k">Observation</span><p>${f.observation}</p></div>
        ${f.hypothesis ? html`<div class="ohu h"><span class="ohu-k">Hypothesis</span><p>${f.hypothesis}</p></div>` : null}
        <div class="ohu u"><span class="ohu-k">Unknown</span><p>${f.unknowns.length ? f.unknowns.join(' ') : 'Nothing noted.'}</p></div>
      </div>
      <div><span class="label">Evidence</span><${Ev} list=${f.evidence} onPick=${onPick} /></div>
      ${f.clarification_question ? html`<p class="small"><b>Clarifying question.</b> ${f.clarification_question}</p>` : null}
      ${hasMore ? html`<div><button class="linkbtn small" aria-expanded=${more} onClick=${() => setMore(!more)}>${more ? 'Less detail' : 'Why it matters, other readings, profile context'}</button></div>` : null}
      ${more && f.why_it_matters ? html`<p class="small"><b>Why it matters.</b> ${f.why_it_matters}</p>` : null}
      ${more && f.alternative_explanations && f.alternative_explanations.length ? html`<p class="small"><b>Other possible readings.</b> ${f.alternative_explanations.join(' ')}</p>` : null}
      ${more && f.profile_context ? html`<p class="small ctxnote"><b>Profile context, not evidence.</b> ${f.profile_context}</p>` : null}` : null}
    <${Validation} f=${f} fb=${fb && fb.action !== 'cleared' ? fb : null} set=${set} />
  </article>`;
}

function Transcript({ turns, map, hl, names }) {
  const refs = useRef({});
  useEffect(() => { const el = refs.current[hl]; if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [hl]);
  const slot = (t) => (t.speaker ? (map[t.speaker] === 'A' || map[t.speaker] === 'B' ? map[t.speaker] : 'O') : 'U');
  return html`<div class="tpane">${turns.map((t) => { const s = slot(t); return html`
    <div class=${`tline ${s.toLowerCase()} ${hl === t.id ? 'hl' : ''}`} ref=${(el) => { refs.current[t.id] = el; }}>
      <div class="row small"><span class="label">${t.id}</span>${t.ts ? html`<span class="faint">${t.ts}</span>` : null}
        <b>${t.speaker || 'Not identified'}</b>${s === 'A' || s === 'B' ? html`<span class="faint">${names[s]}</span>` : null}</div>
      <p>${t.text}</p></div>`; })}</div>`;
}

const Sec = ({ title, n: num, aside, children }) => html`<section class="rsec"><div class="sec-head"><h2><span class="faint">${num}</span> ${title}</h2>${aside ? html`<span class="small faint">${aside}</span>` : null}</div>${children}</section>`;

// a: { id, result, demo?, model?, promptVersion?, createdAt?, conversationVersion?, participantVersions? }
export function Report({ a, turns, map, staleNote, onRerun, canRerun }) {
  const s = useStore();
  const [hl, setHl] = useState(null);
  const [fb, setFb] = useFeedback(a.id);
  const r = a.result;
  const [A, B] = s.participants;
  const names = { A: A.name, B: B.name };
  const pick = (t) => setHl(t);
  const reviewed = Object.values(fb).filter((f) => f.action !== 'cleared');
  const count = (k) => reviewed.filter((f) => f.action === k).length;
  const total = r.insights.length + r.power.length;
  const titleOf = Object.fromEntries([...r.insights, ...r.power].map((x) => [x.id, x.title]));
  const jump = (id) => { const el = document.getElementById('f-' + id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  return html`<div class="report">
    ${a.demo ? html`<div class="banner demo" role="status"><div><b>${DEMO_LABEL}</b><div class="small muted" style="font-weight:400">A hand-written example for this prepared scenario, shown because live analysis is unavailable or did not complete. It is not a result of the transcript or profiles you see now.</div></div></div>` : null}
    ${staleNote ? html`<${Banner} tone="warn">This report was generated from an earlier version of ${staleNote}. ${onRerun ? html`<${Button} size="sm" onClick=${onRerun} disabled=${!canRerun}>Rerun analysis<//>` : null}<//>` : null}
    <${Card}>
      <div class="row"><${Chip} tone=${r.verdict === 'genuine_disagreement' || r.verdict === 'no_meaningful_gap' ? 'ok' : 'warn'}>${VERDICT[r.verdict]}<//>
        ${a.demo ? html`<${Chip}>Demo example<//>` : html`<${Chip} tone="ok" dot>Live AI<//>`}
        <span class="small muted">${VERDICT_SUB[r.verdict]}</span></div>
      <p class="lead">${r.verdict_rationale}</p>
      <div class="recap"><span class="label">Key points</span>
        <ul>${(r.summary && r.summary.length ? r.summary : [...r.insights, ...r.power].filter((x) => x.confidence === 'supported').slice(0, 4).map((x) => x.title)).map((x) => html`<li>${x}</li>`)}</ul></div>
      <div class="row small muted">
        <span>${n(r.insights.length, 'finding')} · ${n(r.power.length, 'power observation')} · ${n(r.open_questions.length, 'open question')}</span>
        <span>Reviewed: ${count('approved')} approved, ${count('corrected')} corrected, ${count('rejected')} rejected, ${total - reviewed.length} not reviewed</span>
        ${a.demo ? null : html`<span>${a.model} · prompts v${a.promptVersion} · conversation v${a.conversationVersion}, profiles A v${a.participantVersions.A} / B v${a.participantVersions.B}</span>`}
      </div>
      <p class="small faint">Approving a finding records the operator’s view. It does not make the finding objectively true.</p>
    <//>

    <div class="rgrid">
      <div class="stack-lg">
        <${Sec} n="1" title="Shared ground" aside="Only what both explicitly agreed">
          ${r.shared_ground.length ? html`<${Card}><ul class="plain">${r.shared_ground.map((x) => html`<li>${x.text}<${Refs} list=${x.evidence} onPick=${pick} /></li>`)}</ul><//>`
            : html`<${Empty} title="No explicit agreement found">Silence or "okay" is not treated as agreement.<//>`}
        <//>
        <${Sec} n="2" title="Identified communication gaps" aside="Most consequential first">
          ${r.insights.length ? r.insights.map((f) => html`<${Finding} key=${f.id} f=${f} kind=${CAT[f.category]} fb=${fb[f.id]} set=${setFb} onPick=${pick} />`)
            : html`<${Empty} title="No communication gap found">The evidence does not support a misunderstanding. This is a valid result.<//>`}
        <//>
        <${Sec} n="3" title="Different perspectives" aside="Paraphrased; exact words are in the transcript">
          <div class="grid c2">${['A', 'B'].map((k) => html`<${Card} key=${k}>
            <div class="row"><${Chip} tone=${k.toLowerCase()}>Participant ${k}<//><b>${names[k]}</b></div>
            ${r.perspectives[k].length ? html`<ul class="plain">${r.perspectives[k].map((x) => html`<li>${x.text}<${Refs} list=${x.evidence} onPick=${pick} /></li>`)}</ul>` : html`<p class="small muted">Nothing recorded.</p>`}<//>`)}</div>
          <div class="grid c2">
            <${Card}><span class="label">Where positions differ</span>${r.perspectives.differ.length ? html`<ul class="plain">${r.perspectives.differ.map((x) => html`<li>${x}</li>`)}</ul>` : html`<p class="small muted">None noted.</p>`}<//>
            <${Card}><span class="label">Where perspectives overlap</span>${r.perspectives.overlap.length ? html`<ul class="plain">${r.perspectives.overlap.map((x) => html`<li>${x}</li>`)}</ul>` : html`<p class="small muted">None noted.</p>`}<//>
          </div>
        <//>
        <${Sec} n="4" title="Power Awareness" aside="Only dimensions the conversation shows; no scores">
          ${r.power.length ? r.power.map((f) => html`<${Finding} key=${f.id} f=${f} kind=${DIM[f.dimension]} fb=${fb[f.id]} set=${setFb} onPick=${pick} />`)
            : html`<${Empty} title="No power observation">The conversation gives no evidence for a power-related observation.<//>`}
        <//>
        <${Sec} n="5" title="Open questions" aside="To clarify, not to steer">
          ${r.open_questions.length ? html`<${Card}><ol class="qlist">${r.open_questions.map((q) => html`<li><span>${q.question}</span>
            <span class="row" style="gap:6px">${q.addressed_to === 'both' ? html`<${Chip}>Both<//>` : html`<${Chip} tone=${q.addressed_to.toLowerCase()}>For ${q.addressed_to}<//>`}
              ${q.relates_to.map((id) => html`<button class="turnref sm" onClick=${() => jump(id)}>${titleOf[id]}</button>`)}</span></li>`)}</ol><//>`
            : html`<${Empty} title="No open questions">Nothing was left unresolved.<//>`}
        <//>
        <${Sec} n="6" title="Suggested next steps" aside="Optional">
          ${r.next_steps.length ? html`<${Card}><ul class="plain">${r.next_steps.map((x) => html`<li>${x.text}</li>`)}</ul><//>` : html`<${Empty} title="No suggestions">No next step is needed.<//>`}
        <//>
        ${r.rejected_candidates.length ? html`<details class="card"><summary><b>Considered and set aside</b> <span class="small muted">${n(r.rejected_candidates.length, 'candidate')} the evidence did not support</span></summary>
          <ul class="plain small" style="margin-top:10px">${r.rejected_candidates.map((x) => html`<li><b>${x.title}.</b> <span class="muted">${x.reason}</span></li>`)}</ul></details>` : null}
      </div>
      <aside class="tcol"><div class="sec-head"><h2>Transcript</h2><span class="small faint">Click a turn reference to find it</span></div>
        <${Transcript} turns=${turns} map=${map} hl=${hl} names=${names} /></aside>
    </div>
  </div>`;
}
