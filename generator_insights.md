# Yandex Game Generator — Presentation Slide

**Tagline:** Set parameters, click "Generate" — the tool produces store assets, builds the game from auto-generated requirements, and validates it against the Yandex platform — all in one flow.

**The problem**
- Launching a  game means producing a lot of artifacts by hand: title variants, catalog description, SEO/keywords, "How to play" text, icons (logo + maskable), a cover image, localizations, onboarding screens — *and then* writing the game code so it meets Yandex's technical rules (SDK, Metrika events, screens, i18n).
- Each piece is a separate manual task, done inconsistently, and the developer only finds out late whether the code actually satisfies the platform requirements.

**What we built**
- A single app where the developer **sets the game's parameters** — concept/description, category, orientation, target platforms, framework, Metrika counter ID, localizations, reference screenshots, reference code path, testing-checklist path.
- The tool **auto-generates all store assets**: titles, catalog description, keywords/SEO, how-to-play and onboarding text (translated per locale), plus **icons and cover images**.
- One **"Generate"** click then **exports a complete spec (`GAME_SPEC.md`)** for the new game and **launches a Claude Code agent in the background** that builds the game from that spec and the reference codebase.
- **In parallel, validation runs against the Yandex Games requirements** (the testing checklist as reference) — confirming the necessary code elements are actually implemented: **Yandex SDK wired up, Metrika events on each action, required screens, i18n, assets in place.**уцз

**Workflow**
1. Developer fills in parameters and generates/reviews the assets and texts.
2. Click **Generate** → the app assembles `GAME_SPEC.md` (title, description, assets, localizations, onboarding, **+ embedded "Instructions for Claude"** and a pointer to the Yandex testing checklist) and copies the icons/cover/screenshots into the game's `public/` folder.
3. A **background Claude Code agent** reads the spec and edits the reference codebase to match it — wiring the SDK, Metrika, screens, localization, and assets.
4. **Validation against the platform checklist runs alongside**, checking that SDK/events and other mandatory elements are present.
5. The UI **streams the agent's live output** (assistant text + tool calls); the developer can **reply mid-run to steer it** or stop the session.

**Why it matters:** from a few parameters to a near-publishable game + full store-listing kit in one pass — with platform compliance checked as it's built, not discovered after the fact.
