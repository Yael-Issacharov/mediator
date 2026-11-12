// Test runner (spec §20, §21): runs the live pipeline on all four prepared scenarios and compares each result
// with the scenario's reference labels. Reference labels are evaluation aids, not required conclusions,
// so "extra" findings are listed for review, not counted as wrong.
import { html, useState, useRef } from '../lib.js';
import { useStore, get } from '../store.js';
import { runPipeline } from '../ai/pipeline.js';
import { errorCopy } from '../ai/client.js';
import { hashConversation } from '../transcript.js';
import { VERDICT, CAT, DIM } from './report.js';
import { useAiStatus } from './config.js';
import { Button, Card, Chip, PageHeader, Banner, Table } from '../ui.js';

const words = (s) => (s ? s.trim().split(/\s+/).length : 0);

function scenarioConv(sc) {
  const c = {
    id: 'eval-' + sc.id, title: sc.title, turns: sc.turns.map(({ id, speaker, text, ts }) => ({ id, speaker, text, ts })),
    map: { [sc.roles[0]]: 'A', [sc.roles[1]]: 'B' }, focus: 'full',
    context: { topic: sc.context.topic, roleA: sc.roles[0], roleB: sc.roles[1], objective: sc.context.objective, project: sc.context.project },
  };
  c.contentHash = hashConversation(c.turns, c.context);
  return c;
}

function score(sc, r) {
  const ref = sc.reference;
  const findings = [...r.insights.map((f) => ({ ...f, key: f.category })), ...r.power.map((f) => ({ ...f, key: f.dimension }))];
  const turnsOf = (f) => f.evidence.filter((e) => e.verified).map((e) => e.turn);
  const used = new Set();
  const labels = ref.labels.filter((l) => l.kind === 'gap' || l.kind === 'power').map((l) => {
    const key = l.category || l.dimension;
    const near = (f) => turnsOf(f).some((t) => l.turns.includes(t));
    const sameKind = (f) => (l.kind === 'power' ? !!f.dimension : !!f.category);
    const exact = findings.find((f) => f.key === key && near(f));
    // Same moment, filed under another category: counted as found, with the category shown for review.
    const hit = exact || findings.find((f) => !used.has(f.id) && sameKind(f) && near(f));
    if (hit) used.add(hit.id);
    return { ...l, key, hit: hit ? hit.title : null, other: hit && !exact ? hit.key : null };
  });
  const extras = findings.filter((f) => !used.has(f.id));
  const ev = findings.flatMap((f) => f.evidence);
  const invented = ref.verdict === 'genuine_disagreement' ? r.insights.filter((f) => f.category !== 'genuine_disagreement') : [];
  const text = [r.verdict_rationale, ...(r.summary || []), ...findings.flatMap((f) => [f.title, f.observation, f.hypothesis, ...f.unknowns, f.why_it_matters, f.profile_context, f.clarification_question])].join(' ');
  return {
    verdictOk: r.verdict === ref.verdict, labels, extras, invented,
    quotes: `${ev.filter((e) => e.verified).length}/${ev.length}`, words: words(text),
  };
}

const kindName = (k) => CAT[k] || DIM[k] || k;

export function Eval() {
  const s = useStore();
  const [ai] = useAiStatus();
  const [rows, setRows] = useState({});
  const [busy, setBusy] = useState(null);
  const [copied, setCopied] = useState('');
  const ctl = useRef(null);
  const live = ai.state === 'live' || (location.hostname === 'localhost' && !!window.__mediatorMockReplies);

  const runAll = async () => {
    ctl.current = new AbortController();
    setRows({}); setCopied('');
    for (const sc of get().scenarios) {
      setBusy(sc.id);
      const t0 = Date.now();
      try {
        const rec = await runPipeline(scenarioConv(sc), get().participants, { focus: 'full', signal: ctl.current.signal });
        setRows((x) => ({ ...x, [sc.id]: { ok: true, rec, sc: score(sc, rec.result), secs: Math.round((Date.now() - t0) / 1000) } }));
      } catch (e) {
        if (e && e.code === 'cancelled') break;
        setRows((x) => ({ ...x, [sc.id]: { ok: false, error: errorCopy(e) } }));
      }
    }
    setBusy(null);
  };

  const report = () => s.scenarios.map((sc) => {
    const r = rows[sc.id];
    if (!r) return `${sc.id} ${sc.title}: not run`;
    if (!r.ok) return `${sc.id} ${sc.title}: FAILED (${r.error})`;
    const x = r.sc, res = r.rec.result;
    return [`${sc.id} ${sc.title}: verdict ${res.verdict} (expected ${sc.reference.verdict}) ${x.verdictOk ? 'OK' : 'DIFFERENT'} | quotes ${x.quotes} | ${x.words} words | ${r.secs}s | ${r.rec.model} | prompts ${r.rec.promptVersion}`,
      ...x.labels.map((l) => `  ref ${kindName(l.key)} "${l.title}": ${l.hit ? 'found as "' + l.hit + '"' + (l.other ? ' (filed under ' + kindName(l.other) + ')' : '') : 'MISSED'}`),
      ...x.extras.map((f) => `  extra ${kindName(f.category || f.dimension)} "${f.title}" (${f.confidence})`),
      ...x.invented.map((f) => `  INVENTED GAP in a disagreement scenario: "${f.title}"`),
      `  key points: ${(res.summary || []).join(' / ')}`].join('\n');
  }).join('\n');

  const copy = async () => {
    try { await navigator.clipboard.writeText(report()); setCopied('Copied. Paste it into the chat.'); }
    catch { setCopied('Copy was blocked. Select the text below and copy it.'); }
  };
  const done = Object.keys(rows).length;

  return html`
    <${PageHeader} title="Scenario tests" sub="Runs the live analysis on all four prepared scenarios with the current profiles, and compares each result with the scenario’s reference labels." />
    <${Card}>
      <div class="row"><${Button} variant="primary" loading=${!!busy} disabled=${!live} onClick=${runAll}>Run all four scenarios<//>
        ${busy ? html`<${Button} variant="ghost" onClick=${() => ctl.current.abort()}>Stop<//>` : null}
        <span class="small muted">${busy ? `Running ${s.scenarios.find((x) => x.id === busy).title}… (${done} of 4 done)` : '8 model calls, about 2 to 4 minutes. Nothing is saved to your analyses.'}</span></div>
      ${!live ? html`<p class="small muted">Live AI is not available in this view. Open the published page in the Claude app.</p>` : null}
      <p class="small faint">Reference labels are what a careful reader would expect, not required answers. "Extra" findings need a human look; they are not automatically wrong. A disagreement scenario must not produce a communication gap.</p>
    <//>
    ${done ? html`
      <${Table} cols=${['Scenario', 'Verdict', 'Reference points found', 'Extra findings', 'Quotes', 'Length']}
        rows=${s.scenarios.filter((sc) => rows[sc.id]).map((sc) => {
          const r = rows[sc.id];
          if (!r.ok) return [sc.title, html`<${Chip} tone="bad">Failed<//>`, r.error, '', '', ''];
          const x = r.sc;
          return [html`<b>${sc.title}</b>`,
            html`<div class="stack"><${Chip} tone=${x.verdictOk ? 'ok' : 'warn'}>${VERDICT[r.rec.result.verdict]}<//>${x.verdictOk ? null : html`<span class="small faint">expected ${VERDICT[sc.reference.verdict]}</span>`}</div>`,
            html`<div class="stack small">${x.labels.map((l) => html`<span>${l.hit ? '✓' : '✗'} ${l.title}${l.other ? html` <span class="faint">(under ${kindName(l.other)})</span>` : null}</span>`)}</div>`,
            html`<div class="stack small">${x.invented.map((f) => html`<${Chip} tone="bad">Invented gap: ${f.title}<//>`)}${x.extras.map((f) => html`<span>${f.title}</span>`)}${!x.extras.length && !x.invented.length ? html`<span class="faint">None</span>` : null}</div>`,
            x.quotes, `${x.words} words`];
        })} />
      ${!busy ? html`<${Card}><div class="row"><h3 style="flex:1">Results as text</h3><${Button} size="sm" onClick=${copy}>Copy results<//></div>
        ${copied ? html`<p class="small muted">${copied}</p>` : null}
        <pre class="raw">${report()}</pre><//>` : null}` : null}`;
}
