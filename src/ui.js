// Shared wireframe components. Every screen is built from these.
import { html, useState } from './lib.js';

const ICONS = {
  home: 'M3 11l9-8 9 8M5 10v10h14V10',
  users: 'M16 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM21 20v-1a4 4 0 00-3-3.9M16 4.1a3.5 3.5 0 010 6.8',
  chat: 'M21 12a8 8 0 01-11.5 7.2L4 20l1-4.6A8 8 0 1121 12z',
  report: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7',
  gear: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19 12a7 7 0 00-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 00-2-1.2L14.2 3h-4l-.4 2.6a7 7 0 00-2 1.2l-2.3-.9-2 3.4 2 1.5a7 7 0 000 2.4l-2 1.5 2 3.4 2.3-.9a7 7 0 002 1.2l.4 2.6h4l.4-2.6a7 7 0 002-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z',
};
export const Icon = ({ name }) => html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${ICONS[name]} /></svg>`;

export const Button = ({ variant = '', size = '', loading, disabled, children, ...rest }) => html`
  <button class=${`btn ${variant} ${size}`} disabled=${disabled || loading} aria-busy=${loading ? 'true' : undefined} ...${rest}>
    ${loading ? html`<span class="spinner" aria-hidden="true"></span>` : null}${children}
  </button>`;

export const Chip = ({ tone = '', dot, children }) => html`<span class=${`chip ${tone}`}>${dot ? html`<i class="dot"></i>` : null}${children}</span>`;
export const Card = ({ children, onClick, href, ...rest }) =>
  href ? html`<a class="card link" href=${href} ...${rest}>${children}</a>`
  : onClick ? html`<button class="card link" onClick=${onClick} ...${rest}>${children}</button>`
  : html`<div class="card" ...${rest}>${children}</div>`;

export const PageHeader = ({ title, sub, actions }) => html`
  <div class="page-head"><div><h1>${title}</h1>${sub ? html`<p class="muted">${sub}</p>` : null}</div>${actions ? html`<div class="row">${actions}</div>` : null}</div>`;

export const Section = ({ title, aside, children }) => html`
  <section class="sec"><div class="sec-head"><h2>${title}</h2>${aside ? html`<span class="small faint">${aside}</span>` : null}</div>${children}</section>`;

export const Tabs = ({ items, value, onChange }) => html`
  <div class="tabs" role="tablist">${items.map((t) => html`
    <button class="tab" role="tab" aria-selected=${t.id === value} onClick=${() => onChange(t.id)}>${t.label}</button>`)}</div>`;

export const Banner = ({ tone = '', children }) => html`<div class=${`banner ${tone}`} role=${tone === 'bad' ? 'alert' : 'status'}><div>${children}</div></div>`;

export const Field = ({ id, label, hint, error, multiline, ...rest }) => html`
  <div class="field"><label for=${id}>${label}</label>
    ${multiline ? html`<textarea id=${id} class=${`input ${error ? 'err' : ''}`} ...${rest}></textarea>` : html`<input id=${id} class=${`input ${error ? 'err' : ''}`} ...${rest} />`}
    ${error ? html`<span class="hint err">${error}</span>` : hint ? html`<span class="hint">${hint}</span>` : null}</div>`;

export const Select = ({ id, label, options, ...rest }) => html`
  <div class="field"><label for=${id}>${label}</label>
    <select id=${id} class="input" ...${rest}>${options.map((o) => html`<option value=${o.value}>${o.label}</option>`)}</select></div>`;

export const Table = ({ cols, rows, empty }) => rows.length === 0 ? empty : html`
  <div class="tbl-wrap"><table><thead><tr>${cols.map((c) => html`<th>${c}</th>`)}</tr></thead>
    <tbody>${rows.map((r) => html`<tr>${r.map((c) => html`<td>${c}</td>`)}</tr>`)}</tbody></table></div>`;

export const Empty = ({ title, children, action }) => html`<div class="empty"><h3>${title}</h3><p class="small">${children}</p>${action || null}</div>`;
export const Avatar = ({ slot }) => html`<span class=${`avatar ${slot.toLowerCase()}`}>${slot}</span>`;

export function useToggle(init = false) { const [v, set] = useState(init); return [v, () => set((x) => !x)]; }
