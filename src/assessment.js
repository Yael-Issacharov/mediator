// Assessment content, profile derivation and comparison dimensions (spec §7-9).
// A profile is DERIVED from answers: each chosen option may emit one descriptive statement into one of
// three separate buckets (preferences, tendencies, contextual sensitivity). Nothing here is a label or a score.

const P = (text) => ({ b: 'pref', text });
const T = (text) => ({ b: 'tend', text });
const C = (text) => ({ b: 'ctx', text });
const O = (id, label, out = null) => ({ id, label, out });

export const BUCKETS = [
  { id: 'pref', title: 'Communication preferences', sub: 'How the person prefers to communicate and receive information' },
  { id: 'tend', title: 'Behavioral tendencies', sub: 'How the person reports they tend to behave' },
  { id: 'ctx', title: 'Contextual sensitivity', sub: 'How behavior may change with role, relationship or context' },
];

export const QUESTIONS = [
  { id: 'q1', group: 'core', topic: 'Ambiguous feedback', prompt: 'A colleague says your work "isn’t quite there yet" and gives no detail. What is your first interpretation?', options: [
    O('o1', 'They may be questioning my judgment.', T('May interpret uncertain feedback as questioning their judgment')),
    O('o2', 'They have something specific in mind, and I should ask for it.'),
    O('o3', 'It is a normal, minor note.') ] },
  { id: 'q2', group: 'core', topic: 'Preferred feedback style', prompt: 'How do you prefer to receive feedback on your work?', options: [
    O('o1', 'Direct and brief: what to change and by when.', P('Direct and outcome-oriented')),
    O('o2', 'With context and examples, and time to reflect.', P('Contextual and reflective')),
    O('o3', 'It depends on the task.', P('Comfortable with either direct or contextual feedback')) ] },
  { id: 'q3', group: 'core', topic: 'Unclear instructions', prompt: 'You get a one-line instruction containing a term such as "polish" or "quality". What do you do?', options: [
    O('o1', 'Start work. The term has an obvious meaning.', T('May assume certain professional terms have an obvious meaning')),
    O('o2', 'Check what the term means here before starting.'),
    O('o3', 'Start, then confirm at the first checkpoint.', T('Tends to start first and confirm what a term means at a checkpoint')) ] },
  { id: 'q4', group: 'core', topic: 'Professional disagreement', prompt: 'You think a proposal is wrong. How do you usually approach it?', options: [
    O('o1', 'State it plainly in the discussion.', P('Comfortable expressing disagreement')),
    O('o2', 'Raise it afterwards, with supporting points.'),
    O('o3', 'Wait to be asked.', T('Tends to wait for an invitation before raising disagreement')) ] },
  { id: 'q5', group: 'core', topic: 'Examples and definitions', prompt: 'What do you need in order to start a task with confidence?', options: [
    O('o1', 'A clear, concise brief.', P('Prefers clear, concise communication')),
    O('o2', 'Concrete examples and definitions of the key terms.', P('Prefers concrete examples and clear definitions')),
    O('o3', 'Very little. I work it out as I go.') ] },
  { id: 'q6', group: 'core', topic: 'Mutual understanding', prompt: 'What makes you feel a conversation ended with shared understanding?', options: [
    O('o1', 'We agreed on the next steps.'),
    O('o2', 'Each of us said back what we understood.', P('Values mutual confirmation of understanding')),
    O('o3', 'No one raised any questions.') ] },
  { id: 'q7', group: 'core', topic: 'Delayed responses', prompt: 'A reply to your proposal takes two days. What do you most likely conclude, and what do you do when you need time yourself?', options: [
    O('o1', 'It may not have been understood, so I follow up quickly.', C('May interpret a lack of response as a sign that the proposal was not understood')),
    O('o2', 'They are probably thinking it over. I also like to process feedback before I respond.', P('Likes to process feedback before responding')),
    O('o3', 'They are busy, so I wait.') ] },
  { id: 'q8', group: 'core', topic: 'Decision-making', prompt: 'How do you prefer to reach a decision?', options: [
    O('o1', 'Explore several options first, decide later.', P('Prefers exploring options before making a decision')),
    O('o2', 'Agree who decides, then work toward it.', P('Prefers explicit decision ownership')),
    O('o3', 'Go with the first workable option.', P('Prefers to move ahead with the first workable option')) ] },
  { id: 'q9', group: 'core', topic: 'Disagreeing with a senior person', prompt: 'Someone more senior proposes something you disagree with. What do you do?', options: [
    O('o1', 'Say so in the meeting.'),
    O('o2', 'Prepare examples first, then raise it.'),
    O('o3', 'Go ahead, and mention it only if asked.', C('May raise an objection to a senior person only when asked')) ] },
  { id: 'q10', group: 'core', topic: 'Interpretation of urgency', prompt: 'A message says "this is urgent". What does urgent mean to you?', options: [
    O('o1', 'It needs a deadline and a priority attached.', P('Wants urgency to be defined through deadlines and priorities')),
    O('o2', 'Act now, before other work.', T('Tends to interpret urgency as requiring immediate action')),
    O('o3', 'Do it today.', T('Tends to treat urgency as same-day work')) ] },
  { id: 'p1', group: 'power', topic: 'Vague managerial direction', prompt: 'A manager says "make this better" and nothing more. What do you do?', options: [
    O('o1', 'Ask what "better" should mean here.', C('May need more explicit context when feedback is ambiguous')),
    O('o2', 'Try something and show it.'),
    O('o3', 'Wait for more detail.', T('Tends to wait for more detail before acting on vague direction')) ] },
  { id: 'p2', group: 'power', topic: 'Voicing disagreement in a group', prompt: 'How likely are you to voice disagreement in a group meeting?', options: [
    O('o1', 'Very likely. I say it plainly.'),
    O('o2', 'I raise it, gently and with caveats.', T('May present disagreement gently')),
    O('o3', 'Unlikely. I prefer a follow-up conversation.', T('May prefer to raise disagreement in a follow-up conversation')) ] },
  { id: 'p3', group: 'power', topic: 'Unrealistic deadline', prompt: 'You are given a deadline you consider unrealistic.', options: [
    O('o1', 'I say so and propose a trade-off.'),
    O('o2', 'I accept it and do my best.', T('May accept an unrealistic deadline and do their best')),
    O('o3', 'I ask who set it and whether it can move.', T('Tends to ask whether a deadline is fixed')) ] },
  { id: 'p4', group: 'power', topic: 'Conditions for alternative views', prompt: 'What makes it easier for you to offer an alternative opinion?', options: [
    O('o1', 'Nothing special. I just say it.'),
    O('o2', 'Being explicitly invited to.', C('May feel more comfortable presenting an alternative opinion when explicitly invited')),
    O('o3', 'Having data to show.', C('May feel more comfortable presenting an alternative opinion when backed by data')) ] },
  { id: 'p5', group: 'power', topic: 'Delegated responsibility', prompt: 'A manager says: "I trust you, find a solution." What does that mean to you?', options: [
    O('o1', 'Go ahead, though I still expect to review it.'),
    O('o2', 'The decision is mine now.', C('May interpret “I trust you, find a solution” as transferring decision responsibility')),
    O('o3', 'Do the work, but check in along the way.', C('May read “I trust you” as permission to work, with check-ins, rather than a transfer of the decision')) ] },
  { id: 'p6', group: 'power', topic: 'Executing vs. agreeing', prompt: 'You are asked to carry out a decision you have doubts about. Which is closest?', options: [
    O('o1', 'I commit only to what I agree with.'),
    O('o2', 'I carry it out and keep my reservations.', T('May execute a decision while retaining reservations')),
    O('o3', 'I carry it out and raise my doubts afterwards.', T('May carry out a decision and raise doubts afterwards')) ] },
];

const pick = (spec) => Object.fromEntries(QUESTIONS.map((q, i) => [q.id, spec[i]]));
// Chosen so that derive() reproduces the demo profiles in spec §8 exactly.
export const DEMO_ANSWERS = {
  pa: pick(['o1', 'o1', 'o1', 'o1', 'o1', 'o1', 'o1', 'o1', 'o2', 'o1', 'o1', 'o1', 'o1', 'o1', 'o1', 'o1']),
  pb: pick(['o2', 'o2', 'o2', 'o2', 'o2', 'o2', 'o2', 'o2', 'o2', 'o2', 'o2', 'o2', 'o1', 'o2', 'o2', 'o2']),
};

export const optionOf = (qid, oid) => QUESTIONS.find((q) => q.id === qid)?.options.find((o) => o.id === oid) || null;

export function derive(answers) {
  const out = { pref: [], tend: [], ctx: [] };
  for (const q of QUESTIONS) {
    const o = optionOf(q.id, answers[q.id]);
    if (o && o.out) out[o.out.b].push({ text: o.out.text, q: q.id, topic: q.topic });
  }
  return out;
}

export function diffDerived(before, after) {
  const key = (d) => new Map(['pref', 'tend', 'ctx'].flatMap((b) => d[b].map((s) => [b + '|' + s.text, { ...s, b }])));
  const x = key(before), y = key(after);
  return {
    added: [...y].filter(([k]) => !x.has(k)).map(([, v]) => v),
    removed: [...x].filter(([k]) => !y.has(k)).map(([, v]) => v),
  };
}
// Card subtitle: the profile's own feedback-style statement, so it always matches the current answers.
export const headlineOf = (p) => (derive(p.answers).pref.find((x) => x.q === 'q2') || {}).text || p.headline;
export const answeredCount = (answers) => QUESTIONS.filter((q) => optionOf(q.id, answers[q.id])).length;
export const changedQuestions = (a, b) => QUESTIONS.filter((q) => a[q.id] !== b[q.id]).map((q) => q.id);

// Comparison dimensions (spec §9). Friction notes are conditional and describe potential friction only.
export const DIMENSIONS = [
  { id: 'feedback', title: 'Feedback style', qs: ['q2'], friction: 'A short, direct note can feel too thin to someone who wants context, and a contextual note can feel indirect to someone who wants the point first.', clarify: 'What would a useful piece of feedback look like for each of you?' },
  { id: 'processing', title: 'Response timing', qs: ['q7'], friction: 'A quick follow-up and a pause to think can be read as pressure on one side and silence on the other.', clarify: 'How soon do you each expect a reply, and is a pause a signal of anything?' },
  { id: 'definitions', title: 'Terms and definitions', qs: ['q3', 'q5'], friction: 'Terms such as "bolder", "polished" or "done" may be treated as obvious by one person while the other wants them defined.', clarify: 'Which terms in this work need an agreed definition or an example?' },
  { id: 'urgency', title: 'Urgency', qs: ['q10'], friction: 'The same word can mean "attach a deadline" to one person and "act now" to another.', clarify: 'When something is urgent, what is the deadline and what can wait?' },
  { id: 'disagree', title: 'Voicing disagreement', qs: ['q4', 'p2'], friction: 'Plain disagreement in the moment and gentler or later disagreement are easy to misread as agreement or as opposition.', clarify: 'How will each of you signal "I agree" versus "I will do it, but I have reservations"?' },
  { id: 'senior', title: 'Disagreeing with a senior person', qs: ['q9'], friction: 'People may differ in whether they raise objections upward unprompted.', clarify: 'Is it clear when alternative views are wanted?' },
  { id: 'decision', title: 'Making decisions', qs: ['q8'], friction: 'Exploring options and fixing who decides pull in different directions when ownership has not been said aloud.', clarify: 'Who makes the final decision here, and when is it made?' },
  { id: 'delegation', title: 'Delegated responsibility', qs: ['p5'], friction: '"I trust you, find a solution" can be heard as a handover of the decision by one person and as a go-ahead to work by the other.', clarify: 'Does "I trust you" include the final decision, or only the work?' },
  { id: 'execute', title: 'Executing vs. agreeing', qs: ['p6'], friction: 'Carrying out a decision does not show whether someone agrees with it.', clarify: 'Can either of you say "I will do it, and I still disagree"?' },
  { id: 'deadline', title: 'Unrealistic deadlines', qs: ['p3'], friction: 'Responses to a tight deadline can differ between flagging it, accepting it and asking whether it can move.', clarify: 'Is the deadline fixed or negotiable, and who decides?' },
];
