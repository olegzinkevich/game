# Yandex Game Validator — Presentation Slides

---

## Slide 1 — Requirements Validator

**Tagline:** Automated source-code audit against the Yandex Games publishing checklist.

**The problem**
- Yandex has a long, strict publishing checklist (framework rules, no inline CSS, non-skippable onboarding, How-to-Play screens, localStorage state, Metrika events on every action, SDK init…).
- Validating it meant a reviewer **reading the whole codebase by hand** — slow, inconsistent, and easy to get wrong.
- Results were one-off and not reproducible.

**What we built**
- Point the tool at a game's source folder; it checks **every requirement** and returns a pass/fail verdict with reasons.   Include
- An **AI agent (Claude) reads the actual code** — Read/Glob/Grep — and *reasons* about each requirement, instead of brittle keyword matching. It can answer real questions like "is onboarding truly non-skippable?"
- Every verdict **cites the specific files** it checked → evidence, not opinion.

**Workflow**
1. The Yandex checklist is parsed into discrete, numbered requirements.
2. For each requirement, an agent is spawned in the game folder with read access.
3. It inspects the relevant files and returns a structured `{ passed, reason }` verdict.
4. The UI streams each result live — pass/fail cards, running count, final "X / N passed" summary.

**Why it matters:** multi-hour manual review → a few-minute, reproducible, evidence-backed audit.

---

## Slide 2 — Responsive Screenshot Testing

**Tagline:** Run the game across 50+ real device resolutions and capture every screen automatically.

**The problem**
- Layout had to be checked by hand, resizing the browser to dozens of phone/tablet/desktop sizes.
- Tedious and easy to skip → responsive bugs slipped through to release.

**What we built**
- Pick the screens to capture (Onboarding, How to Play, Level Select, Menu, Game canvas) and the resolutions — **50+ presets** grouped by device class (mobile portrait/landscape, tablet, desktop up to 4K / 3840×2160).
- **Playwright + headless Chromium** boots the game; the Yandex **SDK and Metrika are mocked**, so any game runs standalone without the real platform.
- Screenshots stream into a gallery grouped by screen and are saved to `responsive_design_test/`.

**Workflow**
1. For each resolution: open the game, wait until it's ready.
2. Drive it to each target screen via the game's navigation hook.
3. **Wait for the canvas to settle** — hash frames, detect non-uniform output — so captures aren't blank or mid-animation.
4. Capture the screenshot; live logs + progress stream to the UI.

**Why it matters:** exhaustive, consistent visual coverage that a human would never do by hand for every screen × every device.

---

### Both tracks share
One local Next.js app · live streaming progress/logs · stoppable mid-run · reproducible, shareable output.
