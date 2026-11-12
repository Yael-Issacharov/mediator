import { html } from '../lib.js';
import { useStore, update } from '../store.js';
import { VERDICT, staleness } from './analysis.js';
import { Button, Card, Chip, PageHeader, Section, Table, Empty, Avatar } from '../ui.js';
import { headlineOf } from '../assessment.js';

const go = (hash) => { location.hash = hash; };
const STEPS = [
  ['1  Participants & profiles', 'Two short assessments give context about how each person prefers to communicate.', 'participants'],
  ['2  Conversation', 'Pick a prepared scenario, paste a transcript or upload a TXT or DOCX file.', 'conversations'],
  ['3  AI analysis', 'One model reads the transcript, then the profiles, and checks every quote.', 'analysis'],
  ['4  Shared report', 'Six sections: what is shared, what differs, what is still open.', 'analysis'],
];

export function Home() {
  const s = useStore();
  const open = (id) => { update((st) => { st.ui.selectedScenario = id; }); go('conversations'); };
  return html`
    <${PageHeader} title="Understand what happened in a conversation"
      sub="The mediator reads a workplace conversation after it has happened, in the context of both participants, and writes a neutral report. It does not decide who is right."
      actions=${html`<${Button} variant="primary" onClick=${() => go('conversations')}>Start new analysis<//>`} />

    <nav class="flow" aria-label="How it works">
      ${STEPS.map(([t, d, h]) => html`<a href=${'#' + h}><b>${t}</b><span class="small muted">${d}</span></a>`)}
    </nav>

    <${Section} title="Prepared demo scenarios" aside="Fictional conversations">
      <div class="grid c2">
        ${s.scenarios.map((sc) => html`
          <${Card} onClick=${() => open(sc.id)} key=${sc.id}>
            <div class="row" style="justify-content:space-between"><h3>${sc.title}</h3>
              <span class="row" style="gap:6px"><${Chip} tone="a">${sc.roles[0]}<//><${Chip} tone="b">${sc.roles[1]}<//></span></div>
            <p class="muted">${sc.description}</p>
            <div class="row" style="gap:6px">${sc.areas.map((a) => html`<${Chip}>${a}<//>`)}</div>
          <//>`)}
      </div>
    <//>

    <div class="grid c2" style="align-items:start">
      <${Section} title="Participants" aside="Editable profiles">
        <div class="grid">
          ${s.participants.map((p) => html`
            <${Card} href="#participants" key=${p.id}>
              <div class="row"><${Avatar} slot=${p.slot} />
                <div style="flex:1;min-width:0"><h3>${p.name}</h3><div class="small muted">${headlineOf(p)}</div></div>
                <${Chip}>Profile v${p.version}<//></div>
            <//>`)}
        </div>
      <//>

      <${Section} title="Recent analyses">
        <${Table} cols=${['Conversation', 'Result', 'Status']}
          rows=${[...s.analyses].reverse().slice(0, 5).map((a) => [
            html`<a href="#analysis" onClick=${() => update((st) => { st.ui.activeConversation = a.conversationId; st.ui.activeAnalysis = a.id; })}>${a.title}</a>`,
            VERDICT[a.result.verdict],
            staleness(a, s).length ? html`<${Chip} tone="warn">Outdated<//>` : a.status === 'live' ? html`<${Chip} tone="ok">Live AI<//>` : html`<${Chip}>Demo example<//>`])}
          empty=${html`<${Empty} title="No analyses yet"
            action=${html`<${Button} size="sm" onClick=${() => open('s1')}>Open Creative Feedback<//>`}>
            Reports you run appear here, marked as live AI or as a demo example.<//>`} />
      <//>
    </div>`;
}
