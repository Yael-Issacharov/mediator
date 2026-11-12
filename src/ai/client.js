// AI connection. Live analysis uses the artifact `sample` capability (built-in Claude, no API key anywhere).
import { get } from '../store.js';

export const MODEL = 'claude-sonnet-5-5';

let samplePromise = null;
function useSample() {
  if (!window.claude || typeof window.claude.use !== 'function') return Promise.resolve(null);
  samplePromise = samplePromise || window.claude.use('sample').catch(() => null);
  return samplePromise;
}

export async function getAiStatus() {
  if (!window.claude || typeof window.claude.use !== 'function') return { state: 'off', why: 'Not running inside the claude.ai viewer' };
  const s = await useSample();
  return s ? { state: 'live', why: 'Built-in Claude is available' } : { state: 'off', why: 'Not granted or unavailable for this viewer' };
}

// One model call. Resolves { text, truncated, model } or rejects { code, message, text? }.
// Never retried from code: the operator decides (spec §17, sample contract).
export async function callModel(prompt, { signal, effort = 'medium' } = {}) {
  // Local development only: replay recorded replies set from the console as window.__mediatorMockReplies = [text, text].
  if (get().settings.simulateFailure) {
    await new Promise((r) => setTimeout(r, 900));
    throw { code: 'upstream_error', message: 'Simulated failure (Settings \u2192 Testing).' };
  }
  if (location.hostname === 'localhost' && Array.isArray(window.__mediatorMockReplies) && window.__mediatorMockReplies.length) {
    await new Promise((r) => setTimeout(r, 600));
    return { text: window.__mediatorMockReplies.shift(), truncated: false, model: 'Recorded reply (local test)' };
  }
  const sample = await useSample();
  if (!sample) throw { code: 'unavailable', message: 'Live AI is not available in this view.' };
  const r = await sample(prompt, { model: MODEL, modelTier: 'default', effort, signal, cache: false });
  return { text: r.text, truncated: !!r.truncated, model: r.modelApplied || `Claude (${r.modelTierApplied || 'default'} tier)` };
}

const COPY = {
  unavailable: 'Live AI is not available here. Open the published page in the Claude app.',
  not_granted: 'This page has not been allowed to use Claude. Allow it from the page’s permissions, then run again.',
  sampling_disabled: 'Claude is not available for this account.',
  rate_limited: 'Usage limit reached for now. Wait a little, then run again.',
  prompt_too_large: 'The transcript is too long for one analysis. Shorten it and run again.',
  invalid_json: 'The model’s reply could not be read as structured data.',
  schema: 'The model’s reply was missing required parts.',
  truncated: 'The model’s reply was cut off before it finished.',
  cancelled: 'Analysis stopped.',
  upstream_error: 'The AI service did not complete the analysis.',
};
export const errorCopy = (e) => COPY[e && e.code] || 'The analysis could not be completed because of a service error.';
