// Local JSON store: localStorage with an in-memory fallback. One module so `db` can replace it later.
import { useState, useEffect } from './lib.js';

const KEY = 'mediator.proto.v1';
let state = null;
let seedRef = null;
const subs = new Set();

const clone = (o) => JSON.parse(JSON.stringify(o));
function read() { try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch { return null; } }
function write() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage blocked: keep going in memory */ } }
const emit = () => subs.forEach((f) => f());

export function init(seed) {
  seedRef = seed;
  const saved = read();
  state = saved && saved.schema === seed.schema ? saved : clone(seed);
  // Prepared scenarios are read-only app content: always take them from the code, so a saved copy from an
  // older version never carries stale turns or reference labels.
  state.scenarios = clone(seed.scenarios);
}
export const get = () => state;
export function update(fn) { fn(state); write(); emit(); }
export function reset() { state = clone(seedRef); write(); emit(); }
export function useStore() {
  const [, tick] = useState(0);
  useEffect(() => { const f = () => tick((n) => n + 1); subs.add(f); return () => subs.delete(f); }, []);
  return state;
}
