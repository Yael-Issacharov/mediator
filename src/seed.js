// Demo data. Fictional people and conversations only (spec §19).
import { DEMO_ANSWERS } from './assessment.js';
import { SCENARIOS } from './scenarios.js';

export const SEED = {
  schema: 3,
  participants: [
    { id: 'pa', slot: 'A', name: 'Maya Ronen', roleTitle: 'Participant A', headline: 'Direct and outcome-oriented', version: 1, answers: { ...DEMO_ANSWERS.pa }, updatedAt: null, history: [{ version: 1, at: null, note: 'Demo profile', added: [], removed: [], changed: [] }] },
    { id: 'pb', slot: 'B', name: 'Eli Baron', roleTitle: 'Participant B', headline: 'Contextual and reflective', version: 1, answers: { ...DEMO_ANSWERS.pb }, updatedAt: null, history: [{ version: 1, at: null, note: 'Demo profile', added: [], removed: [], changed: [] }] },
  ],
  scenarios: SCENARIOS,
  conversations: [],
  analyses: [],
  feedback: [],
  ui: { selectedScenario: null, selectedParticipant: 'pa', draft: null, activeConversation: null },
  settings: { focus: 'full' },
};
