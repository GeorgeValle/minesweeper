import type { BoardSize, Difficulty, GameAction, GameState, Tool } from "./types";
import { getMineTotal } from "./presets";
import type { CellMark } from "./types";

const OFFSETS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const;

function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${String(x)}`);
}

function indexToRowCol(index: number, boardSize: BoardSize) {
  return { row: Math.floor(index / boardSize), col: index % boardSize };
}

function rowColToIndex(row: number, col: number, boardSize: BoardSize) {
  return row * boardSize + col;
}

function getNeighborIndices(index: number, boardSize: BoardSize): number[] {
  const { row, col } = indexToRowCol(index, boardSize);
  const out: number[] = [];
  for (const [dr, dc] of OFFSETS) {
    const r = row + dr;
    const c = col + dc;
    if (r < 0 || c < 0 || r >= boardSize || c >= boardSize) continue;
    out.push(rowColToIndex(r, c, boardSize));
  }
  return out;
}

function cloneCells(cells: GameState["cells"]) {
  return cells.map((c) => ({ ...c }));
}

function createEmptyCells(totalCells: number) {
  return Array.from({ length: totalCells }, () => ({
    hasMine: false,
    adjacentMines: 0,
    isRevealed: false,
    mark: "none" as CellMark,
  }));
}

export function createInitialGame(
  boardSize: BoardSize = 9,
  difficulty: Difficulty = "easy",
): GameState {
  const mineTotal = getMineTotal(boardSize, difficulty);
  const totalCells = boardSize * boardSize;
  return {
    status: "idle",
    boardSize,
    difficulty,
    mineTotal,
    minesPlaced: false,
    cells: createEmptyCells(totalCells),
    revealedNonMineCount: 0,
    explodedMineIndex: null,
  };
}

function placeMines(params: {
  state: GameState;
  safeIndex: number;
}): GameState["cells"] {
  const { state, safeIndex } = params;
  const { boardSize, mineTotal } = state;
  const totalCells = boardSize * boardSize;

  const candidates: number[] = [];
  for (let i = 0; i < totalCells; i++) {
    if (i === safeIndex) continue;
    candidates.push(i);
  }

  // Shuffle candidates (Fisher–Yates) and take first mineTotal.
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = candidates[i];
    candidates[i] = candidates[j];
    candidates[j] = tmp;
  }

  const mineIndices = new Set(candidates.slice(0, mineTotal));

  const cells = cloneCells(state.cells);
  for (let i = 0; i < cells.length; i++) {
    cells[i].hasMine = mineIndices.has(i);
  }

  // Compute adjacent mine counts for all non-mine cells.
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].hasMine) continue;
    const neighbors = getNeighborIndices(i, boardSize);
    let count = 0;
    for (const n of neighbors) {
      if (cells[n].hasMine) count++;
    }
    cells[i].adjacentMines = count;
  }

  return cells;
}

function revealRegion(params: {
  state: GameState;
  startIndex: number;
}): { next: GameState; statusMaybe?: GameState["status"] } {
  const { state, startIndex } = params;
  const { boardSize } = state;

  const cells = cloneCells(state.cells);
  let revealedNonMineCount = state.revealedNonMineCount;
  let status: GameState["status"] = state.status === "idle" ? "playing" : state.status;

  const stack: number[] = [startIndex];
  while (stack.length) {
    const index = stack.pop()!;
    const cell = cells[index];

    if (cell.isRevealed) continue;

    // Respect marks: shovel should not reveal flagged/question cells.
    if (cell.mark === "flag" || cell.mark === "question") continue;
    if (cell.hasMine) continue;

    cell.isRevealed = true;
    revealedNonMineCount++;

    if (cell.adjacentMines !== 0) continue;

    for (const n of getNeighborIndices(index, boardSize)) {
      const neighbor = cells[n];
      if (neighbor.isRevealed) continue;
      if (neighbor.mark === "flag" || neighbor.mark === "question") continue;
      if (neighbor.hasMine) continue;
      stack.push(n);
    }
  }

  // If we reached here without a mine hit, the only terminal is win.
  const totalNonMines = boardSize * boardSize - state.mineTotal;
  if (revealedNonMineCount === totalNonMines) status = "won";
  else status = "playing";

  return {
    next: {
      ...state,
      status,
      cells,
      revealedNonMineCount,
    },
  };
}

function revealMineAndLose(params: { state: GameState; mineIndex: number }): GameState {
  const { state, mineIndex } = params;
  const cells = cloneCells(state.cells);
  // Reveal all mines for UI.
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].hasMine) cells[i].isRevealed = true;
  }
  // Ensure the clicked mine is revealed too (it is part of mines).
  cells[mineIndex].isRevealed = true;

  return {
    ...state,
    status: "lost",
    cells,
    explodedMineIndex: mineIndex,
  };
}

function applyFlag(params: { state: GameState; index: number; markNext: CellMark }) {
  const { state, index, markNext } = params;
  const cells = cloneCells(state.cells);
  const cell = cells[index];
  if (!cell || cell.isRevealed) return state;
  cell.mark = markNext;
  return { ...state, cells };
}

export function reduceGame(state: GameState, action: GameAction): GameState {
  const totalCells = state.boardSize * state.boardSize;
  const isIndexValid = (index: number) => index >= 0 && index < totalCells;

  switch (action.type) {
    case "RESTART": {
      return createInitialGame(state.boardSize, state.difficulty);
    }
    case "SET_DIFFICULTY": {
      return createInitialGame(state.boardSize, action.difficulty);
    }
    case "SET_BOARD_SIZE": {
      return createInitialGame(action.boardSize, state.difficulty);
    }

    case "FLAG_AT": {
      if (state.status === "won" || state.status === "lost") return state;
      const index = action.index;
      if (!isIndexValid(index)) return state;

      const cell = state.cells[index];
      if (cell.isRevealed) return state;

      const nextMark: CellMark = cell.mark === "flag" ? "none" : "flag";
      return applyFlag({ state, index, markNext: nextMark });
    }

    case "QUESTION_AT": {
      if (state.status === "won" || state.status === "lost") return state;
      const index = action.index;
      if (!isIndexValid(index)) return state;

      const cell = state.cells[index];
      if (cell.isRevealed) return state;

      let nextMark: CellMark;
      // none -> question -> none; flagged -> none (simplified cycle).
      if (cell.mark === "question") nextMark = "none";
      else if (cell.mark === "none") nextMark = "question";
      else nextMark = "none";

      return applyFlag({ state, index, markNext: nextMark });
    }

    case "REVEAL_AT": {
      if (state.status === "won" || state.status === "lost") return state;
      const index = action.index;
      if (!isIndexValid(index)) return state;

      const cell = state.cells[index];
      if (cell.isRevealed) return state;
      if (cell.mark === "flag" || cell.mark === "question") return state;

      // Place mines deferred on first reveal.
      if (state.status === "idle") {
        const cellsWithMines = placeMines({ state, safeIndex: index });
        const hasMine = cellsWithMines[index].hasMine;
        const nextBase: GameState = {
          ...state,
          minesPlaced: true,
          cells: cellsWithMines,
          status: "playing",
          revealedNonMineCount: 0,
        };
        if (hasMine) return revealMineAndLose({ state: nextBase, mineIndex: index });
        const revealed = revealRegion({ state: nextBase, startIndex: index });
        return revealed.next;
      }

      // Mines already placed.
      if (state.cells[index].hasMine) return revealMineAndLose({ state, mineIndex: index });
      const revealed = revealRegion({ state, startIndex: index });
      return revealed.next;
    }

    default:
      return assertNever(action);
  }
}

// Alias to make the reducer export explicit for spec-driven tasks.
export const gameReducer = reduceGame;

export function getToolFromAction(action: GameAction): Tool | null {
  switch (action.type) {
    case "REVEAL_AT":
      return "shovel";
    case "FLAG_AT":
      return "flag";
    case "QUESTION_AT":
      return "question";
    default:
      return null;
  }
}

