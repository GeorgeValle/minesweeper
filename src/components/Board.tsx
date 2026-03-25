import React, { useMemo } from "react";
import type { BoardSize, CellState, Tool } from "../game/types";
import Cell from "./Cell";

export type BoardProps = {
  boardSize: BoardSize;
  cells: CellState[];
  disabled: boolean;
  tool: Tool;
  onToolAtIndex: (index: number, tool: Tool) => void;
  gameStatus: "idle" | "playing" | "won" | "lost";
  explodedMineIndex: number | null;
};

function cellPx(boardSize: BoardSize) {
  if (boardSize === 9) return 28;
  if (boardSize === 16) return 22;
  return 16;
}

export default function Board({
  boardSize,
  cells,
  disabled,
  tool,
  onToolAtIndex,
  gameStatus,
  explodedMineIndex,
}: BoardProps) {
  const size = cellPx(boardSize);

  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${boardSize}, ${size}px)`,
      gridTemplateRows: `repeat(${boardSize}, ${size}px)`,
    }),
    [boardSize, size],
  );

  return (
    <div className="flex items-center justify-center">
      <div className="grid gap-0" style={gridStyle} role="grid" aria-label="board">
        {cells.map((cell, index) => (
          <Cell
            key={index}
            index={index}
            boardSize={boardSize}
            cell={cell}
            sizePx={size}
            disabled={disabled}
            tool={tool}
            onToolAtIndex={onToolAtIndex}
            gameStatus={gameStatus}
            explodedMineIndex={explodedMineIndex}
          />
        ))}
      </div>
    </div>
  );
}

