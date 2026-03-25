import type { BoardSize, Difficulty } from "./types";

const MINE_TOTALS: Record<BoardSize, Record<Difficulty, number>> = {
  9: { easy: 10, normal: 15, hard: 20 },
  16: { easy: 40, normal: 55, hard: 70 },
  30: { easy: 150, normal: 200, hard: 250 },
};

export function getMineTotal(boardSize: BoardSize, difficulty: Difficulty) {
  return MINE_TOTALS[boardSize][difficulty];
}

