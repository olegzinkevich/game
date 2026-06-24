# Inverted Tetris Game

**Document type:** Acceptance Criteria / Definition of Done (DoD)
**Product:** Web-based **inverted** Tetris game (browser, desktop + mobile)
**Genre:** Puzzle / Rising blocks

**The key rule:** Figures **rise from the bottom upward** and are composed of **exactly three
cells**. Collect horizontal lines from the rising shapes so that they disappear, preventing the
blocks from reaching the top of the field.

## 1. Scope

- Single-player, single-session web Inverted Tetris game, playable entirely in the browser with no install.
- Inverted core loop: spawn at bottom → move/rotate → soft/hard rise → lock → line clear → scoring/leveling → game over.
- Keyboard controls (desktop) and touch controls (mobile), responsive layout, basic audio/visual feedback, pause/restart, and a score/level/lines HUD.
- Reliable load and play on current evergreen browsers, desktop and mobile.

## 2. General game cycle

### 2.1 Spawn a new figure:
- The figure spawns at the **bottom-center** of the field.
- If the figure intersects with existing blocks after spawn (at the bottom spawn area), the game ends (Game Over).

### 2.2 While the figure is rising:
- Process player input.
- Rise tick: Every N milliseconds (depends on the speed level), the figure moves up 1 square. If a shift upward is not possible, the figure "freezes" (becomes part of the field).

### 2.3 After freezing:
- Check the filled lines (all 15 cells in the row are not empty). Remove such lines and settle the remaining rows upward.
- Earn points (see the table).
- Increase the game speed after a certain number of lines.
- Spawn of the next figure (continuation of the cycle).

## 3. Functional Acceptance Criteria

### 3.1 Game Field (Grid)
**Size:** 15 cells wide × 35 cells high.
Each cell can be either **empty** or **filled** (with a specific color/shape type).
The visible area is the entire field.

### 3.2 Figures

4 shapes, each composed of **exactly three cells**. Coordinates are `(col, row)` with `row 0` at
the **top** of the figure's bounding box, in the figure's standard (spawn) orientation:

- **I** — cyan `#30b5c5` — vertical line of three cells: `(0,0)(0,1)(0,2)` — width 1, height 3
- **P** — red `#c00000` — `(1,0)(0,1)(0,2)` — width 2, height 3
- **L** — orange `#ED6D00` — `(0,0)(0,1)(1,2)` — width 2, height 3
- **C** — green `#a0d183` — a 2×2 box missing the top-right cell: `(0,0)(0,1)(1,1)` — width 2, height 2

Each shape consists of 3 squares. Exactly these four figures exist and no more.

The shapes appear at the **bottom** of the field, centered horizontally for the figure width.
Starting position: X = floor(fieldWidth/2) - floor(pieceWidth/2), placed at the bottom in standard orientation.

### 3.3. Default configuration

- The base rise interval is 500 ms.
- The minimum interval is 50 ms.
- 10 lines to level up
- Field width = 15 cells
- Field height = 35 cells

### 3.4 Startup & lifecycle

| # | Criterion |
|---|-----------|
| 3.4.1 | Given a supported browser, When the user opens the game URL, Then the game reaches an interactive state (menu or first figure) within ≤ 3 s, with zero uncaught exceptions and zero console errors. |
| 3.4.2 | Given the start screen, When the user triggers Start, Then the first figure spawns at the bottom-center and the rise timer begins. |
| 3.4.3 | When the game is running, Then a continuous game loop advances state at a stable cadence (no stalls > 100 ms. during normal play). |
| 3.4.4 | Given an active game, When the user pauses, Then the figure stops rising, input is ignored except resume, and the timer stops; When resumed, play continues from the identical state. |
| 3.4.5 | Given game over, When the user selects Restart, Then board, score, level, and lines reset to initial values and a fresh game begins. |
| 3.4.6 | When the browser tab loses focus / is backgrounded, Then the game auto-pauses (or continues deterministically) without runaway timers or duplicated loops on refocus. |

### 3.5 Figure spawning

| # | Criterion |
|---|-----------|
| 3.5.1 | All four figures (I, P, L, C) exist with correct three-cell shapes and assigned colors. |
| 3.5.2 | Figures spawn at the standard bottom-center spawn position and orientation. |
| 3.5.3 | Spawn order follows the 4-bag randomizer; no figure is starved or duplicated within a bag. |
| 3.5.4 | A Next preview shows the upcoming figure(s) and matches the actual next spawn. |
| 3.5.5 | Hold swaps the active figure with the held figure, allowed once per figure until lock. |

### 3.6 Movement, rotation, collision, locking

| # | Criterion |
|---|-----------|
| 3.6.1 | When Left/Right is pressed, Then the active figure moves exactly one column (1 square), unless blocked by a wall or stack (then no move). It does not go beyond the boundaries of the field or intersect with other blocks. |
| 3.6.2 | If Up is pressed – the rise is accelerated by 1 square. A constant rise occurs automatically every game tick, moving the figure upward. |
| 3.6.3 | Soft rise accelerates ascent while held and awards soft-rise points; hard rise instantly moves the figure to its topmost landing position and locks it. |
| 3.6.4 | Hard rise – the instantaneous rise of a figure until the first collision with the top wall or blocks. |
| 3.6.5 | Rotation (Clockwise and Counter-clockwise) rotates the figure about its standard pivot. Rotation is the rotation of a shape by 90° (relative to the center of the shape). Use a rotation matrix or predefined states. Check for collisions with borders and blocks – if rotation is not possible, do not perform. |
| 3.6.6 | Wall kicks: Given a rotation that would collide with a wall, the top, or the stack, When rotated, Then the figure is offset per a kick table appropriate for three-cell figures to a valid position if one exists, else the rotation is rejected. |
| 3.6.7 | Collision integrity: at no point may any active-figure cell overlap an occupied cell or exit the playfield bounds (left/right/top). |
| 3.6.8 | A figure locks when it cannot move further up (rests against the top wall or the underside of the stack). After lock, its cells become part of the board and a new figure spawns. |
| 3.6.9 | Lock delay: a figure that has reached its resting position has a brief, bounded lock delay (e.g. ~500 ms) during which movement/rotation of this block can still occur; lock delay does not allow indefinite stalling. |
| 3.6.10 | Ghost figure indicates the hard-rise landing position and matches the actual landing. |

### 3.7 Line clearing

| # | Criterion | Scenario |
|---|-----------|----------|
| 3.7.1 | Single clear | Given exactly one fully-filled row, When the figure locks, Then that row clears. Rows positioned below shift up by one, and score increases per the single-line value. |
| 3.7.2 | Double clear | Two simultaneous full rows clear together; scoring uses the double-line value (> 2× single). |
| 3.7.3 | Triple clear | Three simultaneous full rows clear; scoring uses the triple value. |
| 3.7.4 | Maximum three rows | Because a figure occupies cells in at most three rows, no single lock can clear more than three rows. Four-line "Tetris" clears are not possible in this variant. |
| 3.7.5 | Non-contiguous clears | Given filled rows separated by partial rows, When they clear, Then only filled rows are removed and remaining blocks settle upward correctly to preserve gaps. |
| 3.7.6 | No false clear | A row with any empty cell never clears. |

### 3.8 Score, level, and progression

**Scoring system:**
Lines at a time points (classic scale, adapted — maximum three rows):
- 1, 100 × level
- 2, 300 × level
- 3, 500 × level

(No four-line award exists; see 3.7.4.)

The level starts at 0 or 1. The rise rate (delay between ticks) = base value / (level + 1) or according to the formula: max(50, 500 / (level+1)) ms. The level increases every 10 lines collected.

| # | Criterion |
|---|-----------|
| 3.8.1 | Score is monotonic non-decreasing during play and never goes negative. |
| 3.8.2 | Line-clear scoring scales with the number of lines cleared in one lock (1 < 2 < 3 per-line reward), and with current level. |
| 3.8.3 | `linesCleared` increments by exactly the number of rows cleared per lock. |
| 3.8.4 | Level increases according to a defined rule (every 10 lines), and rise speed increases with level. |
| 3.8.5 | Soft rise and hard rise award points: Soft rise - 1 point for every cell the figure rises, Hard rise - 2 points for every cell the figure rises. |
| 3.8.6 | High score persists across reloads via `localStorage` and survives a refresh. |

### 3.9 Game over

| # | Criterion |
|---|-----------|
| 3.9.1 | Given a newly spawned figure that immediately collides with the existing stack at the bottom spawn area (block-out), Then `status` becomes `'gameover'` and the rise loop stops. |
| 3.9.2 | A clear game-over screen appears showing final score and a Restart action button. |
| 3.9.3 | After game over, gameplay input no longer mutates the board (no zombie movement). |
| 3.9.4 | No new figure spawns after game over until Restart. |

### 3.10 Logic and Architecture

**3.10.1** The game cycle is based on a **timer** (setInterval / requestAnimationFrame with time check / Time.deltaTime).

**3.10.2** The state of the field is a two–dimensional array (15×35), where each cell contains:
- 0 – empty
- The color id (1..4) is the occupied cell.
- The current shape is an object with coordinates (x, y) and shape (matrix).
- The next figure is a selection from the 4 types (use a "Random Generator" with a fair distribution or a bag of 4 figures).

**3.10.3 Collision handling**
- The collision(shape, offsetX, offsetY) function checks the intersection with the boundaries of the field (x < 0 or x+width > 15, y < 0 at the top, y+height beyond the bottom entry) or with non-empty cells of the field.

**3.10.4 Deleting lines**
- Going through the rows, if a row is completely filled, delete it, and settle all remaining blocks upward by 1.

**3.10.5 Random numbers**
- Use the bag generator of 4 shapes to avoid long series of identical shapes. After emptying the bag, a new bag is added.

### 3.11 Recommendations for implementation under different pipelines

**3.11.1 Unity (C#)**
- Use GameObject for a field (Tilemap) or a simple UI Image.
- Timer – InvokeRepeating or Coroutine with yield return new WaitForSeconds(...) + change the interval dynamically.
- Input via Input.GetKeyDown in the Update.
- Separate scripts: GameManager, Spawner, Grid, Figure.
- Rendering: A grid of sprites with colors.

**3.11.2 Phaser (JavaScript, version 3)**
- The Phaser scene, use this.time.addEvent for the rise.
- Key handling via this.input.keyboard.
- Drawing via the Graphics API or TileSprite.
- Store the field matrix in a regular array, and redraw each frame or event (it's easier to redraw the entire grid with each change).
- Line removal animations are performed using timers or Tween.

**3.11.3 React (without additional game engines)**
- Use React + Canvas (the most productive for rendering the game loop).
- Store the game state in hooks (useState, useRef for timer).
- Rendering the field on each frame via canvas.getContext('2d').
- Game loop – useEffect with requestAnimationFrame (for smooth animation) or setInterval for ticks.
- Key handling – useEffect with window.addEventListener.
- For Next, Score, and Level, there are separate React components that receive props.
- Important: do not redraw the React tree with each tick, just the Canvas. Use useRef for canvas and the update function.

The approximate structure of the components:
- TetrisGame is the main component that holds the state.
- TetrisCanvas is responsible for rendering the field and the current shape.
- SidePanel – shows the score, lines, level, and next shape.

### 3.12 Browser / Platform Compatibility

| # | Criterion |
|---|-----------|
| 3.12.1 | Fully playable on latest Chrome, Firefox, Safari, Edge (desktop). |
| 3.12.2 | Fully playable on latest mobile Safari (iOS) and Chrome (Android). |
| 3.12.3 | Functions on the last 2 major versions of each supported browser. |
| 3.12.4 | No dependency on experimental/flagged APIs; graceful fallback if an optional API (e.g. audio, vibration) is unavailable. |
| 3.12.5 | Works over plain HTTPS with no server-side runtime dependency (static hosting compatible). |
| 3.12.6 | Renders correctly at common device pixel ratios (1×, 2×, 3×) — crisp, not blurry on Retina/HiDPI. |

## 4. Gameplay Rules

- **Playfield:** 15 columns × 35 visible rows; spawn occurs at the bottom-center of the field.
- **Randomizer:** 4-bag — each bag is a shuffled permutation of the 4 figures (I, P, L, C).
- **Rotation system:** 90° rotation about the standard pivot, including wall-kick offset tables appropriate for three-cell figures.
- **Inverted gravity:** figures rise upward at a level-dependent rate; soft rise multiplies rise speed; hard rise is instantaneous. The stack grows from the top downward.
- **Locking:** occurs on inability to ascend (against the top wall or the underside of the stack), subject to bounded lock delay; **block-out** at the bottom spawn area ends the game.
- **Line clear:** any fully occupied row is removed; remaining blocks settle upward; multiple simultaneous clears (up to three) resolve in a single step.
- **Leveling:** +1 level per 10 lines cleared

## 5. UI / UX Criteria

### 5.1 Controls

| # | Action | Keyboard (desktop) | Touch (mobile) |
|---|--------|--------------------|----------------|
| 5.1.1 | Move left / right | ← / → | Swipe or tap L/R and on-screen buttons |
| 5.1.2 | Soft rise | ↑ | Swipe up and button |
| 5.1.3 | Hard rise | Space | button |
| 5.1.4 | Rotate CW / CCW | X / Z or Ctrl | Tap and dedicated buttons |
| 5.1.5 | Hold | C / Shift | Button |
| 5.1.6 | Pause | Esc or P | Button |
| 5.1.7 | Restart the game | R | Button |

### 5.2 Additional controls requirements:

| # | Criterion |
|---|-----------|
| 5.2.1 | All Must-have controls (move, rotate, soft rise, hard rise, pause, restart) work on keyboard. |
| 5.2.2 | Input latency from keypress to visible response is ≤ 100 ms under normal load. |
| 5.2.3 | Key repeat does not cause missed or doubled inputs; simultaneous keys resolve deterministically. |
| 5.2.4 | On touch devices, all must-have actions are reachable; touch targets are ≥ 44×44 px. |
| 5.2.5 | Browser default behaviors are suppressed during play (arrow/space do not scroll the page; gestures do not zoom). |

### 5.3 Screen design

**Main Screen** (positioned at Right or left) have these areas:
- Current Score
- Level
- Number of lines assembled (Lines)
- The "Next" window (showing the next shape)
- The "New Game" / "Restart" button
- Game Over indicator (dimming and text "Game Over" + restart button)

### 5.4 Visual style (recommendations)

- The cells can be square, with or without a thin border.
- Each shape has its own color (I = cyan, P = red, L = orange, C = green).
- For frozen blocks – the same color, but possibly with a slightly darkened texture.
- Animations: flash or short delay when deleting lines; the "shake" effect is optional.

### 5.5 HUD & feedback

| # | Criterion |
|---|-----------|
| 5.5.1 | Score, level, and lines-cleared are always visible during play and update immediately on change. |
| 5.5.2 | Next-figure preview is visible and accurate. Exists a small window where the next shape is shown. You can store a queue of 1 figure (or more for advanced mode). |
| 5.5.3 | Active figure, ghost, and locked cells are visually distinguishable; the per-figure colors are used. |
| 5.5.4 | Line clears and game over have clear visual feedback (flash/animation/screen). |

### 5.6 Responsiveness & layout

| # | Criterion |
|---|-----------|
| 5.6.1 | Layout adapts without overflow/clipping from 320 px wide up to large desktop; portrait and landscape both usable. |
| 5.6.2 | The playfield maintains correct aspect ratio (15:35) and remains fully visible at all supported sizes (no off-screen rows). |
| 5.6.3 | No layout shift after load (CLS, Cumulative Layout Shift ≈ 0); no horizontal scrollbar during play. |

### 5.7 Sounds

- Movement/rotation activates a short "click" sound.
- When the figure is frozen appears the soft sound of landing.
- Deleting a line produces a pleasant chime.
- Three-line clear (the maximum) produces a brighter sound than a normal clear.
- Game Over produces low signal.

## 6. Accessibility

| # | Criterion |
|---|-----------|
| 6.1 | All interactive menu controls are keyboard-reachable and operable (tab order, Enter/Space activation), with visible focus states. |
| 6.2 | Color is never the *only* signal for critical info; game state is distinguishable by shape/text/position. |
| 6.3 | Text and UI meet **WCAG AA** contrast (≥ 4.5:1 for normal text). |
| 6.4 | Interactive elements have accessible names/labels; canvas has a meaningful `aria-label`/role and the game is announced. |
| 6.5 | Respects `prefers-reduced-motion` (reduces non-essential animation/flashing); no content flashes > 3×/sec. |

## 7. Performance

| # | Criterion | Target |
|---|-----------|--------|
| 7.1 | Frame rate during active play | ≥ 60 FPS desktop; ≥ 30 FPS low-end mobile, no sustained drops |
| 7.2 | Input-to-response latency | ≤ 100 ms |
| 7.3 | Initial load (time-to-interactive) | ≤ 3 s broadband mid-tier; ≤ 5 s on throttled "Fast 3G" |
| 7.4 | Total initial bundle size (gzipped) | ≤ 2 MB (target ≤ 500 KB JS) |
| 7.5 | No memory growth over a sustained 10-minute session (no leak; stable heap after GC). | |
| 7.6 | No long tasks > 50 ms. on the main thread during steady-state play. | |
| 7.7 | Lighthouse Performance score | |

## 8. Error handling & resilience (edge cases)

| # | Scenario | Expected behavior |
|---|----------|-------------------|
| 8.1 | Rapid input spam — many keys/taps within one frame | No crash, no illegal state, no double-move per intent; collision invariants hold. |
| 8.2 | Simultaneous rotate + move + rise | Resolves deterministically; figure never overlaps or escapes bounds. |
| 8.3 | Rotate against wall/top/stack with no valid kick | Rotation rejected; state unchanged; no crash. |
| 8.4 | Hard rise into a full/near-full column | Locks correctly at the bottom entry area; may legitimately trigger game over (block-out), doesn't crash. |
| 8.5 | Window resize / orientation change mid-game | Game continues, board re-fits, state preserved, no input loss. |
| 8.6 | Tab background then refocus | Single game loop resumes (no duplicate loops, no time-skip avalanche of rise ticks). |
| 8.7 | localStorage unavailable / quota exceeded / private mode | High score / settings features degrade gracefully; game stays playable. |
| 8.8 | Corrupt / invalid persisted data | Loader validates and falls back to defaults; no crash. |
| 8.9 | Very long session / very high score | No integer overflow, no UI breakage from large numbers, no FPS decay. |
| 8.10 | Unhandled error path | Errors are caught and surfaced gracefully (no white screen of death); no infinite error loop in console. |
| 8.11 | Game-over board fully stacked | Detected as game over, not a frozen/hung loop. |
