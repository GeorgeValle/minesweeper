# minesweeper-dashboard Specification

## Purpose
TBD - created by archiving change initial-minesweeper-structure. Update Purpose after archive.
## Requirements
### Requirement: Single dashboard view

The application SHALL present the entire game in one view with no navigation or extra routes, per `project.md` and `agents.md`.

#### Scenario: No routing

- **WHEN** the app loads
- **THEN** the user SHALL see the Minesweeper dashboard without URL-based routing

### Requirement: Control toolbar tools

The UI SHALL provide three tool controls for **Shovel** (reveal), **Flag**, and **Question** that set the active interaction mode for the board.

#### Scenario: Tool selection

- **WHEN** the user selects a tool
- **THEN** subsequent board interactions SHALL use that tool until another tool is selected

### Requirement: Face button states

The central face button SHALL display `🙂` when the game is `idle` or `playing`, `😵` when `lost`, and `😎` when `won`, per `project.md`.

#### Scenario: Face reflects terminal states

- **WHEN** the game status is `lost`
- **THEN** the face SHALL show `😵`

- **WHEN** the game status is `won`
- **THEN** the face SHALL show `😎`

### Requirement: Restart from face

The face button SHALL restart the game to a fresh `idle` state for the current board size and difficulty.

#### Scenario: Restart after loss

- **WHEN** the user clicks the face after a loss
- **THEN** a new `idle` game SHALL start and the board SHALL be interactive again

### Requirement: Difficulty and board size controls

The UI SHALL provide a control to cycle **difficulty** (Easy → Normal → Hard → …) and a control to cycle **board size** (9×9 → 16×16 → 30×30 → …), per `project.md`.

#### Scenario: Cycles advance

- **WHEN** the user activates the difficulty control
- **THEN** the next difficulty SHALL be selected and the game SHALL reset per engine rules

- **WHEN** the user activates the board size control
- **THEN** the next size SHALL be selected and the game SHALL reset per engine rules

### Requirement: Digital time display

The UI SHALL show a **three-digit** elapsed time display with **black** background and **red** digit styling, starting at `000`, and SHALL include a **Play/Pause** control that stops and resumes the timer, per `project.md`.

#### Scenario: Timer starts with play

- **WHEN** the game transitions from `idle` to `playing` and the timer is not paused
- **THEN** the displayed seconds SHALL increase over time

#### Scenario: Pause stops counting

- **WHEN** the user pauses the timer
- **THEN** the displayed value SHALL stop increasing until resumed

### Requirement: Digital mine counter

The UI SHALL show a **three-digit** remaining-mines display with **black** background and **red** digits, representing remaining mines as **total mines minus flags placed**, clamped to the display 0–999.

#### Scenario: Counter updates with flags

- **WHEN** the player places or removes a flag
- **THEN** the mine counter SHALL reflect the updated remaining count

### Requirement: Cell appearance

Covered cells SHALL use a **light gray** appearance. Revealed mines SHALL use **black** cell styling when shown, per `project.md`. Revealed numbers SHALL use **1** blue, **2** green, **3** red, **4** black, **5** brown.

#### Scenario: Number colors

- **WHEN** a cell displays a number from 1 to 5
- **THEN** the digit SHALL use the color assigned for that number

### Requirement: Interaction lock on loss

When the game is `lost`, the board SHALL be non-interactive except that the face control remains usable for restart, per `project.md`.

#### Scenario: Board disabled after loss

- **WHEN** the status is `lost`
- **THEN** cell clicks SHALL NOT change the board state except via restart

### Requirement: Cell performance

Individual cell components SHALL be wrapped in `React.memo` per `agents.md`, and props SHALL avoid unnecessary identity churn that would force full grid rerenders.

#### Scenario: Memoized cells

- **WHEN** the implementation is complete
- **THEN** `Cell` SHALL be exported as a memoized component

