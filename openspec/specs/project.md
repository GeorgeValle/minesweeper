# Project: Marine Minesweeper (Aquamarine Refinement)

## Overview
This project refines an existing Minesweeper game into a custom "Marine Minesweeper" theme. The classic grey dashboard is replaced by an immersive sea environment with aquamarine tones, using custom image assets for mines and tools, and a polished user interface.

## Aesthetic & Layout Constraints
* **Theme**: Marine/Sea Mine environment.
* **Palette**:
    * **Overall Board Background**: Strong Aquamarine color (e.g., Tailwind `bg-cyan-100` or hex `#7FFFD4`).
    * **Unclicked Cells**: Lighter tone of Aquamarine/Blue.
    * **Cleared Cells**: Darker tone of Aquamarine/Blue.
    * **Unclicked Tool Buttons**: gray with a subtle shadow.
    * **Clicked Tool Buttons**: Darker gray with a subtle shadow.
* **Layout Spacing (Critical)**:
    * Substantial padding/gap (e.g., `gap-6`, `p-6`) must be added between the Digital Displays (Mine Count/Timer) and the Configuration Buttons (Difficulty/Size) within the `Toolbar` component to prevent clumping.

## Asset Requirements
All assets are 16x16 pixels and located in `src/assets/`.
* **Mine**: `mina.png` (Used when a mine is revealed).
* **Flag (Boya)**: `boya.png` (Yellow buoy; replaces 'F' text and 'Flag' button text).
* **Shovel (Radar)**: `radar.png` (Replaces 'Shovel' button text).

## Main Features

### 1. Control Toolbar (`Toolbar.tsx`)
* **Tool Selector**:
    * **Selected State**: The button for the currently active tool MUST visuals look "pressed" (sunken relief or distinct highlight background).
    * **Pala (Radar)**: Button text 'Shovel' is replaced by `src/assets/radar.png` (16x16).
    * **Flag (Boya)**: Button text 'Flag' is replaced by `src/assets/boya.png` (16x16, yellow buoy).
    * **Question Mark**: button text 'Question' is replaced by emoji `❓`  for the button and the board.
* **Restart Button**: Central face emoji indicating game state.
* **Pause Button**: Toggles between `▶️` (Play - when game is paused) and `⏸️` (Pause - when game is running).
* **Buttons Differentiation**:
    * Unclicked buttons: Light tone.
    * Cleared buttons: Darker tone.

### 2. Status Displays
* **Displays**: Keep the 3-digit digital style. Add proper spacing around them.

### 3. Board and Visual Logic (`Board.tsx`, `Cell.tsx`)
* **Cell Differentiation**:
    * Unclicked cells: Light tone.
    * Cleared cells: Darker tone.
* **Loss State Logic**: When a mine is hit:
    * Reveal all mines using `src/assets/mina.png` on mine cells.
    * The specific mine clicked must have a Red "X" overlay on top of the mine image.

## Tech Stack
* React, Vite, TS, Tailwind CSS.