## Context

The product vision lives in `openspec/specs/project.md` (retro-modern dashboard Minesweeper) and engineering guardrails in `openspec/specs/agents.md` (React function components, pure game logic, `useReducer`, FSM, `React.memo` on cells, Tailwind, no backend). The repo currently has no application source tree; this change introduces the first runnable UI and the authoritative game rules in TypeScript.

## Goals / Non-Goals

**Goals:**

- Ship a **single-screen** Vite + React + TypeScript app with Tailwind for layout and styling.
- Implement **pure, testable** game logic in dedicated modules (grid, mine placement, reveal, win/lose), with a **finite state machine** `idle | playing | won | lost` surfaced through a **single reducer** for predictable updates.
- Provide **mode-based tools** (shovel / flag / question) and a **face** control that reflects game state with `🙂`, `😵`, `😎`.
- Render **two 3-digit LCD-style readouts** (black field, red digits): elapsed seconds and **remaining mine estimate** (mine total minus flags on the board).
- Support **cycle controls** for **difficulty** (mine count tier) and **board size** (9×9, 16×16, 30×30) as in project.md, resetting the current game when configuration changes.
- Meet **performance** guidance: memoized `Cell`, avoid unnecessary grid-wide rerenders (stable callbacks, derive props from reducer state).

**Non-Goals:**

- Backend, accounts, multiplayer, leaderboards, or analytics.
- Chord (middle-click) reveal, high-score persistence, or theming beyond the spec’s minimal retro dashboard.
- Internationalization or accessibility beyond reasonable defaults (can be revisited later).

## Decisions

1. **Stack: Vite + React 18 + TypeScript + Tailwind**  
   **Rationale:** Matches `project.md` and `agents.md`; fast HMR; small bundle.  
   **Alternatives:** CRA (deprecated), Next.js (unnecessary without routing).

2. **Pure engine + reducer at the UI boundary**  
   **Rationale:** `agents.md` requires pure functions for core logic and `useReducer` for game state. The reducer receives **actions** (e.g. `SELECT_TOOL`, `SHOVEL_AT`, `FLAG_AT`, `QUESTION_AT`, `RESTART`, `SET_DIFFICULTY`, `SET_BOARD_SIZE`, `TICK` optional) and delegates to pure `reduceGame(state, action)` in `src/game/` (or similar).  
   **Alternatives:** Multiple `useState` hooks (harder to reason about); Redux (overkill).

3. **Deferred mine placement until first shovel reveal**  
   **Rationale:** Guarantees the first reveal is never a mine and matches common Minesweeper UX. Mines are placed randomly after the first `SHOVEL_AT`, excluding the opened cell (and optionally its neighbors for a larger safe opening—see trade-off below).  
   **Alternatives:** Pre-placed board with relocation on first click (more complex).

4. **Difficulty × board size → mine count**  
   **Rationale:** Project.md lists both dimensions independently. Use a small **lookup table** in one module, e.g. `(size, difficulty) -> mineCount`, with sensible defaults:
   - 9×9: Easy 10, Normal 15, Hard 20  
   - 16×16: Easy 40, Normal 55, Hard 70  
   - 30×30: Easy 150, Normal 200, Hard 250  
   **Alternatives:** Percentage-based density only (harder to tune per size).

5. **Timer in React state vs engine**  
   **Rationale:** Elapsed time is **presentation**; `useEffect` + `setInterval` updates `seconds` while `status === 'playing'` and timer not paused. Mine counter derives from `mineTotal - flagsPlaced` (clamped 0–999 for display).  
   **Alternatives:** Store ticks in reducer (more action noise for each second).

6. **Digital display: three fixed digit slots**  
   **Rationale:** CSS/Tailwind (segment font or monospace + letter-spacing) to mimic 7-segment; **clamp** values to 0–999 for display; show overflow as `999` if needed.  
   **Alternatives:** Canvas (heavier); bitmap font (more asset work).

7. **Cell rendering**  
   **Rationale:** `React.memo(Cell)`; pass `row`, `col`, `cellViewModel`, and stable `onCellClick`/`onCellPointer` from parent if needed. Avoid inline object identities that change every render.  
   **Alternatives:** Virtualization (only if profiling shows need on 30×30).

8. **Board Visibility on Pause** 
   **Rationale:** To prevent players from planning moves while the timer is stopped.
   **Implementation:** When isPaused is true, render a "Paused" overlay on top of the Board component.

## Risks / Trade-offs

- **[Risk] First-click “large safe area” vs single safe cell** — Windows opens a clear area; a minimal implementation may only exclude the clicked cell from being a mine. **Mitigation:** Spec SHALL require at least that the revealed cell is not a mine; optionally expand to neighbor-safe placement in a follow-up if UX feels harsh.  
- **[Risk] 30×30 grid performance on low-end devices** — 900 memoized cells is usually fine. **Mitigation:** Memoize, avoid inline handlers; profile if needed.  
- **[Risk] Flag and question semantics** — Mode-based tools can conflict with user expectations. **Mitigation:** Spec SHALL define shovel vs flag vs question behavior on covered cells.

## Migration Plan

Not applicable: greenfield project with no production deployment. Rollback is “revert the commit” or remove `src/` scaffold.

## Open Questions

- Play/Pause behavior: The Pause button MUST freeze the timer AND hide the grid (or cover it with an overlay). The board remains non-interactive and invisible until the game is resumed.
- Exact **7-segment** styling: CSS-only vs webfont; implementation can choose as long as readouts meet black/red/dashboard spec.
