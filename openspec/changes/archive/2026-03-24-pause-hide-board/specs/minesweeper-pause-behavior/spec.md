## ADDED Requirements

### Requirement: Pause hides the board and disables interaction

When the user pauses the game, the application SHALL hide the board (or cover it with a “Paused” overlay) and SHALL disable all board interaction until the game is resumed.

#### Scenario: Pausing hides the board and locks cells
- **WHEN** the user clicks `Play/Pause` while the game is in `playing` state
- **THEN** the timer stops increasing and the board is not interactable (cells do not change the game state)

#### Scenario: Resuming restores the board
- **WHEN** the user clicks `Play/Pause` again while paused
- **THEN** the timer resumes increasing and board interaction works normally again

### Requirement: Pause does not change terminal game state

Pausing SHALL NOT change the core FSM game status (`idle`, `playing`, `won`, `lost`). The face emoji and win/loss terminal rendering SHALL remain driven exclusively by the FSM status.

#### Scenario: Pausing during normal play keeps face as playing
- **WHEN** the user pauses while the FSM status is `playing`
- **THEN** the face remains the “playing” face (`🙂`) and the only visible change is the paused overlay/hide behavior

### Requirement: Restart clears paused UI state

Restart SHALL clear the paused UI state so the board becomes visible and interactive again.

#### Scenario: Restart from paused resumes to a fresh game
- **WHEN** the user clicks the face button while the UI is paused
- **THEN** a fresh game starts with the board visible and unpaused (interactive immediately)

