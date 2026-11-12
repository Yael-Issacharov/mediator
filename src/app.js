import { html, render, useState, useEffect } from './lib.js';
import * as store from './store.js';
import { SEED } from './seed.js';
import { Icon, Chip } from './ui.js';
import { Home } from './pages/home.js';
import { Participants } from './pages/participants.js';
import { Conversations } from './pages/conversations.js';
import { Analysis } from './pages/analysis.js';
import { Config, useAiStatus } from './pages/config.js';
import { Kit } from './pages/kit.js';
import { Eval } from './pages/eval.js';

store.init(SEED);

// Hash routes are ASCII only; `settings` is reserved by claude.ai, so Settings lives at #config.
const ROUTES = {
  home: { label: 'Home', icon: 'home', view: Home },
  participants: { label: 'Participants', icon: 'users', view: () => html`<${Participants} />` },
  compare: { label: 'Compare profiles', nav: 'participants', sub: true, view: () => html`<${Participants} compare />` },
  conversations: { label: 'Conversations', icon: 'chat', view: Conversations },
  analysis: { label: 'Analysis', icon: 'report', view: Analysis },
  config: { label: 'Settings', icon: 'gear', view: Config },
  kit: { label: 'Component states', nav: 'config', hidden: true, view: Kit },
  tests: { label: 'Scenario tests', nav: 'config', hidden: true, view: Eval },
};
const NAV = ['home', 'participants', 'compare', 'conversations', 'analysis', 'config'];
const current = () => { const k = location.hash.replace('#', ''); return ROUTES[k] ? k : 'home'; };

function AiPill() {
  const [ai] = useAiStatus();
  const cls = ai.state === 'live' ? 'live' : ai.state === 'off' ? 'off' : '';
  const text = ai.state === 'live' ? 'Live AI connected' : ai.state === 'off' ? 'Live AI unavailable · demo examples only' : 'Checking AI…';
  return html`<span class=${`pill-ai ${cls}`} title=${ai.why}><i class="dot"></i>${text}</span>`;
}

function App() {
  const [key, setKey] = useState(current());
  useEffect(() => {
    const f = () => { setKey(current()); window.scrollTo(0, 0); };
    addEventListener('hashchange', f); return () => removeEventListener('hashchange', f);
  }, []);
  const route = ROUTES[key];
  const active = route.nav || key;
  const View = route.view;
  return html`
    <div class="shell">
      <aside class="side">
        <div class="name">Mediator<small>working title</small></div>
        <nav class="nav" aria-label="Main">
          ${NAV.map((k) => { const r = ROUTES[k]; return html`
            <a href=${'#' + k} class=${r.sub ? 'sub' : ''} aria-current=${k === key || (!r.sub && k === active) ? 'page' : undefined}>
              ${r.icon ? html`<${Icon} name=${r.icon} />` : null}${r.label}</a>`; })}
        </nav>
        <div class="foot">Prototype with fictional data</div>
      </aside>
      <div class="main">
        <header class="top"><div class="crumb">${route.label}</div><${AiPill} /></header>
        <main class="page"><${View} /></main>
      </div>
    </div>`;
}

render(html`<${App} />`, document.getElementById('root'));
