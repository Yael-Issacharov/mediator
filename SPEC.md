# Master Product & Development Specification (verbatim, pasted by Yael 2026-11-11)

AI-POWERED WORKPLACE COMMUNICATION MEDIATOR
MASTER PRODUCT & DEVELOPMENT SPECIFICATION
Investor-Facing Desktop Prototype
Core Philosophy: Understanding Before Agreement
PART 1 — PROJECT OVERVIEW
1. Project Objective
Build an interactive desktop application prototype of an AI-powered workplace communication mediator.
The product helps people understand what happens when workplace conversations lead to misunderstandings, conflicting expectations, or unresolved disagreements.
The system analyzes workplace conversations using two sources of information:

1. The actual conversation transcript.
2. Contextual communication profiles created from short participant assessments.

It identifies potential communication gaps, distinguishes misunderstandings from genuine disagreements, considers relevant power dynamics, and generates a neutral, evidence-based shared report.
The system does not determine who is right. It helps participants understand what was said, where their perspectives differ, and what remains unresolved.
This is an investor-facing prototype, not a production MVP.
The prototype must demonstrate the central product concept through a complete, functional end-to-end experience.
It should combine:

* Prepared demo scenarios and participant profiles.
* Live AI analysis of actual inputs.
* Editable participant profiles.
* Manual transcript input and transcript upload.
* A structured, evidence-based analysis report.

The investor should be able to explore the application, change inputs, run an analysis, and see how the output responds.
2. The Problem
Workplace communication is not always understood as intended.
Two people can participate in the same conversation, hear exactly the same words, and leave with different interpretations.
This can happen because of differences in:

* Communication preferences.
* The meaning assigned to words and expressions.
* Expectations and assumptions.
* Feedback preferences.
* Decision-making approaches.
* The interpretation of urgency and responsibility.
* Professional experience and expertise.
* Organizational roles and power dynamics.

These differences can create friction, repeated clarification, unclear ownership, frustration, and unresolved disagreements.
Many workplace conflicts are not caused by a lack of communication. They are caused by differences in how communication is interpreted.
The product addresses this problem by helping participants understand the communication dynamics of a conversation after it has happened.
3. Product Positioning
An AI-powered neutral mediator that analyzes workplace conversations and identifies where participants' understanding, expectations, or perspectives may differ.
The system:

* Analyzes conversations after they happen.
* Uses participant profiles as contextual information.
* Identifies potential communication gaps.
* Distinguishes misunderstandings from genuine disagreements.
* Recognizes relevant power dynamics without making unsupported assumptions.
* Generates a shared report with evidence and open questions.

The system does not:

* Intervene during conversations.
* Decide who is right or wrong.
* Evaluate employee performance.
* Diagnose personalities or psychological conditions.
* Act as a therapist or manager.
* Force agreement or compromise.
* Assume every disagreement is a communication problem.

The goal is understanding, not agreement.
PART 2 — PRODUCT PRINCIPLES & ANALYTICAL FRAMEWORK
4. Core Product Principles
All product logic, UX, and AI behavior must follow these principles.
Neutrality
Represent both participants fairly, regardless of seniority, role, communication style, or position.
Evidence-based analysis
Every identified insight must be supported by a specific statement or observable interaction in the conversation.
Precision over recall
It is better to identify fewer meaningful insights than to generate many weak or speculative findings.
No psychological diagnosis
Do not assign personality types, diagnose psychological conditions, or make unsupported claims about emotional states.
No hidden-intent inference
Do not infer fear, discomfort, manipulation, coercion, lack of psychological safety, or hidden intentions without explicit evidence.
No forced consensus
Recognize that participants can understand each other perfectly and still disagree.
Power awareness
Do not disguise genuine power imbalances as simple communication problems.
Profile as context, not evidence
Participant profiles can help contextualize communication patterns, but cannot independently prove that a communication gap occurred.
The conversation remains the primary source of evidence.
Transparency
Clearly distinguish:

* What was explicitly observed.
* What may be a reasonable interpretation.
* What remains unknown.

User ownership
Participants should be able to review, correct, approve, or reject AI-generated insights.
5. Communication Gap Taxonomy
Use four primary categories.
5.1 Meaning & Expectations Gap
Different meanings, definitions, assumptions, or expectations.
Examples:

* One participant interprets "high quality" as precision, while another interprets it as innovation.
* Different expectations regarding responsibility or ownership.
* Different definitions of what constitutes a completed task.
* Unclear expectations regarding deliverables, deadlines, or outcomes.

This category combines semantic differences and expectation mismatches.
5.2 Communication & Feedback Gap
Differences in communication and feedback preferences.
Examples:

* One participant prefers direct, concise feedback.
* Another prefers contextual feedback with examples.
* One expects an immediate response.
* Another prefers time to process information before responding.
* One assumes a short instruction is sufficient, while the other needs more explanation.

Do not treat one communication style as better than another.
5.3 Interpretation Gap
A difference between what a speaker explicitly states they intended and what another participant explicitly states they understood.
Rely on statements in the conversation, not speculation about hidden intentions.
Example:

* Speaker: "I wanted to give you creative freedom."
* Listener: "I understood that I was responsible for making the final decision."

The difference is relevant only if supported by the transcript.
5.4 Genuine Disagreement
Participants understand each other's positions but disagree on the best solution, direction, or decision.
Examples:

* Two colleagues agree on the objective but prefer different approaches.
* A manager and employee understand each other's arguments but retain different professional opinions.
* Participants acknowledge each other's concerns but do not reach agreement.

Genuine disagreement is not automatically a communication gap.
The system must be able to conclude that there is no meaningful communication gap when the evidence supports that conclusion.
Category handling
Categories may overlap internally. Present the clearest explanation rather than repeating the same finding under multiple categories.
Do not introduce a separate Cognitive Processing Mismatch category in this prototype. Its detection is not sufficiently defined.
6. Power Awareness
Power Awareness is a cross-cutting analytical layer, not a fifth communication gap category.
Examine five dimensions when relevant.
6.1 Formal Authority
Who has official decision-making authority?
Examples:

* Approval responsibility.
* Budget ownership.
* Setting priorities.
* Formal managerial authority.

6.2 Expertise & Dependency
Does one participant possess relevant expertise, knowledge, or resources that another participant depends on?
Do not assume expertise simply because of a job title.
6.3 Interactional Influence
Who appears to shape the direction of the conversation?
Observable signals:

* Introducing or changing the agenda.
* Advancing or rejecting proposals.
* Redirecting the discussion.
* Influencing which options are considered.

Influence cannot reliably be measured from a single conversation.
6.4 Voice & Participation
Do both participants express their positions, concerns, questions, and objections?
Look for:

* Explicit objections.
* Invitations to contribute.
* Responses to objections.
* Opportunities to express alternative views.

Silence is not evidence of agreement, fear, or discomfort.
6.5 Decision Ownership
Who makes the decision, who implements it, and who bears responsibility for the outcome?
Important distinctions:

* Agreement to execute does not necessarily mean agreement with the decision.
* Delegating execution does not necessarily mean transferring decision authority.
* Delegating responsibility without defining ownership may create ambiguity.

Power analysis rules
Distinguish formal authority from actual influence.
Do not assume:

* A manager always dominates a conversation.
* An employee is necessarily constrained.
* Direct communication means dominance.
* Indirect communication means submission.
* Accepting another person's proposal means that person has greater power.
* A participant's lack of objection indicates consent.

Do not generate arbitrary power scores or rankings.
Only surface power-related observations when supported by evidence.
PART 3 — PARTICIPANTS & PROFILES
7. Participant Assessment
Create a short, scenario-based assessment that takes less than five minutes.
This is not a personality test.
Its purpose is to understand how participants prefer to communicate and how they report responding to different workplace situations.
Keep three information types clearly separated:

1. Communication Preferences — how a person prefers to communicate and receive information.
2. Behavioral Tendencies — how a person reports they tend to behave.
3. Contextual Sensitivity — how behavior may change depending on role, relationship, or context.

Initial assessment topics
Include questions covering:

1. Interpretation of ambiguous feedback.
2. Preferred feedback style.
3. Response to unclear instructions.
4. Approach to professional disagreement.
5. Need for concrete examples or definitions.
6. What creates a sense of mutual understanding.
7. Interpretation of delayed responses.
8. Decision-making preferences.
9. Response to disagreement with a senior person.
10. Interpretation of urgency.

Additional Power Awareness questions
Include questions covering:

* Response to vague managerial direction.
* Willingness to express disagreement.
* Response to an unrealistic deadline.
* Conditions that make it easier to express alternative opinions.
* Interpretation of delegated responsibility.
* Difference between agreeing to execute and agreeing with a decision.

Profile requirements
Create two preconfigured demo profiles.
Both profiles must be visible and editable in the prototype.
The demo operator must be able to:

* View assessment answers.
* Edit answers.
* Update profile information.
* See how the profile changes.
* Compare the two profiles.
* Rerun the conversation analysis using updated profiles.

Do not present profile descriptions as fixed personality labels.
Profiles should remain descriptive and contextual.
8. Demo Participant Profiles
Use the following as initial demo data.
Participant A
Communication Preferences

* Direct and outcome-oriented.
* Prefers clear, concise communication.
* Comfortable expressing disagreement.
* Prefers exploring options before making a decision.
* Wants urgency to be defined through deadlines and priorities.

Behavioral Tendencies

* May assume certain professional terms have an obvious meaning.
* May interpret uncertain feedback as questioning their judgment.

Contextual Sensitivity

* May need more explicit context when feedback is ambiguous.
* May interpret a lack of response as a sign that the proposal was not understood.

These are possible tendencies, not diagnoses or established facts.
Participant B
Communication Preferences

* Contextual and reflective.
* Prefers concrete examples and clear definitions.
* Likes to process feedback before responding.
* Values mutual confirmation of understanding.
* Prefers explicit decision ownership.

Behavioral Tendencies

* Tends to interpret urgency as requiring immediate action.
* May execute a decision while retaining reservations.
* May present disagreement gently.

Contextual Sensitivity

* May feel more comfortable presenting an alternative opinion when explicitly invited.
* May interpret "I trust you, find a solution" as transferring decision responsibility.

Do not infer fear, discomfort, or lack of psychological safety from these tendencies.
9. Profile Comparison
Create a dedicated comparison screen.
Highlight:

* Similarities.
* Differences.
* Potential communication friction points.
* Areas where clarification may be helpful.

Examples:

* Direct vs. contextual feedback preferences.
* Immediate action vs. time to process.
* Assumed meaning vs. need for concrete definitions.
* Exploring options vs. defining decision ownership.

Do not generate arbitrary compatibility scores.
Do not imply that different profiles are incompatible.
Clearly distinguish between:

* Profile-based potential friction.
* Gaps actually observed in a conversation.

A potential friction point is not proof that a communication problem occurred.
PART 4 — CONVERSATIONS & DEMO SCENARIOS
10. Prepared Demo Scenarios
Create four ready-to-use workplace conversation scenarios.
Each scenario must include:

* Scenario title.
* Short description.
* Participant names and roles.
* Conversation transcript.
* Optional contextual information.
* Reference findings for internal testing and fallback demonstration.

Prepared findings are reference labels, not mandatory AI conclusions.
Live AI analysis must analyze the actual transcript and profiles. It must not simply reproduce prepared findings.
Scenario 1 — Creative Feedback
Participants:

* Creative Director.
* Designer.

Transcript:
Creative Director:
"I think the design needs to be bolder. It's not quite there yet."
Designer:
"Can you give me an example of what you mean by bolder?"
Creative Director:
"I don't want to get into all the details. I trust you to find the right direction."
Designer:
"Okay, I'll explore a few options. Just want to make sure we're aligned on the deadline."
Expected areas to investigate:

* Meaning & Expectations Gap around the word "bolder".
* Communication & Feedback Gap.
* Ambiguity around creative autonomy.
* Decision ownership and execution responsibility.
* Unclear deadline expectations.

Do not conclude that the designer is afraid to disagree.
Scenario 2 — Manager vs. Employee
A manager gives unclear direction, establishes a tight deadline, and delegates responsibility to an employee.
Expected areas:

* Formal Authority.
* Meaning & Expectations.
* Voice & Participation.
* Decision Ownership.
* Difference between execution and agreement.

Do not automatically assume that the employee is constrained or that the manager is coercive.
Scenario 3 — Two Strong Opinions
Two colleagues discuss a professional decision.
Both understand the other's position but disagree on the best solution.
Expected areas:

* Genuine Disagreement.
* Shared Ground.
* Different Perspectives.
* Open Questions.

The AI must not invent a communication gap where none is supported.
Scenario 4 — Unclear Expectations
A Project Lead and Designer discuss deliverables, deadlines, quality, and responsibility.
Both use familiar professional language but do not define it consistently.
Expected areas:

* Meaning & Expectations Gap.
* Different definitions of completion.
* Unclear responsibilities.
* Decision ownership.
* Clarification questions.

11. Conversation Input
The prototype must support three ways to provide a conversation.
A. Prepared scenario
Select one of the four prepared demo scenarios.
B. Manual transcript
Allow users to paste or write a conversation transcript.
C. Transcript upload
Initially support:

* TXT.
* DOCX.

PDF can be considered later.
Transcript handling

* Preserve existing speaker labels where possible.
* Allow users to assign or edit speaker identities.
* Allow users to review and edit the transcript before analysis.
* Clearly indicate when speaker identification is missing or uncertain.
* Do not invent speaker identities or timestamps.

Optional context
Allow the user to add:

* Conversation topic.
* Participant roles.
* Discussion objective.
* Relevant project context.

Keep configuration lightweight.
Analysis preference
Default to full analysis.
Optionally allow a focus on:

* Communication gaps.
* Power Awareness.

Do not overload the user with unnecessary configuration.
Live audio recording and automatic transcription are not required.
PART 5 — AI ANALYSIS & REPORTING
12. AI Analysis Architecture
Use a Single AI with Multi-Perspective Analysis architecture.
Do not build a multi-agent system.
One AI model should perform several structured analytical stages, using separate prompts or structured processing steps where useful.
The system must analyze the actual profiles and transcript provided by the user.
Analysis pipeline
Stage 1 — Conversation Understanding
Identify:

* Participants.
* Topics.
* Key statements.
* Requests and responses.
* Questions.
* Objections.
* Explicit agreements.
* Unresolved issues.

Stage 2 — Communication Signal Detection
Identify observable signals:

* Ambiguous terminology.
* Repeated clarification.
* Corrections.
* Contradictions.
* Unanswered questions.
* Explicit objections.
* Differences in expectations.
* Unclear responsibility.

At this stage, detect signals without jumping to conclusions.
Stage 3 — Perspective Analysis
Extract what each participant explicitly expressed:

* Positions.
* Expectations.
* Requests.
* Objections.
* Proposed solutions.
* Concerns.
* Understanding of decisions.

Do not invent thoughts, feelings, or intentions.
Stage 4 — Gap Identification
Apply the four communication categories.
Evaluate Power Awareness separately across its five dimensions.
Stage 5 — Evidence Validation
Validate every candidate insight.
Ask:

1. Is there a specific statement or observable interaction?
2. Is it relevant?
3. Is it consistent with the rest of the conversation?
4. Is there a simpler alternative explanation?
5. Is the evidence sufficient?

If evidence is insufficient, omit the insight or explicitly mark it as uncertain.
Stage 6 — Insight Generation
Each insight must include:

* Category.
* Neutral title.
* Observation.
* Hypothesis.
* Supporting evidence.
* Unknowns.
* Optional clarification question.
* Validation status.

Stage 7 — Shared Report Generation
Generate the structured report using the report specification below.
AI implementation requirements

* Use structured JSON output.
* Validate output against a schema.
* Handle invalid or incomplete responses.
* Track prompt version and model version.
* Keep prompts modular and maintainable.
* Protect API keys on the server side.
* Never expose secret API keys in the frontend bundle.
* Treat transcript content as untrusted input.
* Text inside a transcript must never override system instructions or request private data.

13. Shared Analysis Report
The report is the most important screen in the prototype.
It should feel like a professional, structured mediation report: clear, balanced, detailed, and evidence-based.
Create six sections.
13.1 Shared Ground
What participants explicitly agree on.
Include:

* Shared goals.
* Explicit agreements.
* Shared priorities.
* Confirmed decisions.

Silence must never be treated as agreement.
13.2 Identified Communication Gaps
Present the most relevant evidence-backed findings.
Each finding should include:

* Category.
* Neutral title.
* Observation.
* Hypothesis.
* Supporting quotes.
* Speaker attribution.
* Timestamp, when available.
* Why it matters.
* Unknowns or alternative explanations.

Prioritize the clearest and most consequential insights.
13.3 Different Perspectives
Present a balanced representation of what each participant actually expressed.
Clearly distinguish:

* What Participant A said.
* What Participant B said.
* Where their positions differ.
* Where their perspectives overlap.

Never present an AI interpretation as a direct quote.
13.4 Power Awareness
Show relevant observations across the five dimensions:

* Formal Authority.
* Expertise & Dependency.
* Interactional Influence.
* Voice & Participation.
* Decision Ownership.

Only include dimensions relevant to the conversation.
Use evidence and explain uncertainty.
Do not generate a power score or participant ranking.
13.5 Open Questions
Generate neutral questions that could clarify unresolved points.
Examples:

* What specifically would make the design feel bolder?
* Who has final approval responsibility?
* Does agreeing to execute the decision also mean agreeing with its direction?
* Is the deadline fixed or negotiable?

Questions should help participants clarify their understanding, not push them toward a predetermined solution.
13.6 Suggested Next Steps
Offer optional practical suggestions.
Examples:

* Define what the expected outcome looks like.
* Clarify who owns the final decision.
* Confirm the deadline and priorities.
* Explicitly distinguish between agreement and execution.

Do not force compromise or agreement.
Insight structure
Every insight must contain:

* Category.
* Title.
* Observation.
* Hypothesis.
* Evidence.
* Unknowns.
* Optional clarification question.
* Validation status.

Use short direct quotes and timestamps when available.
Never fabricate quotes, timestamps, or evidence.
Observation / Hypothesis / Unknown
This distinction must be visible in the interface.
Observation: What was explicitly said or objectively happened.
Hypothesis: A possible explanation supported by the evidence.
Unknown: What cannot be reliably determined from the conversation.
This distinction is central to the product's credibility.
14. Insight Validation & User Feedback
Allow the demo operator to interact with each AI-generated insight.
Actions:

* Approve.
* Correct.
* Reject.

If corrected, allow a short text explanation.
If rejected:

* Mark the finding as rejected or disputed.
* Do not present it as established fact.
* Preserve the distinction between AI-generated findings and user validation.

Do not imply that user approval proves an insight is objectively true.
PART 6 — APPLICATION & VISUAL DESIGN
15. Visual Design Direction — High-Fidelity Wireframe
The visual output must be a high-fidelity wireframe, not a fully designed or branded product.
The objective is to create a detailed, realistic, interactive representation of the final application's structure, user experience, information hierarchy, and interactions.
It should look like real software that is ready for an investor demonstration, while remaining visually neutral and intentionally unbranded.
Visual language
Use:

* Neutral grayscale palette.
* White and light-gray backgrounds.
* Subtle borders and dividers.
* Clear and consistent typography hierarchy.
* Consistent spacing.
* Well-structured cards, panels, and tables.
* Simple, restrained iconography.
* Clear visual separation between sections.
* Subtle color only when necessary to distinguish participant identities, categories, observations, hypotheses, and validation states.

Interface quality
Build:

* Complete navigation.
* Realistic forms.
* Functional interactive components.
* Detailed report layouts.
* Realistic sample content.
* Clear information hierarchy.
* Consistent desktop layouts.
* Responsive behavior where relevant.
* Hover, active, selected, loading, disabled, and error states.

All screens should feel coherent and belong to the same application.
Do not create

* Final brand identity.
* Logo or custom branding.
* Distinctive art direction.
* Custom illustrations.
* Decorative animations.
* Gradients.
* Elaborate typography treatments.
* Final product color palette.
* Marketing landing pages.
* Decorative data visualizations.

Do not use rough sketches, generic placeholder boxes, or incomplete layouts.
The result must be detailed and presentation-ready, but intentionally neutral.
Prioritize:

1. Product logic.
2. User flows.
3. Information architecture.
4. Content hierarchy.
5. Interaction behavior.
6. Realistic sample data.
7. Consistent high-fidelity wireframe execution.

16. Application Structure
Build a desktop application with persistent sidebar navigation and a main workspace.
Suggested navigation:

1. Home.
2. Participants.
3. Conversations.
4. Analysis.
5. Settings.

Screen 1 — Home / Dashboard
Include:

* Short product introduction.
* Primary action: Start New Analysis.
* Recent analysis sessions.
* Prepared demo scenarios.
* Participant shortcuts.
* Clear entry points to the main workflow.

The dashboard should help an investor understand the product immediately.
Screen 2 — Participants & Profiles
Include:

* Two demo participants.
* Participant names and roles.
* Assessment overview.
* Communication Preferences.
* Behavioral Tendencies.
* Contextual Sensitivity.
* Editable assessment answers.
* Profile update functionality.

Screen 3 — Profile Comparison
Include:

* Side-by-side comparison.
* Similarities.
* Differences.
* Potential friction points.
* Contextual explanations.

Do not show arbitrary compatibility scores.
Screen 4 — Conversations
Include:

* Prepared scenario library.
* Manual transcript input.
* Transcript upload.
* Speaker assignment.
* Transcript review and editing.
* Optional contextual information.
* Analysis action.

Screen 5 — Analysis Report
Include the six report sections:

1. Shared Ground.
2. Identified Communication Gaps.
3. Different Perspectives.
4. Power Awareness.
5. Open Questions.
6. Suggested Next Steps.

Allow users to review and validate individual findings.
Screen 6 — Settings
Keep this lightweight.
Include only settings relevant to the prototype, such as:

* AI connection status.
* Demo data reset.
* Analysis configuration.
* Prototype information.

Do not build unnecessary production settings.
PART 7 — HYBRID DEMO & TECHNICAL ARCHITECTURE
17. Hybrid Demo Experience
The prototype must combine two modes.
A. Prepared Demo Experience
Provide:

* Two ready-to-use demo profiles.
* Four prepared workplace scenarios.
* Predefined transcripts.
* Optional contextual information.
* Reference findings for fallback and internal testing.

This guarantees that the investor demonstration can be completed reliably.
B. Live AI Analysis
The system must be able to analyze:

* The selected participant profiles.
* The actual conversation transcript.
* The optional contextual information.

It must generate a new structured report based on those inputs.
If the profiles or transcript change, the user must be able to run a new analysis.
Never display cached or prewritten findings as if they were generated by live AI.
Fallback behavior
If the AI service is unavailable or returns an invalid response, allow a clearly labeled fallback report.
Use this exact label:
"Demo Example — Not Generated by Live AI"
Never misrepresent fallback content as live AI output.
Prepared reference findings are evaluation aids, not mandatory AI conclusions.
18. Technical Architecture
Before selecting a technology stack, inspect the existing repository.
Reuse existing infrastructure when reasonable.
If starting from scratch:

* Use React for the frontend.
* Evaluate Tauri vs. Electron.
* Choose the simplest reliable desktop architecture.
* Prefer local or lightweight persistence using JSON or SQLite.
* Keep the AI integration modular.

Do not overengineer the prototype.
Suggested logical separation

* UI and navigation.
* Assessment and profile logic.
* Profile comparison.
* Conversation management.
* Transcript handling.
* AI analysis pipeline.
* Report rendering.
* Demo data and fallback logic.

Suggested data models
Participant

* id
* name
* role
* assessment_answers
* communication_profile
* created_at
* updated_at

Conversation

* id
* title
* description
* participants
* transcript
* context
* source_type
* created_at

Analysis

* id
* conversation_id
* participant_profile_versions
* structured_result
* model_version
* prompt_version
* status
* created_at

Insight

* id
* analysis_id
* category
* title
* observation
* hypothesis
* evidence
* unknowns
* clarification_question
* validation_status

InsightFeedback

* id
* insight_id
* participant_id
* action
* correction_text
* created_at

Track profile and conversation versions used for each analysis.
If a profile or transcript changes, make it clear that the existing report relates to an earlier version and allow the user to rerun the analysis.
19. Privacy & Prototype Boundaries
This is an investor prototype.
For this stage:

* Use synthetic profiles.
* Use fictional conversations.
* Use local or controlled demo data.
* Allow the demo operator to view and edit both profiles.
* Do not use real employee data or private workplace transcripts.
* Do not integrate with employers or HR systems.
* Do not build production authentication.
* Do not claim enterprise security or production-level compliance.
* Protect AI API keys on the server side.
* Do not implement real-time recording or transcription.

Preserve the following principles for future production development:

* Each user owns their private profile.
* Employers and other participants cannot access private assessment answers.
* Shared reports must not expose private profiles or questionnaire answers.
* Separate identity, profile, transcript, analysis, and report data.
* Minimize the profile information sent to the AI.
* Obtain consent before recording or analyzing conversations.
* Establish clear retention and deletion policies.
* Do not use the product for performance ranking or employee evaluation.
* Do not build a persistent semantic dictionary in the production MVP.

Do not claim that the prototype already implements these production safeguards.
PART 8 — EVALUATION & ACCEPTANCE
20. Evaluation & Quality Control
The long-term product must be tested against a collection of approximately 30–50 scripted conversations.
Include examples of:

* Clear semantic gaps.
* Expectation mismatches.
* Differences in interpretation.
* Feedback preference differences.
* Genuine disagreements without misunderstanding.
* Manager-driven power asymmetry.
* Influential subordinates.
* Managers whose proposals are not adopted.
* Conversations with no meaningful communication gap.
* Conversations with insufficient evidence.

Human reviewers should label:

* Actual communication gaps.
* Genuine disagreements.
* Power observations.
* Supporting evidence.
* Unknowns.

Measure:

* Precision.
* False Positive Rate.
* Coverage.
* Evidence Quality.
* Neutrality across roles.
* User Validation.

Prioritize precision and low false positives over the number of insights generated.
The prototype does not need a complete evaluation platform, but its architecture should allow testing and iteration.
21. Acceptance Criteria
The prototype is successful when an investor can:

1. Open the desktop application.
2. Understand the product concept from the home screen.
3. Explore two preconfigured participant profiles.
4. Complete or edit an assessment.
5. See how profile information changes.
6. Compare two profiles.
7. Select a prepared conversation scenario.
8. Paste a custom transcript.
9. Upload a supported transcript file.
10. Assign speakers.
11. Add optional context.
12. Run live AI analysis.
13. Receive a structured analysis report.
14. See the evidence behind each finding.
15. Distinguish observations from hypotheses.
16. See Power Awareness when supported by evidence.
17. Approve, correct, or reject findings.
18. Change profiles or conversation content and rerun analysis.
19. Use a clearly labeled fallback when live AI is unavailable.

Live audio recording is not required.
The prototype should demonstrate the complete product logic, not just a collection of static screens.
22. Definition of Success
An investor should be able to interact with the prototype and understand:

* What information the system learns about participants.
* How two communication profiles differ.
* How those differences may affect a workplace conversation.
* How AI identifies potential misunderstandings.
* How the system distinguishes misunderstandings from genuine disagreements.
* How Power Awareness adds another analytical layer.
* How evidence supports each insight.
* How the report helps participants understand each other.

The analysis must be dynamic, evidence-based, and responsive to actual inputs.
The system does not simply summarize what people said.
It helps explain where their understanding may differ, why that difference matters, and what remains unresolved.
PART 9 — DEVELOPMENT PROCESS & MODEL STRATEGY
23. Model Workflow Strategy
Use a two-model development strategy.
Phase 1 — Planning & Architecture: Claude Opus 5.5
Use Opus 5.5 for the initial planning phase.
Before writing code, Opus should:

1. Thoroughly review this complete specification.
2. Inspect the existing repository and its structure.
3. Summarize the current architecture and relevant technologies.
4. Evaluate the simplest suitable desktop technology stack.
5. Identify the proposed AI integration approach.
6. Define the main data structures.
7. Plan the profile and conversation workflows.
8. Define the AI analysis pipeline and structured output.
9. Identify product, UX, and technical risks.
10. Identify dependencies and unresolved decisions.
11. Produce a clear, prioritized implementation plan.
12. Estimate the main implementation stages and their dependencies.

Do not begin substantial implementation before presenting the plan and receiving user approval.
The planning output should be detailed enough to guide development, but concise enough to avoid unnecessary token consumption.
Phase 2 — Implementation: Claude Sonnet 5.5
After the plan and architecture are approved, switch to Sonnet 5.5 for implementation.
Sonnet should:

* Follow the approved plan.
* Use this specification as the source of truth.
* Build the application incrementally.
* Avoid reopening approved decisions without a concrete reason.
* Keep changes focused and testable.
* Report completed work and remaining issues concisely.

Phase 3 — Complex Problem Solving: Claude Opus 5.5
Temporarily use Opus when:

* A complex architectural issue arises.
* Sonnet cannot reliably resolve a difficult bug.
* The AI analysis methodology requires substantial reconsideration.
* A major product or technical decision needs deeper reasoning.

Once the issue is resolved, return to Sonnet for implementation.
The user controls model switching.
Do not switch models unnecessarily or use Opus for routine implementation tasks.
If the selected Claude Code environment supports a planning/execution model mode, you may recommend it, but do not assume it is configured or available. The user remains in control of the model selection.
24. Token Efficiency & Cost Management
The development process should be token-efficient and cost-conscious without compromising product quality, code quality, analytical accuracy, or the investor demonstration experience.
Optimize unnecessary work, not essential reasoning.
Token efficiency principles

* Avoid unnecessary explanations, repeated summaries, and lengthy progress updates.
* Do not repeat this project specification in responses.
* Treat this document as the source of truth. Refer to relevant sections instead of regenerating the full specification.
* Do not repeatedly inspect files that have not changed unless necessary.
* Read only files and code relevant to the current task.
* Avoid rewriting entire files when a targeted change is sufficient.
* Prefer small, focused, incremental modifications.
* Do not generate multiple alternative implementations unless there is a meaningful architectural decision.
* Avoid unnecessary dependencies, abstractions, components, and configuration.
* Do not create documentation that duplicates existing documentation.
* Keep code comments concise and useful.
* Avoid unnecessary tool calls and repeated verification of unchanged functionality.
* Reuse existing components, utilities, and infrastructure whenever reasonable.

Efficient development workflow
Before each implementation task:

1. Identify the exact objective.
2. Inspect only the relevant parts of the codebase.
3. Determine the smallest reliable implementation.
4. Make the required changes.
5. Verify the result.
6. Report what changed and any remaining issues concisely.

Do not repeatedly re-plan the entire project.
Do not revisit previously approved architectural decisions unless new evidence indicates a real problem.
If a task is ambiguous or could significantly expand the scope, ask before proceeding.
Do not perform broad refactoring or redesign without a clear reason.
Context management
Preserve context efficiently during long development sessions.
Maintain a concise project status document containing:

* Current architecture.
* Completed stages.
* Outstanding tasks.
* Important decisions.
* Known issues.
* Relevant next steps.

Update it only when meaningful changes occur.
When context becomes limited, create a concise handoff summary rather than repeating the entire project specification.
Preserve previously approved decisions and avoid asking the user to repeat information already documented.
What must never be sacrificed
Token efficiency must never come at the expense of:

* Evidence-based AI analysis.
* Neutrality between participants.
* Accurate distinction between observations, hypotheses, and unknowns.
* Reliable transcript processing.
* Correct handling of Power Awareness.
* Security of API keys.
* Functional end-to-end user flows.
* Testing of critical features.
* Quality and completeness of the investor demonstration.

Do not shorten prompts or remove validation steps if doing so reduces analytical reliability.
Model selection for individual tasks
Use Sonnet 5.5 for routine implementation and everyday development.
Use Opus 5.5 selectively for complex reasoning and architecture.
Haiku 5.5 may be used for simple, repetitive, low-complexity tasks when appropriate.
Do not use the most expensive model by default for every task.
If a task requires more reasoning than the current model can reliably provide, recommend switching models and briefly explain why.
The user should remain in control of model selection and associated cost implications.
PART 10 — IMPLEMENTATION PLAN
25. Development Stages
Stage 1 — Foundation

* Inspect repository.
* Establish desktop architecture.
* Build navigation and shared UI components.
* Define data structures.
* Establish the neutral high-fidelity wireframe design system.

Stage 2 — Participants

* Implement two demo profiles.
* Build the assessment.
* Enable profile editing.
* Build profile comparison.

Stage 3 — Conversations

* Build prepared scenarios.
* Add manual transcript input.
* Add TXT/DOCX upload.
* Add speaker assignment.
* Add optional context.

Stage 4 — AI Analysis

* Implement the structured analysis pipeline.
* Apply the four-category taxonomy.
* Implement Power Awareness.
* Add evidence validation.
* Validate structured output.

Stage 5 — Report

* Build the six-section report.
* Display evidence.
* Distinguish observation, hypothesis, and unknown.
* Add approve, correct, and reject actions.
* Implement clearly labeled fallback behavior.

Stage 6 — Polish & Testing

* Complete the high-fidelity wireframe.
* Test all four prepared scenarios.
* Test custom transcripts.
* Test profile changes and reanalysis.
* Test AI failure and fallback.
* Package the desktop application.

26. Instructions Before Starting Development
Treat this document as the source of truth for the investor prototype.
Do not immediately start building the entire application.
First, complete the planning phase using Claude Opus 5.5.
Your first response must contain:

1. A concise summary of your understanding of the product.
2. A summary of the existing repository and architecture.
3. A recommended desktop technology stack and rationale.
4. A proposed AI integration architecture.
5. The main data structures.
6. A proposed application structure and user flow.
7. A prioritized implementation plan.
8. Key risks, assumptions, and unresolved decisions.
9. Any questions that genuinely require user input before development.

Do not ask questions whose answers are already specified in this document.
Do not start substantial implementation until the user approves the plan.
After approval, switch to Claude Sonnet 5.5 for implementation.
During development:

* Follow the product principles.
* Build an investor prototype, not a production MVP.
* Prioritize a complete end-to-end experience.
* Do not add features outside the agreed scope.
* Do not generate unsupported findings.
* Do not infer hidden intentions.
* Do not generate arbitrary scores.
* Protect API keys.
* Clearly distinguish live AI analysis from fallback content.
* Ensure all prepared scenarios work reliably.
* Use realistic interface copy and sample data.
* Document important implementation decisions concisely.
* Follow the high-fidelity wireframe direction exactly.

First deliverable: An implementation plan and architecture recommendation.
Second deliverable: An initial working investor prototype.
PART 11 — INVESTOR PRESENTATION BRIEF
27. Purpose of the Presentation
The investor presentation should communicate three central messages:

1. There is a real problem: People work together, communicate, coordinate, and make decisions, but they do not always understand the same things.
2. There is a different approach: Instead of teaching people to communicate better or solving conflicts for them, the product helps them understand what happened in a conversation.
3. There is a product opportunity: AI can analyze a conversation in the context of its participants, identify potential gaps, and generate useful insights.

The presentation should tell a clear story, not simply describe product features.
Do not build the presentation as part of the desktop prototype unless explicitly requested. Use this brief as strategic guidance for the product's investor narrative.
28. Recommended Presentation Structure — 10 Slides
Slide 01 — The Opening
Understanding Before Agreement
Suggested opening statement:
"We don't always disagree because we think differently. Sometimes, we disagree because we understand things differently."
Introduce the product name, if available, and explain the idea in one sentence.
Slide 02 — The Problem
Same conversation. Different understanding.
Illustrate how two people can hear the same statement and leave with two different interpretations.
Use a concrete workplace example.
Slide 03 — The Insight
The problem is not always what was said. It's how it was understood.
Introduce differences in:

* Meaning.
* Expectations.
* Communication preferences.
* Interpretation.
* Power dynamics.

Slide 04 — The Solution
An AI-powered neutral mediator.
Explain that the product analyzes conversations after they happen, using communication profiles, and generates a shared, evidence-based report.
Slide 05 — Understanding the Participants
Every conversation has context.
Explain how communication profiles are created, what they contain, and how they provide context for the analysis.
Emphasize that profiles are not personality diagnoses.
Slide 06 — How It Works
From conversation to understanding.
Show a simple four-step process:

1. Participants & Profiles.
2. Conversation.
3. AI Analysis.
4. Shared Report.

Slide 07 — The Analysis
Not every disagreement is a misunderstanding.
Introduce the four communication gap categories and Power Awareness.
Demonstrate how the system distinguishes a communication gap from genuine disagreement.
Slide 08 — The Output
A shared understanding of what happened.
Show the report:

* Shared Ground.
* Identified Communication Gaps.
* Different Perspectives.
* Power Awareness.
* Open Questions.
* Suggested Next Steps.

Slide 09 — The Potential
A new layer of understanding in the workplace.
Present potential value areas:

* Improved collaboration.
* Reduced misunderstandings.
* Better decision-making processes.
* Support for workplace teams and organizations.

Treat these as potential value propositions, not proven outcomes, unless supported by research or measurable results.
Slide 10 — Closing
Understanding Before Agreement.
Close with the central message:
"The product does not try to make people agree. It helps them better understand what they agree on, what they disagree on, and what remains misunderstood."
29. Presentation Guidelines

* Keep the presentation concise and story-driven.
* Prefer a concrete workplace example over long theoretical explanations.
* Use actual prototype screens rather than unrelated mockups.
* Give significant attention to the analysis report. It is the core demonstration of product value.
* Explain the distinction between misunderstanding, expectation mismatch, and genuine disagreement.
* Do not invent market statistics, research findings, revenue projections, customer results, or business traction.
* Make clear which claims are hypotheses and which are supported by evidence.

The presentation and prototype should tell the same story.
The report screen should be the main visual proof of the product's value.
FINAL PRODUCT SUMMARY
What is being built?
An interactive desktop prototype of an AI-powered workplace communication mediator.
It allows an investor to:

1. Explore two participant profiles.
2. Edit their communication assessments.
3. Compare their communication preferences and tendencies.
4. Select a prepared workplace scenario or provide a custom transcript.
5. Run live AI analysis.
6. Review a structured report.
7. Examine evidence behind the findings.
8. Distinguish observations from hypotheses and unknowns.
9. Understand how Power Awareness contributes to the analysis.
10. Approve, correct, or reject findings.
11. Change inputs and rerun the analysis.

What is the expected visual result?
A High-Fidelity Wireframe:

* Detailed.
* Realistic.
* Interactive.
* Desktop-first.
* Presentation-ready.
* Neutral and unbranded.

It is not a final visual design, branded product, marketing website, or production application.
What is the expected functional result?
A working demonstration of the complete product logic, not a collection of static screens.
The central interaction is:
Participant Profiles → Workplace Conversation → AI Analysis → Shared Report
What should an investor understand?

* What the product learns about participants.
* Why communication differences matter.
* How the AI analyzes a conversation.
* How it identifies potential misunderstandings.
* How it distinguishes misunderstandings from genuine disagreement.
* How it considers power dynamics.
* How it generates evidence-based insights.
* Why this approach can create value in workplace communication.

The system does not simply summarize what people said. It helps explain where their understanding may differ, why that difference matters, and what remains unresolved.
UNDERSTANDING BEFORE AGREEMENT
