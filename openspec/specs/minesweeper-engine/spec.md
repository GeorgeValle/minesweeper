# minesweeper-engine Specification

## Purpose
TBD - created by archiving change initial-minesweeper-structure. Update Purpose after archive.
## Requirements
### Requirement: Finite game status

The game engine SHALL represent overall progress as exactly one of `idle`, `playing`, `won`, or `lost`, matching `agents.md`.

#### Scenario: New game starts idle

- **WHEN** a new session is created or the board is reset before any shovel reveal
- **THEN** the status SHALL be `idle` and mines SHALL not yet be committed to the grid

#### Scenario: First shovel moves to playing

- **WHEN** a valid shovel action reveals at least one cell on a non-terminal board
- **THEN** the status SHALL become `playing` if it was `idle`

#### Scenario: Win and loss are terminal

- **WHEN** all non-mine cells are revealed
- **THEN** the status SHALL be `won`

- **WHEN** a mine is revealed by the shovel
- **THEN** the status SHALL be `lost`

### Requirement: Board configuration

The engine SHALL support independent **board size** and **difficulty** selections. Board size SHALL be one of 9×9, 16×16, or 30×30. Difficulty SHALL be one of Easy, Normal, or Hard and SHALL determine the mine count together with the selected size using fixed presets documented in implementation (see design).

#### Scenario: Configuration change resets game

- **WHEN** board size or difficulty changes
- **THEN** the engine SHALL reset to a fresh `idle` board consistent with the new configuration

### Requirement: Deferred mine placement

The engine SHALL defer random mine placement until the first successful shovel reveal on an `idle` board. The first revealed cell SHALL NOT contain a mine.

#### Scenario: Mines exist after first reveal

- **WHEN** the first shovel reveal completes on an `idle` board
- **THEN** the mines SHALL be placed for the current configuration and the revealed cell SHALL be safe

### Requirement: Shovel reveal and flood fill

The shovel SHALL reveal a covered cell that is not flagged. If the cell has no adjacent mines, the engine SHALL recursively reveal adjacent covered cells (flood fill) without revealing mines.

#### Scenario: Empty region opens

- **WHEN** shovel reveals a cell with zero adjacent mines
- **THEN** all reachable covered cells with zero adjacent mines SHALL be revealed together with their number borders per standard Minesweeper behavior

### Requirement: Tool modes for covered cells

The engine SHALL accept a **current tool** of `shovel`, `flag`, or `question`. On a covered cell that is not revealed:

- **Shovel** SHALL reveal the cell (subject to loss/idle rules).
- **Flag** SHALL toggle a mine flag if the cell is not in question state, or clear question when setting flag per spec below.
- **Question** SHALL cycle mark state: none → question → none (or equivalent) without revealing the cell.

#### Scenario: Flag toggling

- **WHEN** the tool is flag and the player acts on a covered cell without a question mark
- **THEN** the cell SHALL toggle between unmarked and flagged

#### Scenario: Question mark

- **WHEN** the tool is question and the player acts on a covered cell without a flag
- **THEN** the cell SHALL toggle or cycle the question mark state without revealing the cell

### Requirement: Win detection

The engine SHALL detect win when every non-mine cell is revealed.

#### Scenario: Win after last safe reveal

- **WHEN** the last safe cell is revealed
- **THEN** the status SHALL be `won` and all mines MAY remain hidden or be shown as unopened per UI spec

### Requirement: Loss detection and reveal

The engine SHALL detect loss when a mine is revealed by the shovel. After loss, the engine SHALL expose enough information for the UI to render all mine locations and disable further board actions except restart.

#### Scenario: Loss reveals mines

- **WHEN** status becomes `lost`
- **THEN** the engine state SHALL include mine positions for all cells for display

### Requirement: Pure reducer-shaped updates

Core game transitions SHALL be implementable as pure functions of prior state and an action, suitable for a single `useReducer` in the UI layer.

#### Scenario: No hidden mutations

- **WHEN** a transition is applied
- **THEN** a new immutable state object SHALL be produced (no in-place mutation of the previous grid)

