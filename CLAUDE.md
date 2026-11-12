# mediator — AI Workplace Communication Mediator (investor prototype)

## WHERE WE ARE — updated 2026-11-12
- Built: Stages 1-6. Shell, profiles + assessment + Compare, conversations (paste/TXT/DOCX), AI pipeline on `sample`, report with Key points + O/H/U + review actions, 4 demo reports, `#tests` page, simulated failure. Detail in the body, PLAN.md, TESTING.md.
- Prompts v1.3.1 (clarity rules + caps); Yael confirmed length and clarity are right.
- **Live test 2026-11-12 (Yael, Claude app, claude-sonnet-5-5):**
  - Quotes: 21/21 verified.
  - Length: 153–255 words per report, all under 400.
  - Time: 44–63 s per scenario.
  - s1, s3, s4: verdict as expected.
  - s3 "Two Strong Opinions": genuine_disagreement, no invented gap.
  - s2 showed "expected mixed" only because her browser held an old copy of the scenario references; the model's verdict, communication_gap, is the current reference.
- Reference points found in that run: s1 3/4, s2 2/5, s3 1/1 (old refs), s4 4/4.
  - s1's miss: "bolder" filed under Communication & Feedback instead of Meaning & Expectations.
  - s2's 2 misses: formal authority and voice. The cap allows only 2 power findings, so the trade-off is by design.
  - s4 merged quality + accessibility into one finding.
- **Fixed (v11):**
  - Prepared scenarios now always load from the code, not the saved browser copy (`store.js`).
  - The scorer counts a finding at the same turns under another category as "found (filed under X)" (`eval.js`).
  - Checked locally with recorded replies: s2 now expects communication_gap; 0 console errors.
- Published: https://claude.ai/artifact/NC9LEiCvLAPsEz5hQkgVNW (v16, titled "Mediator v2", Notion style). Republish with `root` = `mediator`; never publish `.dev/`.
- Waiting on Yael (optional):
  - TESTING.md section B, the 9 manual checks.
  - Optionally rerun section A on v11 to see the corrected s2 line.
- Decided 2026-11-12 (Yael): keep the cap at 2 power findings.
- GitHub Pages (public, no live AI → demo examples only): https://yael-issacharov.github.io/mediator/ — serves `main` root; `.nojekyll` + charset/viewport meta in index.html. **Not for search engines or AI (2026-11-12, Yael):** index.html carries `robots` noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai + `googlebot` noindex — keep them. No robots.txt (it would have to live at the domain root, which is not this repo, and blocking crawl would hide the noindex). Claude artifact = v13 (same files).
- Git: PUBLIC repo (made public 2026-11-12 at Yael's request; she chose to keep it public even though the repo itself can be indexed) https://github.com/Yael-Issacharov/mediator (main, first commit afb217a, 38 files incl. `.dev/` fixtures). Owner is Yael-Issacharov: `gh auth switch --hostname github.com --user Yael-Issacharov` before pushing, then switch back to yaeli-byte.
- **Notion design language is the MAIN design (2026-11-12, Yael):** `index.html` loads `notion.css` after `styles.css` (Inter font link removed; system stack). Design language only, no Notion logo or name. Colours read from Notion's own CSS variables on a live public page (light + dark): text #2c2c2b / #7d7a75, sidebar #f9f8f7, borders #e6e5e3, action blue #2383e2; tag colours blue/orange/green/yellow/purple/red = A/B/Observation/Hypothesis/Unknown/bad. Idioms: 40px bold page title, select-tag chips, callout banners, quote-block evidence, inline-code turn ids, database tables. The old grey wireframe = `styles.css` alone (git history before this commit). Live on artifact v16 and GitHub Pages.
- **QA pass 2026-11-12 (local :4520, both designs):** TESTING.md B checks 1-9 all pass, driven in the browser:
  - Profile v1→v2 with +/− diff; Compare 10 dimensions, no score; paste → 5 turns, Dana/Omer auto-mapped to A/B; DOCX → 6 turns Noa/Tal.
  - s1 run (recorded live replies through the real pipeline): Key points 4, 6 sections, 3 findings, 5/5 quotes verified, quote click highlights T02.
  - Approve / Correct / Reject + header counts; outdated-profile banner → rerun adds a 2nd run; simulated failure → Retry + exact demo label, nothing saved.
  - 375px text-clip probe (canary-checked) 0 clipped on 7 pages × 2 designs; dark + phone looked at; 0 console errors.
  - **Bug found + fixed (v15):** participant subtitle was fixed seed text and contradicted the profile after an assessment change; now `headlineOf()` derives it from the q2 answer (home + participants).
  - Not testable locally: a real live AI call (only in the Claude app).
- Next: the prototype is demo-ready. Only open choice: a name.

## Source of truth
- `SPEC.md` is the Master Product & Development Specification, saved verbatim from Yael's paste of 2026-11-11 (47 KB).
  PLAN.md references it by section number (§). Read only the sections a task needs.
- `PLAN.md` holds the approved architecture once approved. Do not reopen decisions in it without a concrete reason.

## Conventions
- Visual design: Notion's design language (`notion.css`), chosen by Yael 2026-11-12, replacing the spec §15 grayscale wireframe. Colour still carries meaning only: participants A/B, categories, O/H/U, validation states. Never add the Notion logo or name.
- Fallback content always carries the exact banner "Demo Example — Not Generated by Live AI".
- Live AI only works on the published artifact. Local preview (:4520) exercises the fallback path.
