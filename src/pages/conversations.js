import { html, useState, useEffect } from '../lib.js';
import { useStore, update, get } from '../store.js';
import { parseTranscript, labelsOf, autoMap, renumber, hashConversation, readTranscriptFile, SAMPLE_TEXT } from '../transcript.js';
import { Button, Card, Chip, PageHeader, Section, Tabs, Banner, Field, Select, Table, Empty } from '../ui.js';

const SRC = { scenario: 'Prepared scenario', manual: 'Pasted transcript', upload: 'Uploaded file' };
const mutate = (fn) => update((st) => { if (st.ui.draft) fn(st.ui.draft); });
const allLabels = (d) => [...new Set([...labelsOf(d.turns), ...(d.extraLabels || [])])];

function makeDraft({ title, sourceType, turns, scenario, fileName }) {
  const roles = scenario?.roles || [];
  return {
    id: 'c' + Date.now().toString(36), title, description: scenario?.description || '', sourceType, scenarioId: scenario?.id || null, fileName: fileName || null,
    turns: turns.map(({ id, speaker, text, ts }) => ({ id, speaker, text, ts })), extraLabels: [], map: autoMap(labelsOf(turns)),
    context: { topic: scenario?.context.topic || '', roleA: roles[0] || '', roleB: roles[1] || '', objective: scenario?.context.objective || '', project: scenario?.context.project || '' },
    focus: get().settings.focus,
  };
}
const openDraft = (args) => update((st) => { st.ui.draft = makeDraft(args); });
const loadScenario = (sc) => openDraft({ title: sc.title, sourceType: 'scenario', turns: sc.turns, scenario: sc });

/* ---------- choosing a source ---------- */
function Scenarios() {
  const s = useStore();
  return html`<div class="grid c2">${s.scenarios.map((sc) => html`
    <${Card} key=${sc.id}>
      <div class="row" style="justify-content:space-between"><h3>${sc.title}</h3>
        <span class="row" style="gap:6px"><${Chip} tone="a">${sc.roles[0]}<//><${Chip} tone="b">${sc.roles[1]}<//></span></div>
      <p class="muted">${sc.description}</p>
      <div class="row small faint">${sc.turns.length} turns${sc.turns.some((t) => t.ts) ? ' · with timestamps' : ''}</div>
      <div><${Button} variant="primary" size="sm" onClick=${() => loadScenario(sc)}>Use this scenario<//></div>
    <//>`)}</div>`;
}

function Paste() {
  const [text, setText] = useState('');
  return html`<div class="stack-lg">
    <${Field} id="paste" label="Transcript" multiline rows="10" value=${text} onInput=${(e) => setText(e.target.value)}
      placeholder=${'Name: what they said\nOther name: their reply'}
      hint="One turn per line, written as Name: text. A timestamp before the name, such as [00:12] Name: text, is kept. You can fix speakers and wording on the next step." />
    <div class="row"><${Button} variant="primary" disabled=${!text.trim()} onClick=${() => openDraft({ title: 'Pasted conversation', sourceType: 'manual', turns: parseTranscript(text) })}>Review transcript<//>
      <${Button} variant="ghost" onClick=${() => setText(SAMPLE_TEXT)}>Insert an example<//></div></div>`;
}

function Upload() {
  const [st, setSt] = useState({ busy: false, error: '', over: false });
  const take = async (file) => {
    if (!file) return;
    setSt({ busy: true, error: '', over: false });
    const r = await readTranscriptFile(file);
    if (r.error) return setSt({ busy: false, error: r.error, over: false });
    openDraft({ title: file.name.replace(/\.[^.]+$/, ''), sourceType: 'upload', turns: parseTranscript(r.text), fileName: file.name });
    setSt({ busy: false, error: '', over: false });
  };
  return html`<div class="stack-lg">
    <label class=${`drop ${st.over ? 'over' : ''}`} onDragOver=${(e) => { e.preventDefault(); setSt((x) => ({ ...x, over: true })); }}
      onDragLeave=${() => setSt((x) => ({ ...x, over: false }))} onDrop=${(e) => { e.preventDefault(); take(e.dataTransfer.files[0]); }}>
      ${st.busy ? html`<span class="spinner" aria-hidden="true"></span>` : null}
      <b>${st.busy ? 'Reading file' : 'Drop a TXT or DOCX file here, or choose one'}</b>
      <span class="small muted">Speaker labels in the file are kept. Nothing is uploaded anywhere; the file is read in this browser.</span>
      <input id="file" type="file" accept=".txt,.docx" disabled=${st.busy} onChange=${(e) => { take(e.target.files[0]); e.target.value = ''; }} />
    </label>
    ${st.error ? html`<${Banner} tone="bad">${st.error}<//>` : null}</div>`;
}

function Sources() {
  const s = useStore();
  const [tab, setTab] = useState('scenario');
  return html`
    <${Tabs} value=${tab} onChange=${setTab} items=${[{ id: 'scenario', label: 'Prepared scenarios' }, { id: 'paste', label: 'Paste transcript' }, { id: 'upload', label: 'Upload file' }]} />
    ${tab === 'scenario' ? html`<${Scenarios} />` : tab === 'paste' ? html`<${Paste} />` : html`<${Upload} />`}
    <${Section} title="Your conversations" aside="Saved when you run an analysis">
      <${Table} cols=${['Conversation', 'Source', 'Version', '']}
        rows=${s.conversations.map((c) => [c.title, SRC[c.sourceType], html`<${Chip}>v${c.version}<//>`,
          html`<${Button} size="sm" onClick=${() => update((st) => { st.ui.draft = JSON.parse(JSON.stringify(st.conversations.find((x) => x.id === c.id))); })}>Open<//>`])}
        empty=${html`<${Empty} title="Nothing saved yet">Conversations you send to analysis appear here, so you can edit them and run again.<//>`} />
    <//>`;
}

/* ---------- reviewing a conversation ---------- */
function SpeakerRow({ d, label }) {
  const s = useStore();
  const [name, setName] = useState(label);
  useEffect(() => setName(label), [label]);
  const names = { A: s.participants[0].name, B: s.participants[1].name };
  const rename = (value) => {
    const n = value.trim();
    if (!n || n === label) return setName(label);
    mutate((dr) => {
      dr.turns.forEach((t) => { if (t.speaker === label) t.speaker = n; });
      dr.extraLabels = (dr.extraLabels || []).map((l) => (l === label ? n : l));
      if (!(n in dr.map)) dr.map[n] = dr.map[label];
      delete dr.map[label];
    });
  };
  const count = d.turns.filter((t) => t.speaker === label).length;
  return html`<div class="spk">
    <div class="field"><label for=${'sn' + label}>Speaker label <span class="faint">(${count} turn${count === 1 ? '' : 's'})</span></label>
      <input id=${'sn' + label} class="input" value=${name} onInput=${(e) => setName(e.target.value)} onBlur=${(e) => rename(e.target.value)} onKeyDown=${(e) => e.key === 'Enter' && e.target.blur()} /></div>
    <${Select} id=${'sm' + label} label="Is" value=${d.map[label] || 'O'}
      onChange=${(e) => mutate((dr) => { const v = e.target.value; if (v !== 'O') Object.keys(dr.map).forEach((k) => { if (dr.map[k] === v) dr.map[k] = 'O'; }); dr.map[label] = v; })}
      options=${[{ value: 'A', label: `Participant A (${names.A})` }, { value: 'B', label: `Participant B (${names.B})` }, { value: 'O', label: 'Other, no profile' }]} />
  </div>`;
}

function Speakers({ d }) {
  const [add, setAdd] = useState('');
  const labels = allLabels(d);
  const addLabel = () => { const n = add.trim(); if (!n || labels.includes(n)) return; mutate((dr) => { dr.extraLabels = [...(dr.extraLabels || []), n]; dr.map[n] = Object.values(dr.map).includes('A') ? (Object.values(dr.map).includes('B') ? 'O' : 'B') : 'A'; }); setAdd(''); };
  return html`<${Card}><h3>Speakers</h3>
    <p class="small muted">Labels come from the transcript. Match each one to a participant profile; renaming changes every turn with that label.</p>
    ${labels.length ? labels.map((l) => html`<${SpeakerRow} d=${d} label=${l} key=${l} />`) : html`<p class="small muted">No speaker labels were found. Add the speakers, then assign them to turns.</p>`}
    <div class="row" style="align-items:flex-end"><div style="flex:1;min-width:120px"><${Field} id="addspk" label="Add speaker" value=${add} onInput=${(e) => setAdd(e.target.value)} onKeyDown=${(e) => e.key === 'Enter' && addLabel()} /></div>
      <${Button} size="sm" disabled=${!add.trim()} onClick=${addLabel}>Add<//></div><//>`;
}

function Turn({ d, t, i }) {
  const slot = t.speaker ? (d.map[t.speaker] || 'O') : null;
  const cls = slot === 'A' ? 'a' : slot === 'B' ? 'b' : t.speaker ? 'o' : 'u';
  const labels = allLabels(d);
  return html`<div class=${`turn ${cls}`}>
    <div class="tid"><span class="label">${t.id}</span>${t.ts ? html`<span class="small faint">${t.ts}</span>` : null}</div>
    <div class="tspk">
      <select class="input" aria-label=${`Speaker for ${t.id}`} value=${t.speaker || ''}
        onChange=${(e) => mutate((dr) => { dr.turns[i].speaker = e.target.value || null; })}>
        <option value="">Not identified</option>${labels.map((l) => html`<option value=${l}>${l}</option>`)}</select>
      ${!t.speaker ? html`<${Chip} tone="warn">Speaker not identified<//>` : slot === 'A' || slot === 'B' ? html`<${Chip} tone=${cls}>Participant ${slot}<//>` : html`<${Chip}>No profile<//>`}
    </div>
    <textarea class="input ttext" aria-label=${`Text of ${t.id}`} rows=${Math.max(2, Math.ceil(t.text.length / 62))} value=${t.text}
      onInput=${(e) => mutate((dr) => { dr.turns[i].text = e.target.value; })}></textarea>
    <div class="tact">
      <button class="icon" title="Insert a turn below" aria-label=${`Insert a turn after ${t.id}`}
        onClick=${() => mutate((dr) => { dr.turns.splice(i + 1, 0, { id: '', speaker: null, text: '', ts: null }); dr.turns = renumber(dr.turns); })}>+</button>
      <button class="icon" title="Delete this turn" aria-label=${`Delete ${t.id}`}
        onClick=${() => mutate((dr) => { dr.turns.splice(i, 1); dr.turns = renumber(dr.turns); })}>×</button>
    </div></div>`;
}

function Review({ d }) {
  const s = useStore();
  const labels = allLabels(d);
  const filled = d.turns.filter((t) => t.text.trim());
  const unid = d.turns.filter((t) => !t.speaker).length;
  const hasA = labels.some((l) => d.map[l] === 'A'), hasB = labels.some((l) => d.map[l] === 'B');
  const problems = [
    !d.title.trim() && 'Add a title.',
    filled.length < 2 && 'Add at least two turns with text.',
    !(hasA && hasB) && 'Assign Participant A and Participant B to speakers.',
  ].filter(Boolean);
  const saved = s.conversations.find((c) => c.id === d.id);
  const ctx = (k) => (e) => mutate((dr) => { dr.context[k] = e.target.value; });
  const run = () => {
    update((st) => {
      const dr = st.ui.draft, turns = dr.turns.filter((t) => t.text.trim());
      const rec = JSON.parse(JSON.stringify({ ...dr, turns: renumber(turns) }));
      rec.contentHash = hashConversation(rec.turns, rec.context);
      const now = new Date().toISOString(), cur = st.conversations.find((c) => c.id === dr.id);
      if (cur) { rec.version = cur.contentHash === rec.contentHash ? cur.version : cur.version + 1; Object.assign(cur, rec, { updatedAt: now }); }
      else st.conversations.push({ ...rec, version: 1, createdAt: now, updatedAt: now });
      st.ui.activeConversation = dr.id;
    });
    location.hash = 'analysis';
  };
  return html`
    <div class="split">
      <div class="stack-lg">
        <${Card}>
          <div class="row" style="align-items:flex-end"><div style="flex:1;min-width:200px"><${Field} id="ctitle" label="Conversation title" value=${d.title} onInput=${(e) => mutate((dr) => { dr.title = e.target.value; })} /></div>
            <${Chip}>${SRC[d.sourceType]}${d.fileName ? ': ' + d.fileName : ''}<//>${saved ? html`<${Chip}>Saved v${saved.version}<//>` : null}
            <${Button} variant="ghost" onClick=${() => update((st) => { st.ui.draft = null; })}>Start over<//></div>
        <//>
        ${unid ? html`<${Banner} tone="warn">${unid} turn${unid > 1 ? 's have' : ' has'} no identified speaker. Choose a speaker for each, or leave them unattributed. The analysis will not guess who said them.<//>` : null}
        <${Section} title="Transcript" aside=${`${d.turns.length} turns · editable`}>
          ${d.turns.length ? d.turns.map((t, i) => html`<${Turn} d=${d} t=${t} i=${i} key=${t.id + i} />`) : html`<${Empty} title="No turns">Add the first turn to start.<//>`}
          <div><${Button} size="sm" onClick=${() => mutate((dr) => { dr.turns = renumber([...dr.turns, { id: '', speaker: null, text: '', ts: null }]); })}>Add turn<//></div>
        <//>
      </div>
      <aside class="stack-lg side-col">
        <${Speakers} d=${d} />
        <details class="card" open=${!!(d.context.topic || d.context.objective || d.context.project)}>
          <summary><h3 style="display:inline">Optional context</h3></summary>
          <div class="stack-lg" style="margin-top:12px">
            <${Field} id="cx1" label="Conversation topic" value=${d.context.topic} onInput=${ctx('topic')} />
            <${Field} id="cx2" label="Role of Participant A" value=${d.context.roleA} onInput=${ctx('roleA')} />
            <${Field} id="cx3" label="Role of Participant B" value=${d.context.roleB} onInput=${ctx('roleB')} />
            <${Field} id="cx4" label="Discussion objective" value=${d.context.objective} onInput=${ctx('objective')} />
            <${Field} id="cx5" label="Project context" multiline rows="3" value=${d.context.project} onInput=${ctx('project')} />
          </div></details>
        <${Card}><h3>Analysis</h3>
          <${Select} id="focus" label="Focus" value=${d.focus} onChange=${(e) => mutate((dr) => { dr.focus = e.target.value; })}
            options=${[{ value: 'full', label: 'Full analysis (default)' }, { value: 'gaps', label: 'Communication gaps only' }, { value: 'power', label: 'Power Awareness only' }]} />
          ${problems.length ? html`<ul class="small muted probs">${problems.map((p) => html`<li>${p}</li>`)}</ul>` : null}
          <${Button} variant="primary" disabled=${problems.length > 0} onClick=${run}>${saved ? 'Save and run analysis' : 'Run analysis'}<//>
        <//>
      </aside>
    </div>`;
}

export function Conversations() {
  const s = useStore();
  useEffect(() => {
    const id = get().ui.selectedScenario;
    if (id) { const sc = get().scenarios.find((x) => x.id === id); update((st) => { st.ui.selectedScenario = null; }); if (sc) loadScenario(sc); }
  }, []);
  return html`
    <${PageHeader} title="Conversations" sub=${s.ui.draft ? 'Review the transcript, match speakers to profiles, add optional context, then run the analysis.' : 'Choose a prepared scenario, paste a transcript or upload a file.'} />
    ${s.ui.draft ? html`<${Review} d=${s.ui.draft} key=${s.ui.draft.id} />` : html`<${Sources} />`}`;
}
