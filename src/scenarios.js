// Prepared demo scenarios (spec §10). Fictional people and conversations only.
// `reference` holds labels for internal testing and the clearly labelled fallback reports. They are NOT
// conclusions the live analysis must reproduce; live analysis reads the actual transcript and profiles.
const T = (n, speaker, slot, text, ts = null) => ({ id: 'T' + String(n).padStart(2, '0'), speaker, slot, text, ts });

export const SCENARIOS = [
  {
    id: 's1', title: 'Creative Feedback', roles: ['Creative Director', 'Designer'],
    description: 'A short exchange about a design that "needs to be bolder", with no examples and an open deadline.',
    areas: ['Meaning & Expectations', 'Communication & Feedback', 'Decision ownership'],
    context: { topic: 'Review of the homepage design', objective: 'Agree the direction for the next iteration', project: 'Website refresh' },
    turns: [
      T(1, 'Creative Director', 'A', 'I think the design needs to be bolder. It’s not quite there yet.'),
      T(2, 'Designer', 'B', 'Can you give me an example of what you mean by bolder?'),
      T(3, 'Creative Director', 'A', 'I don’t want to get into all the details. I trust you to find the right direction.'),
      T(4, 'Designer', 'B', 'Okay, I’ll explore a few options. Just want to make sure we’re aligned on the deadline.'),
    ],
    reference: { verdict: 'communication_gap', labels: [
      { kind: 'gap', category: 'meaning_expectations', title: 'What "bolder" means', turns: ['T01', 'T02', 'T03'] },
      { kind: 'gap', category: 'communication_feedback', title: 'Example requested, not given', turns: ['T02', 'T03'] },
      { kind: 'power', dimension: 'decision_ownership', title: 'Creative autonomy vs. who decides', turns: ['T03', 'T04'] },
      { kind: 'gap', category: 'meaning_expectations', title: 'Deadline left open', turns: ['T04'] },
    ], mustNot: ['Conclude the designer is afraid to disagree'] },
  },
  {
    id: 's2', title: 'Manager vs. Employee', roles: ['Manager', 'Employee'],
    description: 'Unclear direction, a tight deadline and delegated responsibility between a manager and an employee.',
    areas: ['Formal authority', 'Voice & participation', 'Execution vs. agreement'],
    context: { topic: 'Onboarding flow for the leadership review', objective: 'Have the flow ready to show leadership', project: 'Q3 onboarding' },
    turns: [
      T(1, 'Manager', 'A', 'The onboarding flow needs to feel more seamless. I need it in front of the leadership team on Thursday.'),
      T(2, 'Employee', 'B', 'Thursday this week? That’s two days. Which parts of the flow are you thinking of?'),
      T(3, 'Manager', 'A', 'You know the product better than I do. Pick what matters most. I trust you to handle it.'),
      T(4, 'Employee', 'B', 'I can look at the sign-up and the first-run screens. Do you want me to decide what goes to leadership as well, or will you review it first?'),
      T(5, 'Manager', 'A', 'I’ll glance at it Wednesday night if I can. Mostly it’s yours.'),
      T(6, 'Employee', 'B', 'Okay. I do think two days is tight for user testing, so I’d be showing it untested.'),
      T(7, 'Manager', 'A', 'Leadership won’t expect testing. Just make sure it looks solid.'),
      T(8, 'Employee', 'B', 'Understood. I’ll have the screens ready Wednesday afternoon.'),
      T(9, 'Manager', 'A', 'Great, thanks for picking this up.'),
    ],
    reference: { verdict: 'communication_gap', labels: [
      { kind: 'gap', category: 'meaning_expectations', title: 'What "seamless" means', turns: ['T01', 'T02', 'T03'] },
      { kind: 'power', dimension: 'formal_authority', title: 'Manager sets the deadline and priorities', turns: ['T01'] },
      { kind: 'power', dimension: 'decision_ownership', title: 'Delegated work without defined final approval', turns: ['T03', 'T04', 'T05'] },
      { kind: 'power', dimension: 'voice_participation', title: 'Objection about testing raised and answered', turns: ['T06', 'T07'] },
      { kind: 'gap', category: 'meaning_expectations', title: 'Whether "Understood" means agreement', turns: ['T06', 'T07', 'T08'] },
    ], mustNot: ['Assume the employee is constrained', 'Assume the manager is coercive'] },
  },
  {
    id: 's3', title: 'Two Strong Opinions', roles: ['Product Manager', 'Engineer'],
    description: 'Two peers understand each other and still disagree about how to roll out a new checkout.',
    areas: ['Genuine disagreement', 'Shared ground', 'Open questions'],
    context: { topic: 'Rollout plan for the new checkout', objective: 'Decide how to launch', project: 'Checkout redesign' },
    turns: [
      T(1, 'Product Manager', 'A', 'I’d like to roll the new checkout out to all users on Monday. The pilot numbers look good and waiting costs us another sprint.'),
      T(2, 'Engineer', 'B', 'I understand the pull to ship. My concern is payment retries. If they fail at full volume, we won’t be able to roll back cleanly.'),
      T(3, 'Product Manager', 'A', 'So you’re worried about retries under load, not about the checkout design itself?'),
      T(4, 'Engineer', 'B', 'Exactly. The design is fine. It’s the load behaviour I haven’t been able to test.'),
      T(5, 'Product Manager', 'A', 'I hear that. But the pilot had 5,000 users and no retry failures. I think that’s enough evidence to go.'),
      T(6, 'Engineer', 'B', 'It’s a reasonable argument. I just don’t think 5,000 users is representative of Monday morning traffic. I’d still start with 10%.'),
      T(7, 'Product Manager', 'A', 'A phased rollout costs us a week, and I’d rather take the risk than lose the week.'),
      T(8, 'Engineer', 'B', 'I see that trade-off. I’d take the week.'),
      T(9, 'Product Manager', 'A', 'So we see it differently. We both want a safe launch, and we disagree about how much risk the week is worth.'),
      T(10, 'Engineer', 'B', 'Yes, that’s it. Who breaks the tie?'),
      T(11, 'Product Manager', 'A', 'Probably Rina, since it touches both our areas. I’ll set up a short call.'),
    ],
    reference: { verdict: 'genuine_disagreement', labels: [
      { kind: 'gap', category: 'genuine_disagreement', title: 'Rollout speed vs. rollback risk', turns: ['T05', 'T06', 'T07', 'T08'] },
      { kind: 'shared', title: 'Both want a safe launch; the design is not in question', turns: ['T04', 'T09'] },
      { kind: 'power', dimension: 'decision_ownership', title: 'Who decides the rollout', turns: ['T10', 'T11'] },
    ], mustNot: ['Invent a communication gap', 'Treat the disagreement as a misunderstanding'] },
  },
  {
    id: 's4', title: 'Unclear Expectations', roles: ['Project Lead', 'Designer'],
    description: 'Familiar words such as "done" and "quality" are used without a shared definition.',
    areas: ['Meaning & Expectations', 'Definition of done', 'Decision ownership'],
    context: { topic: 'Landing page deliverable', objective: 'Agree what is delivered on Friday', project: 'Campaign launch' },
    turns: [
      T(1, 'Project Lead', 'A', 'Can you get the landing page done by Friday? Nothing fancy, just good quality.', '00:04'),
      T(2, 'Designer', 'B', 'Sure. When you say done, do you mean the designs are ready for review, or ready for the developers?', '00:11'),
      T(3, 'Project Lead', 'A', 'Done is done. Finished, so we can move on.', '00:19'),
      T(4, 'Designer', 'B', 'Okay. I’ll aim for polished designs by Friday.', '00:26'),
      T(5, 'Project Lead', 'A', 'Good. And make sure it’s high quality, like the last one.', '00:33'),
      T(6, 'Designer', 'B', 'For me quality includes accessibility checks, and those will take longer than Friday.', '00:41'),
      T(7, 'Project Lead', 'A', 'Accessibility is a developer thing, isn’t it? I thought they’d handle that.', '00:49'),
      T(8, 'Designer', 'B', 'I usually specify it in the designs. I wasn’t sure who owns it here.', '00:56'),
      T(9, 'Project Lead', 'A', 'Let’s not get stuck on that. Just send me what you have on Friday and we’ll see.', '01:03'),
      T(10, 'Designer', 'B', 'Alright. And the copy: will someone provide it, or should I use placeholder text?', '01:08'),
      T(11, 'Project Lead', 'A', 'Use whatever is on the old page for now.', '01:15'),
    ],
    reference: { verdict: 'communication_gap', labels: [
      { kind: 'gap', category: 'meaning_expectations', title: 'What "done" means', turns: ['T01', 'T02', 'T03', 'T04'] },
      { kind: 'gap', category: 'meaning_expectations', title: 'What "quality" includes', turns: ['T05', 'T06'] },
      { kind: 'gap', category: 'meaning_expectations', title: 'Who owns accessibility', turns: ['T07', 'T08'] },
      { kind: 'power', dimension: 'decision_ownership', title: 'Scope decided by "see what you have"', turns: ['T09', 'T11'] },
    ], mustNot: [] },
  },
];
