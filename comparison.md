# Framework Comparison — Limitations for AI Game Generation

Context: we generate web games by handing a spec to an AI agent (Claude Code / opencode / local LLMs) and letting it build from a reference codebase. The question is **not** "which engine is best in absolute terms," but **which engine an LLM agent can reliably author, wire up, and validate with minimal human cleanup** — specifically for publishing to Yandex Games (web build, SDK + Metrika, required screens, i18n, store assets).

Below are the **hard limitations** of each option as observed in our generation pipeline.

---

## React JS

A UI library, not a game engine. The agent treats the game as a DOM/component tree, which breaks down fast.

**Limitations**
- **Responsive UI needs heavy manual rework after generation.** The agent produces layouts that look fine at one viewport and break at others. Game UI (HUDs, overlays, fit-to-screen canvas, safe areas) is not something React generates correctly out of the box — orientation locking, aspect-ratio scaling, and mobile touch targets all require hand-tuning after every generation.
- **No 3D.** React has no native rendering pipeline for 3D. Anything beyond flat DOM/SVG/CSS requires bolting on a separate renderer (Three.js / react-three-fiber), at which point React is just a wrapper and the agent has to reason about two paradigms at once.
- **Elaborate game mechanics are hard to integrate.** React's render-on-state-change model fights real-time game loops. Frame-by-frame updates, physics, collision, particle systems, and animation timelines don't map onto `useState`/`useEffect`; the agent either re-renders far too often (poor performance) or smuggles a manual loop into a ref, producing fragile, hard-to-extend code.
- **No built-in game primitives.** No scene graph, no sprite/tilemap/atlas support, no asset pipeline, no input manager, no audio mixer, no physics. The agent has to reinvent each of these per game, so mechanics don't compose and reuse across generations.
- **Performance ceiling.** The reconciliation/virtual-DOM overhead makes anything with many moving entities janky; the agent has no good lever to fix this within the React model.

**Best fit:** simple, static, 2D, UI-driven games (puzzles, card/board, quiz, idle/clicker). **Avoid for:** action, physics, anything real-time or 3D.

---

## Unity

A full professional engine — but most of its authoring surface lives in the **Editor GUI and binary asset files**, which is exactly where an LLM agent is weakest.

**Limitations**
- **MCP configuration is difficult and fragile.** Driving the Unity Editor from an agent requires an MCP bridge that is awkward to set up and brittle to keep running; the connection, editor state, and project version all have to line up, and breakage is common.
- **The agent doesn't understand Unity-specific concepts well.** Prefabs, the component/GameObject model, the inspector, serialized fields, ScriptableObjects, scenes, and the meta-file/GUID system are largely invisible to an LLM working from text. It can write C# `MonoBehaviour` code, but it cannot reliably *wire scenes, build prefabs, set serialized references, or configure the inspector* — so a large share of the work stays manual.
- **Game UI is especially painful.** Unity UI (uGUI / UI Toolkit) is configured visually via the Canvas, RectTransforms, anchors, and layout groups. The agent can't author this from text effectively, so screens, HUDs, and menus need heavy hand-building — the single biggest manual cost in our pipeline.
- **Scene and asset state isn't text-editable in practice.** Scenes, prefabs, and asset settings are serialized YAML/binary tied to GUIDs. Edits the agent "writes" can corrupt references; round-tripping through the Editor is mandatory, which defeats unattended generation.
- **Heavy, slow loop.** Editor import, compilation, and WebGL builds are slow and resource-hungry, making iterate-validate cycles expensive — bad for an automated generate-and-check flow.
- **WebGL/Yandex friction.** Large build output, slow load times, and extra work to integrate the Yandex SDK + Metrika cleanly into a WebGL build. Mobile-web performance of Unity WebGL is a known weak spot.

**Best fit:** ambitious 3D/2D games where a human stays in the loop. **Avoid for:** hands-off, fully-agent-driven generation, and anything where most value is in UI.

---

## Phaser

A dedicated 2D web game framework — the most **LLM-friendly** option here, but firmly 2D.

**Limitations**
- **2D only.** No native 3D pipeline. Out of scope for any game that needs real depth/3D rendering.
- **Code-only, well-documented API.** This is a strength for agents (everything is text, no GUI to drive), but it also means the agent must know the API well; obscure features, plugin ecosystems, and version differences (Phaser 3 vs newer) can trip up local/smaller LLMs.
- **No visual scene/level editor in the loop.** Level design, tilemaps, and physics bodies are authored in code or external tools (e.g. Tiled). For complex levels the agent produces verbose, error-prone setup code, and asset/atlas wiring still needs care.
- **Responsive scaling needs explicit configuration.** The Scale Manager handles fit/resize, but the agent must configure it correctly for orientation, safe areas, and mobile — not automatic, though far simpler than React.
- **Manual integration work remains.** Yandex SDK, Metrika events, i18n, required screens, and asset loading are all hand-wired (no platform module), but because it's all code, the agent does this far more reliably than in Unity.

**Best fit:** 2D web games for Yandex — arcade, platformers, puzzles, casual action. The **default choice for agent-driven 2D generation.**

---

## Babylon JS

A powerful web-native 3D engine — the realistic answer for **3D in the browser**, but 3D itself is the limiting factor for an LLM.

**Limitations**
- **3D is conceptually hard for an agent to author blind.** Without a viewport, the LLM reasons about cameras, meshes, materials, lighting, transforms, and spatial relationships purely from coordinates. Scenes are easy to get subtly wrong (objects off-camera, bad lighting, mis-scaled meshes) and hard to validate automatically.
- **Asset pipeline dependency.** Real 3D games need models, rigs, animations, and textures (glTF, etc.) that the AI cannot generate — only reference and load. This breaks the "generate the whole game from a spec" premise; 3D content has to come from elsewhere.
- **Steeper, larger API.** Babylon's surface (scene graph, materials/PBR, physics plugins, animation, GUI) is large; smaller/local LLMs are more likely to hallucinate APIs or use outdated patterns than with Phaser's smaller 2D surface.
- **3D UI is awkward.** Babylon GUI (fullscreen/in-world) is its own system the agent must learn; building responsive HUDs/menus is more work than 2D DOM/Phaser UI.
- **Performance and size on mobile web.** 3D scenes are heavier to load and run; tuning for low-end mobile (the Yandex audience) requires care the agent doesn't apply automatically.
- **Validation is hard.** Unlike 2D, "is the scene correct?" can't be cheaply checked from text/output — visual/manual verification is usually needed, which hurts the automated checklist flow.

**Best fit:** 3D web games where 3D is genuinely required and a human curates assets/scenes. **Avoid for:** fully unattended generation and anything that could ship as 2D.

---

## Summary

| | React JS | Unity | Phaser | Babylon JS |
|---|---|---|---|---|
| **Dimension** | 2D (DOM) | 2D + 3D | 2D | 3D (+2D) |
| **Agent-authorable (text-only)** | Partial | Poor | **Strong** | Moderate |
| **Editor/GUI dependency** | None | **High (blocks automation)** | None | None |
| **Game-loop / mechanics fit** | Poor | Strong (manual) | **Strong** | Strong |
| **Responsive game UI after gen** | Heavy rework | Heavy manual build | Minor config | Moderate |
| **Asset generation self-contained** | Yes | Partial | Yes | **No (needs 3D assets)** |
| **Auto-validation feasibility** | Good | Hard | **Good** | Hard |
| **Yandex WebGL/SDK fit** | Good | Friction (heavy build) | **Good** | Moderate (heavy) |
| **Best for** | Simple 2D/UI games | 3D w/ human in loop | **2D web (default)** | 3D when required |

**Bottom line for AI-driven generation:**
- **Phaser** is the strongest fit — everything is text, the agent authors and wires reliably, and validation is cheap. Default for 2D.
- **React** works only for simple, static, UI-style 2D games; real mechanics, responsiveness, and 3D all cost too much manual cleanup.
- **Babylon** is the answer when 3D is mandatory, but 3D breaks the "fully self-contained, auto-validated generation" model (external assets, hard-to-verify scenes).
- **Unity** is the most capable engine but the worst fit for hands-off agent generation: the Editor/prefab/UI surface the LLM can't drive forces too much manual work to justify in an automated pipeline.
