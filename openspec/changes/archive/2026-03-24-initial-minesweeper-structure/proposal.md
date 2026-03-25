## Why

The repository needs a concrete application skeleton and a testable game core before any polish or features can ship. Establishing the Vite/React/TypeScript stack with a pure game engine, dashboard UI patterns from `openspec/specs/project.md`, and agent rules from `openspec/specs/agents.md` gives a single source of truth for behavior and keeps UI and logic cleanly separated.

## What Changes

- Tailwind **Vite + React + TypeScript** with **Tailwind CSS**, a modular folder layout, and a single dashboard view (no routing, no backend).
- Implement a **pure TypeScript game engine**: grid and mine placement (first reveal safe), neighbor counts, flood-fill reveal, flag and question-mark cycling per cell, win/lose detection, and interaction rules when the game is lost (board disabled except restart).
- Expose game state through a **`useReducer`-based** module aligned with a finite state machine: `idle | playing | won | lost` (see agents spec).
- Build **retro-style 3-digit readouts** (black background, red segmented-style digits): elapsed time starting at `000` with **Play/Pause**, and **mine counter** reflecting remaining mines (total mines minus placed flags), clamped for display.
- Implement the **control toolbar**: tool mode **Shovel / Flag / Question**, central **face button** with emojis `🙂` (idle/playing), `😵` (lost), `😎` (won), plus **difficulty cycle** (Easy / Normal / Hard) and **board size cycle** (9×9, 16×16, 30×30) as specified in project.md.
- Add **`React.memo`** on cell components and stable props to limit grid re-renders; keep no file over **500 lines** (project constraint).

## Capabilities

### New Capabilities

- `minesweeper-engine`: Core rules and data model—grid generation, mine placement after first action or equivalent safe rule, reveal and chord behavior if specified in spec, flag/question states, FSM (`idle` | `playing` | `won` | `lost`), and pure functions for reducer actions.
- `minesweeper-dashboard`: Single-screen dashboard UI—toolbar (tools, face, difficulty, board size), paired 3-digit displays (timer + mines), board grid with cell aesthetics and number colors from project.md, and integration with the engine via reducer.

### Modified Capabilities

- _(None — `openspec/specs/` currently holds only `project.md` and `agents.md` as narrative specs; capability specs are introduced by this change.)_

## Impact

- **New** project setup with pnpm dependencies and config: Vite, React, TypeScript, Tailwind, typical ESLint/TS configs as chosen during implementation.
- **No** APIs, servers, or authentication; optional **localStorage** only if a later task stores preferences (not required for the minimal playable loop).
- **All** new application code lives under the new `src/` tree; existing `openspec/specs/*.md` remain reference documents unless explicitly updated outside this change.
