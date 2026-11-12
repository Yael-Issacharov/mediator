import { html, useState, useEffect } from '../lib.js';
import { useStore, update } from '../store.js';
import { QUESTIONS, BUCKETS, DEMO_ANSWERS, derive, diffDerived, answeredCount, changedQuestions, optionOf, DIMENSIONS, headlineOf } from '../assessment.js';
import { Button, Card, Chip, PageHeader, Section, Tabs, Banner, Field, Table, Avatar, Empty } from '../ui.js';

const fmt = (iso) => (iso ? new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Demo data');
const qTopic = (id) => QUESTIONS.find((q) => q.id === id)?.topic || id;
const slotTone = (slot) => slot.toLowerCase();

function Statement({ s, tone }) {
  return html`<li class="stmt"><span>${s.text}</span><span class="small faint">From: ${s.topic}</span></li>`;
}

function ProfileView({ p, lastChange, dismiss }) {
  const d = derive(p.answers);
  return html`
    ${lastChange ? html`<${Banner} tone="ok"><b>Profile updated to v${lastChange.version}.</b>
        ${lastChange.added.length + lastChange.removed.length === 0 ? ' The edited answers did not change any statement.' : ''}
        <div class="diff">${lastChange.added.map((s) => html`<div class="add">+ ${s.text}</div>`)}${lastChange.removed.map((s) => html`<div class="rem">− ${s.text}</div>`)}</div>
        <div><${Button} size="sm" variant="ghost" onClick=${dismiss}>Dismiss<//></div><//>` : null}
    <div class="grid c3">
      ${BUCKETS.map((b) => html`
        <${Card} key=${b.id}>
          <div><h3>${b.title}</h3><div class="small faint">${b.sub}</div></div>
          ${d[b.id].length ? html`<ul class="stmts">${d[b.id].map((s) => html`<${Statement} s=${s} />`)}</ul>`
            : html`<p class="small muted">No statements in this section. The current answers did not produce one.</p>`}
        <//>`)}
    </div>
    <p class="small faint">These are possible tendencies reported by the participant, not diagnoses or established facts. They give context to an analysis and are never evidence on their own.</p>`;
}

function Assessment({ p, onSaved }) {
  const [draft, setDraft] = useState({ ...p.answers });
  useEffect(() => { setDraft({ ...p.answers }); }, [p.id, p.version]);
  const edited = changedQuestions(p.answers, draft);
  const unchangedFromDemo = changedQuestions(DEMO_ANSWERS[p.id], draft).length === 0;
  const save = () => {
    const before = derive(p.answers), after = derive(draft);
    const diff = diffDerived(before, after);
    const entry = { version: p.version + 1, at: new Date().toISOString(), note: 'Assessment edited', added: diff.added, removed: diff.removed, changed: edited };
    update((st) => { const t = st.participants.find((x) => x.id === p.id); t.answers = { ...draft }; t.version = entry.version; t.updatedAt = entry.at; t.history.push(entry); });
    onSaved(entry);
  };
  const groups = [['core', 'Core questions'], ['power', 'Power-awareness questions']];
  return html`
    <div class="row"><${Chip}>${answeredCount(draft)} of ${QUESTIONS.length} answered<//><span class="small muted">About 4 minutes. This is not a personality test; it records how the person says they prefer to communicate.</span></div>
    ${groups.map(([g, title]) => html`
      <${Section} title=${title}>
        <div class="qs">${QUESTIONS.filter((q) => q.group === g).map((q) => html`
          <fieldset class="q" key=${q.id}>
            <legend><span class="label">${q.topic}</span>${edited.includes(q.id) ? html` <${Chip} tone="warn">Edited<//>` : null}</legend>
            <p>${q.prompt}</p>
            <div class="opts">${q.options.map((o) => html`
              <label class="opt"><input type="radio" name=${p.id + q.id} checked=${draft[q.id] === o.id}
                onChange=${() => setDraft((d) => ({ ...d, [q.id]: o.id }))} /><span>${o.label}</span></label>`)}</div>
          </fieldset>`)}</div>
      <//>`)}
    <div class="actionbar">
      <span class="small muted" style="flex:1">${edited.length ? `${edited.length} answer${edited.length > 1 ? 's' : ''} edited. Saving creates profile v${p.version + 1}; reports built on v${p.version} will be marked outdated.` : 'No unsaved changes.'}</span>
      <${Button} variant="ghost" disabled=${!edited.length} onClick=${() => setDraft({ ...p.answers })}>Discard<//>
      <${Button} disabled=${unchangedFromDemo} onClick=${() => setDraft({ ...DEMO_ANSWERS[p.id] })}>Restore demo answers<//>
      <${Button} variant="primary" disabled=${!edited.length} onClick=${save}>Save and update profile<//>
    </div>`;
}

function History({ p }) {
  return html`<div class="grid">${[...p.history].reverse().map((h) => html`
    <${Card} key=${h.version}>
      <div class="row"><${Chip}>v${h.version}<//><b>${h.note}</b><span class="small faint">${fmt(h.at)}</span></div>
      ${h.changed.length ? html`<div class="small muted">Edited: ${h.changed.map(qTopic).join(', ')}</div>` : null}
      ${h.added.length + h.removed.length ? html`<div class="diff">${h.added.map((s) => html`<div class="add">+ ${s.text}</div>`)}${h.removed.map((s) => html`<div class="rem">− ${s.text}</div>`)}</div>`
        : h.version > 1 ? html`<div class="small muted">No statement changed.</div>` : null}
    <//>`)}</div>`;
}

function Detail({ p }) {
  const [tab, setTab] = useState('profile');
  const [info, setInfo] = useState({ name: p.name, roleTitle: p.roleTitle });
  const [change, setChange] = useState(null);
  useEffect(() => { setInfo({ name: p.name, roleTitle: p.roleTitle }); setChange(null); setTab('profile'); }, [p.id]);
  const dirty = info.name !== p.name || info.roleTitle !== p.roleTitle;
  const bad = !info.name.trim();
  return html`
    <${Card}>
      <div class="row" style="align-items:flex-end">
        <${Avatar} slot=${p.slot} />
        <div style="flex:1;min-width:160px"><${Field} id="pn" label="Name" value=${info.name} error=${bad ? 'A name is required.' : ''} onInput=${(e) => setInfo({ ...info, name: e.target.value })} /></div>
        <div style="flex:1;min-width:160px"><${Field} id="pr" label="Default role label" value=${info.roleTitle} onInput=${(e) => setInfo({ ...info, roleTitle: e.target.value })} /></div>
        <${Button} disabled=${!dirty || bad} onClick=${() => update((st) => { const t = st.participants.find((x) => x.id === p.id); t.name = info.name.trim(); t.roleTitle = info.roleTitle.trim(); })}>Save details<//>
      </div>
      <div class="row small muted"><${Chip} tone=${slotTone(p.slot)}>Participant ${p.slot}<//><${Chip}>Profile v${p.version}<//>Updated ${fmt(p.updatedAt)}</div>
    <//>
    <${Tabs} value=${tab} onChange=${setTab} items=${[{ id: 'profile', label: 'Profile' }, { id: 'assess', label: 'Assessment' }, { id: 'history', label: 'Versions' }]} />
    ${tab === 'profile' ? html`<${ProfileView} p=${p} lastChange=${change} dismiss=${() => setChange(null)} />` : null}
    ${tab === 'assess' ? html`<${Assessment} p=${p} onSaved=${(e) => { setChange(e); setTab('profile'); }} />` : null}
    ${tab === 'history' ? html`<${History} p=${p} />` : null}`;
}

function Profiles() {
  const s = useStore();
  const sel = s.participants.find((x) => x.id === s.ui.selectedParticipant) || s.participants[0];
  return html`
    <div class="grid c2">${s.participants.map((p) => html`
      <button class=${`card link ${p.id === sel.id ? 'sel' : ''}`} aria-pressed=${p.id === sel.id} key=${p.id}
        onClick=${() => update((st) => { st.ui.selectedParticipant = p.id; })}>
        <div class="row"><${Avatar} slot=${p.slot} /><div style="flex:1;min-width:0"><h3>${p.name}</h3><div class="small muted">${headlineOf(p)}</div></div>
          <${Chip}>v${p.version}<//></div></button>`)}</div>
    <${Detail} p=${sel} key=${sel.id} />`;
}

function Compare() {
  const s = useStore();
  const [A, B] = s.participants;
  const label = (p, qid) => optionOf(qid, p.answers[qid])?.label || 'Not answered';
  const rows = DIMENSIONS.map((d) => ({ d, same: d.qs.every((q) => A.answers[q] === B.answers[q]) }));
  const diff = rows.filter((r) => !r.same), same = rows.filter((r) => r.same);
  const cell = (p, d) => html`<div class="stack">${d.qs.map((q) => html`<span>${label(p, q)}</span>`)}</div>`;
  return html`
    <${Banner}><b>Potential friction from profiles. Not observed in any conversation.</b> Differences here are context for an analysis. They are not proof that a misunderstanding happened, and there is no compatibility score.<//>
    <div class="row"><${Chip} tone="ok">${same.length} similar<//><${Chip} tone="warn">${diff.length} different<//>
      <span class="small muted">Answers come from the current saved profiles (A v${A.version}, B v${B.version}).</span></div>
    <${Section} title="Side by side" aside="Reported answers">
      <${Table} cols=${['Dimension', `${A.name} (A)`, `${B.name} (B)`, 'Result']}
        rows=${rows.map(({ d, same: ok }) => [html`<b>${d.title}</b>`, cell(A, d), cell(B, d), html`<${Chip} tone=${ok ? 'ok' : 'warn'}>${ok ? 'Similar' : 'Different'}<//>`])} />
    <//>
    <${Section} title="Potential friction points" aside=${`${diff.length} of ${rows.length} dimensions`}>
      ${diff.length ? html`<div class="grid c2">${diff.map(({ d }) => html`
        <${Card} key=${d.id}><div class="row"><h3>${d.title}</h3><${Chip} tone="unk">From profiles<//></div>
          <p class="muted">${d.friction}</p>
          <div class="small"><span class="label">Worth clarifying</span><br />${d.clarify}</div><//>`)}</div>`
        : html`<${Empty} title="No differences found">With the current answers the two profiles match on every dimension.<//>`}
    <//>
    <${Section} title="Common ground in the profiles">
      ${same.length ? html`<div class="row">${same.map(({ d }) => html`<${Chip} tone="ok">${d.title}<//>`)}</div>
        <p class="small muted">Similar answers on these dimensions. No friction is flagged from the profiles.</p>` : html`<p class="muted small">No dimension matches with the current answers.</p>`}
    <//>`;
}

export function Participants({ compare }) {
  const tab = compare ? 'compare' : 'profiles';
  return html`
    <${PageHeader} title="Participants" sub="Two demo profiles. Profiles give context to an analysis; they are never evidence by themselves." />
    <${Tabs} value=${tab} onChange=${(t) => { location.hash = t === 'compare' ? 'compare' : 'participants'; }}
      items=${[{ id: 'profiles', label: 'Profiles' }, { id: 'compare', label: 'Compare' }]} />
    ${compare ? html`<${Compare} />` : html`<${Profiles} />`}`;
}
