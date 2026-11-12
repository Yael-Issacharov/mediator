import { html, useState, useRef } from '../lib.js';
import { useStore, update, get } from '../store.js';
import { runPipeline, STAGES } from '../ai/pipeline.js';
import { errorCopy } from '../ai/client.js';
import { demoReport } from '../fallback.js';
import { useAiStatus } from './config.js';
import { Report, VERDICT } from './report.js';
import { Button, Card, Chip, PageHeader, Section, Banner, Table, Empty } from '../ui.js';

export { VERDICT };
const fmt = (iso) => new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

// Which inputs changed since an analysis was run (spec §18 versioning).
export function staleness(a, s) {
  const conv = s.conversations.find((c) => c.id === a.conversationId);
  const out = [];
  if (conv && conv.version !== a.conversationVersion) out.push(`the conversation (v${a.conversationVersion} → v${conv.version})`);
  s.participants.forEach((p) => { const v = a.participantVersions[p.slot]; if (v && v !== p.version) out.push(`${p.name}'s profile (v${v} → v${p.version})`); });
  return out;
}

function Progress({ stage, onCancel }) {
  const idx = STAGES.findIndex((x) => x.id === stage);
  return html`<${Card}><div class="row"><h3 style="flex:1">Analysing</h3><${Button} size="sm" variant="ghost" onClick=${onCancel}>Stop<//></div>
    <ol class="steps">${STAGES.map((x, i) => html`<li class=${i < idx ? 'done' : i === idx ? 'now' : ''}>
      <span class="mark">${i < idx ? '✓' : i === idx ? html`<span class="spinner"></span>` : i + 1}</span>
      <div><b>${x.label}</b><div class="small muted">${x.sub}</div></div></li>`)}</ol>
    <p class="small faint">Two calls to one model, then code checks every quote. This usually takes under a minute.</p><//>`;
}

function Technical({ a }) {
  const log = [...(a.stage1Log || []), ...(a.log || [])];
  return html`<details class="card"><summary><b>Technical details</b> <span class="small muted">model, prompt version, validation log, raw result</span></summary>
    <dl class="kv small" style="margin-top:10px">
      <dt>Model</dt><dd>${a.model} (requested ${a.modelRequested})</dd><dt>Prompt version</dt><dd>${a.promptVersion}</dd>
      <dt>Duration</dt><dd>${Math.round(a.durationMs / 1000)} s</dd>
      <dt>Validation log</dt><dd>${log.length ? html`<ul class="plain">${log.map((l) => html`<li>${l.where}${l.turn ? ' (' + l.turn + ')' : ''}: ${l.issue}</li>`)}</ul>` : 'No issues'}</dd></dl>
    <pre class="raw">${JSON.stringify({ stage1: a.stage1, result: a.result }, null, 2)}</pre></details>`;
}

export function Analysis() {
  const s = useStore();
  const [ai] = useAiStatus();
  const [run, setRun] = useState(null);
  const [fail, setFail] = useState(null);
  const [demo, setDemo] = useState(false);
  const ctl = useRef(null);
  const conv = s.conversations.find((x) => x.id === s.ui.activeConversation);
  const mine = conv ? s.analyses.filter((a) => a.conversationId === conv.id) : [];
  const shown = s.analyses.find((a) => a.id === s.ui.activeAnalysis && conv && a.conversationId === conv.id) || mine[mine.length - 1];
  const live = ai.state === 'live' || (location.hostname === 'localhost' && !!window.__mediatorMockReplies);
  const scenario = conv && conv.scenarioId ? s.scenarios.find((x) => x.id === conv.scenarioId) : null;

  const start = async (prev) => {
    ctl.current = new AbortController();
    setFail(null); setDemo(false); setRun({ stage: 'understand' });
    const st = get(), c = JSON.parse(JSON.stringify(conv));
    try {
      const rec = await runPipeline(c, st.participants, { focus: c.focus, prev, signal: ctl.current.signal, onStage: (stage) => setRun({ stage }) });
      const a = {
        id: 'a' + Date.now().toString(36), title: c.title, conversationId: c.id, conversationVersion: c.version, conversationHash: c.contentHash,
        turns: c.turns, map: c.map, participantVersions: Object.fromEntries(st.participants.map((p) => [p.slot, p.version])),
        status: 'live', focus: c.focus, createdAt: new Date().toISOString(), ...rec,
      };
      update((x) => { x.analyses.push(a); x.ui.activeAnalysis = a.id; });
      setRun(null);
    } catch (e) {
      setRun(null);
      if (e && e.code === 'cancelled') return;
      setFail({ error: e, partial: e && e.partial ? { ...e.partial, conversationHash: c.contentHash } : null });
    }
  };

  if (!conv) return html`<${PageHeader} title="Analysis" sub="The shared report and the history of runs." />
    <${Empty} title="No conversation selected" action=${html`<${Button} variant="primary" onClick=${() => { location.hash = 'conversations'; }}>Choose a conversation<//>`}>Pick a prepared scenario or add a transcript, then run the analysis.<//>`;

  const stale = shown ? staleness(shown, s) : [];
  const [A, B] = s.participants;
  const demoData = demo && scenario ? demoReport(scenario) : null;
  const demoBtn = scenario && !demo ? html`<${Button} onClick=${() => setDemo(true)}>Show demo example<//>` : null;

  return html`
    <${PageHeader} title=${conv.title} sub="Shared analysis report for one conversation, in the context of both participants." />
    <${Card}><div class="row">
      <${Chip}>Conversation v${conv.version}<//><${Chip} tone="a">${A.name} · profile v${A.version}<//><${Chip} tone="b">${B.name} · profile v${B.version}<//>
      <span class="small muted">${conv.turns.length} turns · focus: ${conv.focus}</span><span style="flex:1"></span>
      <${Button} variant="ghost" onClick=${() => { update((x) => { x.ui.draft = JSON.parse(JSON.stringify(conv)); }); location.hash = 'conversations'; }}>Edit conversation<//>
      ${!live ? demoBtn : null}
      <${Button} variant="primary" loading=${!!run} disabled=${!live} onClick=${() => start(null)}>${shown ? 'Run again' : 'Run analysis'}<//></div>
      ${!live ? html`<p class="small muted">Live AI is not available in this view, so the analysis cannot run here. ${scenario ? 'You can open the labelled demo example for this scenario instead.' : 'Demo examples exist only for the four prepared scenarios.'}</p>` : null}
    <//>
    ${run ? html`<${Progress} stage=${run.stage} onCancel=${() => ctl.current && ctl.current.abort()} />` : null}
    ${fail && !run ? html`<${Banner} tone="bad"><b>${errorCopy(fail.error)}</b> Nothing was saved.
      <div class="row" style="margin-top:8px"><${Button} size="sm" onClick=${() => start(fail.partial)}>${fail.partial && fail.partial.stage1 ? 'Retry the analysis step' : 'Retry'}<//>${demoBtn}</div><//>` : null}

    ${demoData && !run ? html`<div class="row"><${Button} size="sm" variant="ghost" onClick=${() => setDemo(false)}>← Back${shown ? ' to the live report' : ''}<//></div>
      <${Report} a=${{ id: 'demo-' + scenario.id, demo: true, result: demoData.result }} turns=${demoData.turns} map=${demoData.map} />` : null}

    ${shown && !run && !demoData ? html`<${Report} key=${shown.id} a=${shown} turns=${shown.turns || conv.turns} map=${shown.map || conv.map}
        staleNote=${stale.length ? stale.join(' and ') : ''} onRerun=${() => start(null)} canRerun=${live} />
      <${Technical} a=${shown} />` : null}
    ${!shown && !run && !fail && !demoData ? html`<${Empty} title="Not analysed yet">Run the analysis to generate the shared report for this conversation.<//>` : null}

    ${mine.length > 1 && !demoData ? html`<${Section} title="Runs for this conversation">
      <${Table} cols=${['Run', 'Verdict', 'Inputs', '']} rows=${[...mine].reverse().map((a) => [fmt(a.createdAt), VERDICT[a.result.verdict],
        `Conversation v${a.conversationVersion} · A v${a.participantVersions.A} · B v${a.participantVersions.B}`,
        a.id === shown.id ? html`<${Chip}>Showing<//>` : html`<${Button} size="sm" onClick=${() => update((x) => { x.ui.activeAnalysis = a.id; })}>View<//>`])} /><//>` : null}`;
}
