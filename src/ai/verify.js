// Stage 5 in code: shape checks and verbatim quote verification. Nothing here calls the model.
// Every evidence item ends up with { turn, quote, speaker, ts, verified, note } where speaker and ts come
// from the transcript, never from the model.

export const CATEGORIES = ['meaning_expectations', 'communication_feedback', 'interpretation', 'genuine_disagreement'];
export const DIMENSIONS = ['formal_authority', 'expertise_dependency', 'interactional_influence', 'voice_participation', 'decision_ownership'];
export const VERDICTS = ['communication_gap', 'genuine_disagreement', 'mixed', 'no_meaningful_gap', 'insufficient_evidence'];

const norm = (s) => String(s || '').toLowerCase()
  .replace(/[‘’ʼ´`]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-')
  .replace(/\s+/g, ' ').trim();
const trimQuote = (s) => norm(s).replace(/^["'\s.,;:!?-]+|["'\s.,;:!?-]+$/g, '');
const str = (v) => (typeof v === 'string' ? v.trim() : '');
const arr = (v) => (Array.isArray(v) ? v : []);
const strs = (v) => arr(v).map(str).filter(Boolean);

export function slotOf(conv, turn) {
  if (!turn || !turn.speaker) return 'U';
  const s = conv.map[turn.speaker];
  return s === 'A' || s === 'B' ? s : 'O';
}

export function makeVerifier(conv, log) {
  const turns = conv.turns.map((t) => ({ t, n: norm(t.text) }));
  return function verifyEvidence(list, where) {
    return arr(list).map((e) => {
      const turnId = str(e && e.turn).toUpperCase(), q = trimQuote(e && e.quote);
      const base = { turn: turnId, quote: str(e && e.quote), speaker: null, ts: null, verified: false, note: '' };
      if (!q) { log.push({ where, issue: 'empty quote dropped' }); return null; }
      if (/\.\.\.|…/.test(q)) { log.push({ where, turn: turnId, issue: 'quote contains an ellipsis; not verifiable' }); return { ...base, note: 'Quote not found verbatim' }; }
      const words = q.split(' ').length;
      const cited = turns.find((x) => x.t.id === turnId);
      const hit = cited && cited.n.includes(q) ? cited : turns.find((x) => x.n.includes(q));
      if (!hit) { log.push({ where, turn: turnId, issue: 'quote not found in transcript' }); return { ...base, note: 'Quote not found verbatim' }; }
      if (hit !== cited) log.push({ where, turn: turnId, issue: `quote found in ${hit.t.id}, turn reference corrected` });
      if (words < 2) log.push({ where, turn: hit.t.id, issue: 'very short quote' });
      return { ...base, turn: hit.t.id, speaker: slotOf(conv, hit.t), ts: hit.t.ts || null, verified: true };
    }).filter(Boolean);
  };
}

// ---- stage 1 ----
export function checkStage1(raw, conv) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw { code: 'schema', message: 'The first analysis step did not return an object.' };
  const log = [], V = makeVerifier(conv, log);
  const items = (list, where, f) => arr(list).map((x, i) => (x && typeof x === 'object' ? f(x, `${where}[${i}]`) : null)).filter(Boolean);
  const out = {
    topics: strs(raw.topics),
    statements: items(raw.statements, 'statements', (x, w) => ({ turn: str(x.turn), speaker: str(x.speaker), type: str(x.type), summary: str(x.summary), evidence: V([{ turn: x.turn, quote: x.quote }], w) })),
    signals: items(raw.signals, 'signals', (x, w) => ({ type: str(x.type), description: str(x.description), evidence: V(x.evidence, w) })),
    perspectives: Object.fromEntries(['A', 'B'].map((k) => [k, items(raw.perspectives && raw.perspectives[k], `perspectives.${k}`, (x, w) => ({ kind: str(x.kind), text: str(x.text), evidence: V(x.evidence, w) }))])),
    explicit_agreements: items(raw.explicit_agreements, 'agreements', (x, w) => ({ description: str(x.description), evidence: V(x.evidence, w) })),
    unresolved: items(raw.unresolved, 'unresolved', (x, w) => ({ description: str(x.description), evidence: V(x.evidence, w) })),
  };
  if (!out.statements.length) throw { code: 'schema', message: 'The first analysis step returned no statements.' };
  return { value: out, log };
}

// ---- stage 2 ----
function finding(x, w, V, log, kind) {
  const ev = V(x.evidence, w);
  const verified = ev.filter((e) => e.verified).length;
  const key = kind === 'insight' ? 'category' : 'dimension';
  const allowed = kind === 'insight' ? CATEGORIES : DIMENSIONS;
  const k = str(x[key]);
  if (!allowed.includes(k)) { log.push({ where: w, issue: `unknown ${key} "${k}"; item dropped` }); return null; }
  if (!str(x.title) || !str(x.observation)) { log.push({ where: w, issue: 'missing title or observation; item dropped' }); return null; }
  let confidence = str(x.confidence) === 'supported' ? 'supported' : 'uncertain';
  if (!verified) { confidence = 'uncertain'; log.push({ where: w, issue: 'no verified evidence; marked uncertain' }); }
  return {
    id: str(x.id), [key]: k, title: str(x.title), observation: str(x.observation), hypothesis: str(x.hypothesis),
    evidence: ev, unknowns: strs(x.unknowns), confidence, evidenceVerified: verified > 0,
    ...(kind === 'insight' ? {
      why_it_matters: str(x.why_it_matters), alternative_explanations: strs(x.alternative_explanations),
      profile_context: str(x.profile_context), clarification_question: str(x.clarification_question),
    } : {}),
  };
}

export function checkStage2(raw, conv) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw { code: 'schema', message: 'The analysis step did not return an object.' };
  const verdict = str(raw.verdict);
  if (!VERDICTS.includes(verdict)) throw { code: 'schema', message: `The analysis returned an unknown verdict ("${verdict || 'empty'}").` };
  const log = [], V = makeVerifier(conv, log);
  const list = (v, w, f) => arr(v).map((x, i) => (x && typeof x === 'object' ? f(x, `${w}[${i}]`) : null)).filter(Boolean);
  const insights = list(raw.insights, 'insights', (x, w) => finding(x, w, V, log, 'insight'));
  insights.forEach((x, i) => { x.id = x.id || `i${i + 1}`; });
  const power = list(raw.power, 'power', (x, w) => finding(x, w, V, log, 'power'));
  power.forEach((x, i) => { x.id = x.id || `p${i + 1}`; });
  const ids = new Set([...insights, ...power].map((x) => x.id));
  const persp = raw.perspectives && typeof raw.perspectives === 'object' ? raw.perspectives : {};
  const result = {
    verdict, verdict_rationale: str(raw.verdict_rationale), summary: strs(raw.summary).slice(0, 4),
    shared_ground: list(raw.shared_ground, 'shared_ground', (x, w) => {
      const ev = V(x.evidence, w);
      if (!ev.some((e) => e.verified)) { log.push({ where: w, issue: 'shared ground without verified evidence; dropped' }); return null; }
      return { text: str(x.text), evidence: ev };
    }),
    insights, power,
    perspectives: {
      A: list(persp.A, 'perspectives.A', (x, w) => ({ text: str(x.text), evidence: V(x.evidence, w) })),
      B: list(persp.B, 'perspectives.B', (x, w) => ({ text: str(x.text), evidence: V(x.evidence, w) })),
      differ: strs(persp.differ), overlap: strs(persp.overlap),
    },
    open_questions: list(raw.open_questions, 'open_questions', (x) => (str(x.question) ? {
      question: str(x.question), addressed_to: ['A', 'B'].includes(str(x.addressed_to)) ? str(x.addressed_to) : 'both',
      relates_to: strs(x.relates_to).filter((r) => ids.has(r)),
    } : null)),
    next_steps: list(raw.next_steps, 'next_steps', (x) => (str(x.text) ? { text: str(x.text) } : null)),
    rejected_candidates: list(raw.rejected_candidates, 'rejected', (x) => (str(x.title) ? { title: str(x.title), reason: str(x.reason) } : null)),
  };
  return { value: result, log };
}

// Tolerant JSON extraction from a model reply: whole text, a fenced block, or first { to last }.
export function parseJsonReply(text) {
  const t = String(text || '').trim();
  const tries = [t, (t.match(/```(?:json)?\s*([\s\S]*?)```/) || [])[1], t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1)];
  for (const s of tries) { if (!s) continue; try { return JSON.parse(s); } catch { /* next */ } }
  throw { code: 'invalid_json', message: 'The reply was not valid JSON.', text: t };
}
