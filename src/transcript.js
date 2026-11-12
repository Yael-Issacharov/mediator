// Transcript parsing, file loading and helpers (spec §11). Speaker labels and timestamps are only ever
// copied from the source text; nothing is invented. Unlabelled text is kept with speaker = null and flagged.
const TS = '\\d{1,2}:\\d{2}(?::\\d{2})?';
const RE = new RegExp(`^\\s*(?:[\\[(](${TS})[\\])]|(${TS}))?\\s*[-–—]?\\s*([^:：\\n]{1,40}?)\\s*[:：]\\s*(.*)$`);
const plausibleLabel = (s) => !!s && s.split(/\s+/).length <= 4 && !/[.?!,;]/.test(s) && !/^\d+$/.test(s);
const unquote = (s) => s.replace(/^[\s"“”']+|[\s"“”']+$/g, '');
export const turnId = (i) => 'T' + String(i + 1).padStart(2, '0');
export const renumber = (turns) => turns.map((t, i) => ({ ...t, id: turnId(i) }));

export function parseTranscript(raw) {
  const turns = [];
  let pending = null, blank = true;
  for (const line of raw.replace(/\r/g, '').split('\n')) {
    if (!line.trim()) { blank = true; continue; }
    const m = line.match(RE);
    if (m && plausibleLabel(m[3].trim())) {
      const speaker = m[3].trim(), ts = m[1] || m[2] || null, rest = unquote(m[4]);
      if (rest) { turns.push({ speaker, ts, text: rest }); pending = null; } else pending = { speaker, ts };
      blank = false; continue;
    }
    const text = unquote(line);
    if (pending) { turns.push({ speaker: pending.speaker, ts: pending.ts, text }); pending = null; }
    else if (turns.length && !blank) turns[turns.length - 1].text += ' ' + text;
    else turns.push({ speaker: null, ts: null, text });
    blank = false;
  }
  return renumber(turns);
}

export const labelsOf = (turns) => [...new Set(turns.map((t) => t.speaker).filter(Boolean))];
// Participants A and B are assigned in order of appearance; the operator can change this.
export const autoMap = (labels) => Object.fromEntries(labels.map((l, i) => [l, i === 0 ? 'A' : i === 1 ? 'B' : 'O']));

export function hashConversation(turns, context) {
  const s = JSON.stringify([turns.map((t) => [t.speaker, t.ts, t.text]), context]);
  let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

let mammothP = null;
function loadMammoth() {
  if (window.mammoth) return Promise.resolve(window.mammoth);
  mammothP = mammothP || new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
    s.onload = () => res(window.mammoth); s.onerror = () => { mammothP = null; rej(new Error('load')); };
    document.head.appendChild(s);
  });
  return mammothP;
}

// Resolves { text } or { error } with a message the operator can act on.
export async function readTranscriptFile(file) {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (ext === 'pdf') return { error: 'PDF is not supported in this prototype. Save the transcript as TXT or DOCX and upload that.' };
  if (ext !== 'txt' && ext !== 'docx') return { error: `".${ext}" files are not supported. Upload a TXT or DOCX file.` };
  if (file.size > 1_000_000) return { error: 'This file is larger than 1 MB. Upload a shorter transcript.' };
  try {
    let text;
    if (ext === 'txt') text = await file.text();
    else {
      const m = await loadMammoth();
      text = (await m.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value;
    }
    return text.trim() ? { text } : { error: 'No text was found in this file.' };
  } catch {
    return { error: ext === 'docx' ? 'This DOCX file could not be read. Check that it is a valid Word document, or save it as TXT.' : 'This file could not be read.' };
  }
}

export const SAMPLE_TEXT = `Noa: I need the handoff ready soon.
Tal: Soon as in this week, or before the sprint review?
Noa: Before the review. It should be clean.
Tal: Clean meaning all states are specced, or just the main flow?
Noa: Just make it clean. You know what I mean.
Tal: I'll do the main flow and flag what's missing.`;
