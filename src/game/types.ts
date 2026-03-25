export type GameStatus = "idle" | "playing" | "won" | "lost";

export type BoardSize = 9 | 16 | 30;

export type Difficulty = "easy" | "normal" | "hard";

export type Tool = "shovel" | "flag" | "question";

export type CellMark = "none" | "flag" | "question";

export type CellState = {
  hasMine: boolean;
  adjacentMines: number;
  isRevealed: boolean;
  mark: CellMark;
};

export type GameState = {
  status: GameStatus;
  boardSize: BoardSize;
  difficulty: Difficulty;
  mineTotal: number;
  minesPlaced: boolean;
  cells: CellState[];
  revealedNonMineCount: number;
  explodedMineIndex: number | null;
};

export type GameAction =
  | { type: "RESTART" }
  | { type: "SET_DIFFICULTY"; difficulty: Difficulty }
  | { type: "SET_BOARD_SIZE"; boardSize: BoardSize }
  | { type: "REVEAL_AT"; index: number }
  | { type: "FLAG_AT"; index: number }
  | { type: "QUESTION_AT"; index: number };

