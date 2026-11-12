import { html, useState, useEffect } from '../lib.js';
import { useStore, update, reset } from '../store.js';
import { MODEL, getAiStatus } from '../ai/client.js';
import { PROMPT_VERSION } from '../ai/prompts.js';
import { Button, Card, Chip, PageHeader, Select, Banner } from '../ui.js';

export function useAiStatus() {
  const [st, set] = useState({ state: 'checking', why: 'Checking connection' });
  useEffect(() => { let on = true; getAiStatus().then((r) => on && set(r)); return () => { on = false; }; }, []);
  return [st, () => { set({ state: 'checking', why: 'Checking connection' }); getAiStatus().then(set); }];
}

export function Config() {
  const s = useStore();
  const [ai, recheck] = useAiStatus();
  const [confirm, setConfirm] = useState(false);
  const tone = ai.state === 'live' ? 'ok' : ai.state === 'off' ? 'warn' : '';
  return html`
    <${PageHeader} title="Settings" sub="Only what this prototype needs." />
    <${Card}><h3>AI connection</h3>
      <div class="row"><${Chip} tone=${tone} dot>${ai.state === 'live' ? 'Live AI available' : ai.state === 'off' ? 'Live AI unavailable' : 'Checking'}<//>
        <span class="small muted">${ai.why}</span><span style="flex:1"></span>
        <${Button} size="sm" onClick=${recheck} disabled=${ai.state === 'checking'}>Check again<//></div>
      ${ai.state === 'off' ? html`<${Banner} tone="warn">Analyses will use the labelled demo examples until live AI is available. Open the published page in the Claude app to run live analysis.<//>` : null}
    <//>
    <${Card}><h3>Analysis configuration</h3>
      <div style="max-width:320px"><${Select} id="focus" label="Default focus" value=${s.settings.focus}
        onChange=${(e) => update((st) => { st.settings.focus = e.target.value; })}
        options=${[{ value: 'full', label: 'Full analysis' }, { value: 'gaps', label: 'Communication gaps only' }, { value: 'power', label: 'Power Awareness only' }]} /></div>
    <//>
    <${Card}><h3>Testing</h3>
      <label class="opt" style="max-width:560px"><input type="checkbox" id="simfail" checked=${!!s.settings.simulateFailure}
        onChange=${(e) => update((st) => { st.settings.simulateFailure = e.target.checked; })} />
        <span><b>Simulate an AI failure</b><br /><span class="small muted">Every analysis fails with a service error, so you can show the retry and the labelled demo example. Turn it off afterwards.</span></span></label>
      ${s.settings.simulateFailure ? html`<${Banner} tone="warn">AI failure simulation is on. No live analysis will complete.<//>` : null}
      <div class="row"><${Button} onClick=${() => { location.hash = 'tests'; }}>Open scenario tests<//><span class="small muted">Runs all four prepared scenarios live and compares them with their reference labels.</span></div>
    <//>
    <${Card}><h3>Demo data</h3>
      <p class="muted small">Restores both profiles, the scenarios, and clears saved analyses and feedback on this device.</p>
      <div class="row">${confirm
        ? html`<${Button} variant="danger" onClick=${() => { reset(); setConfirm(false); }}>Yes, reset everything<//><${Button} variant="ghost" onClick=${() => setConfirm(false)}>Cancel<//>`
        : html`<${Button} onClick=${() => setConfirm(true)}>Reset demo data<//>`}</div>
    <//>
    <${Card}><h3>Prototype information</h3>
      <dl class="kv small" style="margin:0">
        <dt>Model</dt><dd>${MODEL} (requested)</dd>
        <dt>Prompt version</dt><dd>${PROMPT_VERSION}</dd>
        <dt>Data</dt><dd>Fictional profiles and conversations, stored in this browser only</dd>
        <dt>Not implemented</dt><dd>Authentication, encryption, retention policy, employer or HR integration, live recording. Production safeguards described in the spec are future work.</dd>
      </dl>
    <//>`;
}
