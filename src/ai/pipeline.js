// The analysis pipeline: UNDERSTAND -> ANALYSE -> VALIDATE (spec §12). Single model, two calls.
import { PROMPT_VERSION, buildUnderstand, buildAnalyse } from './prompts.js';
import { checkStage1, checkStage2, parseJsonReply } from './verify.js';
import { callModel, MODEL } from './client.js';
import { derive } from '../assessment.js';

export const STAGES = [
  { id: 'understand', label: 'Reading the conversation', sub: 'Statements, questions, objections, agreements (profiles not used)' },
  { id: 'analyse', label: 'Analysing gaps and power', sub: 'Four categories, five power dimensions, profiles as context' },
  { id: 'validate', label: 'Checking evidence', sub: 'Every quote matched against the transcript' },
];

async function step(prompt, opts) {
  const r = await callModel(prompt, opts);
  if (r.truncated) throw { code: 'truncated', message: 'Reply cut off.', text: r.text };
  return { json: parseJsonReply(r.text), model: r.model };
}

// conv: a saved conversation. participants: store participants. prev: an earlier failed attempt whose
// stage-1 result can be reused when the conversation has not changed.
export async function runPipeline(conv, participants, { focus, onStage, signal, prev } = {}) {
  const t0 = Date.now();
  const profiles = participants.map((p) => ({ slot: p.slot, derived: derive(p.answers) }));
  const record = { stage1: null, stage1Log: [], result: null, log: [], model: null };

  if (prev && prev.stage1 && prev.conversationHash === conv.contentHash) {
    record.stage1 = prev.stage1; record.stage1Log = prev.stage1Log || []; record.model = prev.model;
  } else {
    onStage && onStage('understand');
    const s1 = await step(buildUnderstand(conv), { signal, effort: 'medium' });
    const c1 = checkStage1(s1.json, conv);
    record.stage1 = c1.value; record.stage1Log = c1.log; record.model = s1.model;
  }

  onStage && onStage('analyse');
  let s2;
  try { s2 = await step(buildAnalyse(conv, record.stage1, profiles, focus), { signal, effort: 'high' }); }
  catch (e) { throw { ...e, partial: record }; }

  onStage && onStage('validate');
  let c2;
  try { c2 = checkStage2(s2.json, conv); } catch (e) { throw { ...e, partial: record }; }
  record.result = c2.value; record.log = c2.log; record.model = s2.model || record.model;
  record.durationMs = Date.now() - t0;
  record.promptVersion = PROMPT_VERSION;
  record.modelRequested = MODEL;
  return record;
}
