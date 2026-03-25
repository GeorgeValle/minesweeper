# Agents Configuration

## General Behavior
- Act as a senior frontend developer.
- Prioritize clarity and simplicity over complexity.
- Use clear and descriptive naming.
- Avoid overengineering solutions.

## Code Style
- Use React with functional components.
- Prefer TypeScript when possible.
- Prefer pnpm for istalling dependencies.
- Keep components small and reusable.
- Use simple state management (avoid unnecessary libraries).

## UI Guidelines
- Build clean and modern interfaces.
- Use a dashboard-style layout.
- Prioritize readability and spacing.
- Keep the design minimal.

## Data Handling
- Use localstorage for data storage.
- Do not implement backend or API calls.
- Focus only on frontend behavior.

## Scope Control
- Do not add extra features beyond the specification.
- Do not include authentication or routing unless explicitly required.

## Communication
- Generate code that is easy to understand for junior developers.
- Add comments only when necessary.

## Game Logic & State
- Implement game state using a Finite State Machine (status: 'idle' | 'playing' | 'won' | 'lost').
- Separate core game logic (grid generation, mine placement, flood fill algorithm) into pure TypeScript functions.
- Use a `useReducer` hook for complex state transitions to keep the logic centralized and predictable.

## Performance & Grid Handling
- Optimize the grid rendering to prevent unnecessary re-renders of cell components.
- Use `React.memo` for the individual Cell components.
- Ensure the flood-fill algorithm (recursive opening of empty cells) is efficient.

## Specific Tools for Vite
- Use Tailwind CSS for rapid UI building and keeping the bundle small.
- Leverage Vite's fast HMR for immediate feedback on game state changes.

## Skills & Patterns
- Follow React 19 best practices as defined in `~/.opencode/skills/react-19/SKILL.md`.
- Use the "Gentleman Programming" coding style: prioritize clean architecture and signal-like state patterns.