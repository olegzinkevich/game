# Tetris Game — Definition of Done

**Document type:** Acceptance Criteria / Definition of Done (DoD)
**Product:** Web-based Tetris game (browser, desktop + mobile)

## 1. Scope

**In scope**
1. Single-player, single-session web Tetris playable entirely in the browser with no install.
2. Standard Tetris core loop: spawn → move/rotate → soft/hard drop → lock → line clear → scoring/leveling → game over.
3. Keyboard controls (desktop) and touch controls (mobile), responsive layout, basic audio/visual feedback, pause/restart, and a score/level/lines HUD.
4. Reliable load and play on current evergreen browsers, desktop and mobile.


## 2. Functional Acceptance Criteria

### 2.1 Startup & lifecycle

| #     | Criterion                                                                                                                                                                                                                  |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1.1 | **Given** a supported browser, **When** the user opens the game URL, **Then** the game reaches an interactive state (menu or first piece) within **≤ 3 s**, with **zero uncaught exceptions** and **zero console errors**. |
| 2.1.2 | **Given** the start screen, **When** the user triggers Start, **Then** the first tetromino spawns at the top-center and the gravity timer begins.                                                                          |
| 2.1.3 | **When** the game is running, **Then** a continuous game loop advances state at a stable cadence (no stalls > 100 ms during normal play).                                                                                  |
| 2.1.4 | **Given** an active game, **When** the user pauses, **Then** the piece stops falling, input is ignored except resume, and the timer stops; **When** resumed, play continues from the identical state.                      |
| 2.1.5 | **Given** game over, **When** the user selects Restart, **Then** board, score, level, and lines reset to initial values and a fresh game begins.                                                                           |
| 2.1.6 | **When** the browser tab loses focus / is backgrounded, **Then** the game auto-pauses (or continues deterministically) without runaway timers or duplicated loops on refocus.                                              |

### 2.2 Tetromino spawning

| #     | Criterion                                                                                           |
| ----- | --------------------------------------------------------------------------------------------------- |
| 2.2.1 | All seven tetrominoes (I, O, T, S, Z, J, L) exist with correct shapes and standard colors.          |
| 2.2.2 | Pieces spawn at the standard top-center spawn position and orientation.                             |
| 2.2.3 | Spawn order follows the 7-bag randomizer (see 0.4); no piece is starved or duplicated within a bag. |
| 2.2.4 | A **Next** preview shows the upcoming piece(s) and matches the actual next spawn.                   |
| 2.2.5 | **Hold** swaps the active piece with the held piece, allowed once per piece until lock.             |

### 2.3 Movement, rotation, collision, locking

| #     | Criterion                                                                                                                                                                                                                                                   |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.3.1 | **When** Left/Right is pressed, **Then** the active piece moves exactly one column, **unless** blocked by a wall or stack (then no move).                                                                                                                   |
| 2.3.2 | Soft drop accelerates descent while held and awards soft-drop points; hard drop instantly drops the piece to its landing position and locks it.                                                                                                             |
| 2.3.3 | Rotation (Clock wise and Counter clock wise) rotates the piece about its standard pivot.                                                                                                                                                                    |
| 2.3.4 | **Wall kicks (SRS - Super Rotation System):** **Given** a rotation that would collide with a wall, floor, or stack, **When** rotated, **Then** the piece is offset per the SRS kick table to a valid position if one exists, else the rotation is rejected. |
| 2.3.5 | **Collision integrity:** at no point may any active-piece cell overlap an occupied cell or exit the playfield bounds (left/right/bottom).                                                                                                                   |
| 2.3.6 | A piece **locks** when it cannot move further down (rests on floor or stack). After lock, its cells become part of the board and a new piece spawns.                                                                                                        |
| 2.3.7 | **Lock delay:** a landed piece has a brief, bounded lock delay (e.g. ~500 ms) during which movement/rotation can still occur; lock delay does not allow indefinite stalling (bounded reset count).                                                          |
| 2.3.8 | **Ghost piece** indicates the hard-drop landing column/position and matches the actual landing.                                                                                                                                                             |

### 2.4 Line clearing

| #     | Criterion                                                                                       | Scenario                                                                                                                                                                 |
| ----- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2.4.1 | Single clear                                                                                    | **Given** exactly one fully-filled row, **When** the piece locks, **Then** that row clears, rows above shift down by one, and score increases per the single-line value. |
| 2.4.2 | Double clear                                                                                    | Two simultaneous full rows clear together; scoring uses the double-line value (> 2× single).                                                                             |
| 2.4.3 | Triple clear                                                                                    | Three simultaneous full rows clear; scoring uses the triple value.                                                                                                       |
| 2.4.4 | Tetris (quad)                                                                                   | Four simultaneous full rows clear; scoring uses the Tetris value (highest per-line reward).                                                                              |
| 2.4.5 | Non-contiguous clears                                                                           | **Given** filled rows separated by partial rows, **When** they clear, **Then** only filled rows are removed and remaining blocks fall correctly to preserve gaps.        |
| 2.4.6 | No false clear                                                                                  | A row with any empty cell never clears.                                                                                                                                  |


### 2.5 Score, level, and progression

| #     | Criterion                                                                                                                       |
| ----- | ------------------------------------------------------------------------------------------------------------------------------- |
| 2.5.1 | Score is monotonic non-decreasing during play and never goes negative.                                                          |
| 2.5.2 | Line-clear scoring scales with the number of lines cleared in one lock (1 < 2 < 3 < 4 per-line reward), and with current level. |
| 2.5.3 | `linesCleared` increments by exactly the number of rows cleared per lock.                                                       |
| 2.5.4 | Level increases according to a defined rule (e.g. every 10 lines), and gravity speed increases with level.                      |
| 2.5.5 | Soft drop and hard drop award points per the published scoring table.                                                           |
| 2.5.7 | High score persists across reloads via `localStorage` and survives a refresh.                                                   |

### 2.6 Game over

| #     | Criterion                                                                                                                                                         |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.6.1 | **Given** a newly spawned piece that immediately collides with the existing stack (block-out), **Then** `status` becomes `'gameover'` and the gravity loop stops. |
| 2.6.2 | A clear game-over screen appears showing final score and a Restart action button.                                                                                 |
| 2.6.3 | After game over, gameplay input no longer mutates the board (no zombie movement).                                                                                 |
| 2.6.4 | No new piece spawns after game over until Restart.                                                                                                                |

---

## 3. Gameplay Rules (canonical reference)


1. **Playfield:** 10 columns × 20 visible rows; spawn occurs in hidden rows above the visible field.
2. **Randomizer:** 7-bag — each bag is a shuffled permutation of the 7 tetrominoes.
3. **Rotation system:** SRS, including wall-kick offset tables; 4 rotation states per piece.
4. **Gravity:** pieces fall at a level-dependent rate; soft drop multiplies fall speed; hard drop is instantaneous.
5. **Locking:** occurs on inability to descend, subject to bounded lock delay; **top-out** ends the game.
6. **Line clear:** any fully occupied row is removed; rows above shift down; multiple simultaneous clears resolve in a single step.
7. **Scoring baseline (Guideline):** Single = 100×level, Double = 300×level, Triple = 500×level, Tetris = 800×level; soft drop = 1/cell, hard drop = 2/cell. *(If different values are used, they must be documented here and matched by tests.)*
8. **Leveling:** +1 level per 10 lines cleared (or documented alternative).


---

## 4. UI / UX Criteria

### 4.1 Controls

| Action            | Keyboard (desktop) | Touch (mobile)                       |
| ----------------- | ------------------ | ------------------------------------ |
| Move left / right | ← / →              | Swipe or tap L/R / on-screen buttons |
| Soft drop         | ↓                  | Swipe down / button                  |
| Hard drop         | Space              | Swipe up (fast) / button             |
| Rotate CW / CCW   | ↑ or X / Z or Ctrl | Tap / dedicated buttons              |
| Hold              | C / Shift          | Button                               |
| Pause             | Esc or P           | Button                               |

| #     | Criterion                                                                                                                                                                                 |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1.1 | All Must-have controls (move, rotate, soft drop, hard drop, pause, restart) work on keyboard.                                                                                             |
| 4.1.2 | Input latency from keypress to visible response is **≤ 100 ms** under normal load.                                                                                                        |
| 4.1.3 | **DAS** (Delayed Auto Shift) and **ARR** (Auto Repeat Rate):** holding left/right produces an initial delay then auto-repeat at a steady, tunable rate (no single-step-only, no runaway). |
| 4.1.4 | Key repeat does not cause missed or doubled inputs; simultaneous keys resolve deterministically.                                                                                          |
| 4.1.5 | On touch devices, all Must-have actions are reachable; touch targets are **≥ 44×44 px**.                                                                                                  |
| 4.1.6 | Browser default behaviors are suppressed during play (arrow/space do not scroll the page; gestures do not zoom).                                                                          |

### 4.2 HUD & feedback

| #     | Criterion                                                                                               |
| ----- | ------------------------------------------------------------------------------------------------------- |
| 4.2.1 | Score, level, and lines-cleared are always visible during play and update immediately on change.        |
| 4.2.2 | Next-piece preview is visible and accurate.                                                             |
| 4.2.3 | Active piece, ghost, and locked cells are visually distinguishable; standard per-piece colors are used. |
| 4.2.4 | Line clears and game over have clear visual feedback (flash/animation/screen).                          |

### 4.3 Responsiveness & layout

| #     | Criterion                                                                                                             |
| ----- | --------------------------------------------------------------------------------------------------------------------- |
| 4.4.1 | Layout adapts without overflow/clipping from **320 px** wide up to large desktop; portrait and landscape both usable. |
| 4.4.2 | The playfield maintains correct aspect ratio and remains fully visible at all supported sizes (no off-screen rows).   |
| 4.4.3 | No layout shift after load (CLS ≈ 0); no horizontal scrollbar during play.                                            |

---

## 5. Browser / Platform Compatibility

| #   | Criterion                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------ |
| 5.1 | Fully playable on latest **Chrome, Firefox, Safari, Edge** (desktop).                                                    |
| 5.2 | Fully playable on latest mobile **Safari (iOS)** and **Chrome (Android)**.                                               |
| 5.3 | Functions on the last **2 major versions** of each supported browser.                                                    |
| 5.4 | No dependency on experimental/flagged APIs; graceful fallback if an optional API (e.g. audio, vibration) is unavailable. |
| 5.5 | Works over plain HTTPS with no server-side runtime dependency (static hosting compatible).                               |
| 5.6 | Renders correctly at common device pixel ratios (1×, 2×, 3×) — crisp, not blurry on Retina/HiDPI.                        |

---

## 6. Accessibility

| #   | Criterion                                                                                                                         |
| --- | --------------------------------------------------------------------------------------------------------------------------------- |
| 6.1 | All interactive menu controls are keyboard-reachable and operable (tab order, Enter/Space activation), with visible focus states. |
| 6.2 | Color is never the *only* signal for critical info; game state distinguishable by shape/text/position.                            |
| 6.3 | Text and UI meet **WCAG AA** contrast (≥ 4.5:1 for normal text).                                                                  |
| 6.4 | Interactive elements have accessible names/labels; canvas has a meaningful `aria-label`/role and the game is announced.           |
| 6.5 | Respects `prefers-reduced-motion` (reduces non-essential animation/flashing); no content flashes > 3×/sec.                        |


---

## 7. Performance

| #   | Criterion                                                                            | Target                                                                |
| --- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| 7.1 | Frame rate during active play                                                        | **≥ 60 FPS** desktop; **≥ 30 FPS** low-end mobile, no sustained drops |
| 7.2 | Input-to-response latency                                                            | **≤ 100 ms**                                                          |
| 7.3 | Initial load (time-to-interactive)                                                   | **≤ 3 s** broadband mid-tier; **≤ 5 s** on throttled "Fast 3G"        |
| 7.4 | Total initial bundle size (gzipped)                                                  | **≤ 2 MB** (target ≤ 500 KB JS)                                       |
| 7.5 | No memory growth over a sustained 10-minute session (no leak; stable heap after GC). |                                                                       |
| 7.6 | No long tasks > 50 ms on the main thread during steady-state play.                   |                                                                       |
| 7.7 | Lighthouse Performance score                                                         |                                                                       |

---

## 8. Error Handling & Resilience (Edge Cases)

| #    | Scenario                                                     | Expected behavior                                                                                        |
| ---- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| 8.1  | **Rapid input spam** — many keys/taps within one frame       | No crash, no illegal state, no double-move per intent; collision invariants hold.                        |
| 8.2  | **Simultaneous rotate + move + drop**                        | Resolves deterministically; piece never overlaps or escapes bounds.                                      |
| 8.3  | **Rotate against wall/floor/stack with no valid kick**       | Rotation rejected; state unchanged; no crash.                                                            |
| 8.4  | **Hard drop into a full/near-full column**                   | Locks correctly at the top; may legitimately trigger game over (block-out), not a crash.                 |
| 8.5  | **Window resize / orientation change mid-game**              | Game continues, board re-fits, state preserved, no input loss.                                           |
| 8.6  | **Tab background then refocus**                              | Single game loop resumes (no duplicate loops, no time-skip avalanche of pieces).                         |
| 8.7  | **localStorage unavailable / quota exceeded** (private mode) | High score / settings features degrade gracefully; game still playable.                                  |
| 8.8  | **Corrupt / invalid persisted data**                         | Loader validates and falls back to defaults; no crash.                                                   |
| 8.9  | **Very long session / very high score**                      | No integer overflow, no UI breakage from large numbers, no FPS decay.                                    |
| 8.10 | **Unhandled error path**                                     | Errors are caught and surfaced gracefully (no white screen of death); no infinite error loop in console. |
| 8.11 | **Game-over board fully stacked**                            | Detected as game over, not a frozen/hung loop.                                                           |

---
