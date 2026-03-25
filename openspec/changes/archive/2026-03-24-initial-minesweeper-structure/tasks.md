## 1. Project scaffold

- [x] 1.1 Initialize Vite with React and TypeScript; add Tailwind and base `index.html` / `src/main.tsx` entry
- [x] 1.2 Add project scripts (`dev`, `build`, `preview`) and strict TypeScript settings aligned with agents guidance
- [x] 1.3 Create folder layout for `game` (pure logic), `components`, and `hooks` without exceeding 500 lines per file

## 2. Game engine (pure TypeScript)

- [x] 2.1 Define types for `GameStatus`, `BoardSize`, `Difficulty`, `Tool`, cells (covered, revealed, flag, question), and immutable game state
- [x] 2.2 Implement mine-count presets for each `(board size, difficulty)` pair and document constants in one module
- [x] 2.3 Implement deferred mine placement (first shovel safe) and neighbor counts
- [x] 2.4 Implement shovel reveal with iterative flood fill for zero regions
- [x] 2.5 Implement flag and question tool actions on covered cells and win/loss detection with full mine reveal data on loss
- [x] 2.6 Export `gameReducer` / `reduceGame(state, action)` suitable for `useReducer`, with unit-testable pure functions

## 3. Dashboard UI

- [x] 3.1 Build `DigitalDisplay` (3 digits, black background, red digits) and reuse for timer and mine counter
- [x] 3.2 Implement timer with `000` start, increment while `playing`, and Play/Pause control per spec
- [x] 3.3 Build toolbar: tool toggles (shovel / flag / question), face button (`🙂` / `😵` / `😎`), difficulty cycle, board size cycle
- [x] 3.4 Build memoized `Cell` and `Board` grid with Tailwind styling for colors, covered/revealed/mine visuals, and disabled interaction when `lost` or `won` as specified
- [x] 3.5 Wire `useReducer` to the engine, derive mine counter from flags, and connect restart to reset `idle` state

## 4. Verification

- [x] 4.1 Manually verify first-click safety, flood fill, flag/question modes, win/lose faces, timer pause, and config cycles
- [x] 4.2 Run `pnpm build` (or npm equivalent) to ensure typecheck and production build succeed
