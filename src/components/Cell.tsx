import React, { memo } from "react";
import type { BoardSize, CellState, Tool } from "../game/types";

export type CellProps = {
  index: number;
  boardSize: BoardSize;
  cell: CellState;
  sizePx: number;
  disabled: boolean;
  tool: Tool;
  onToolAtIndex: (index: number, tool: Tool) => void;
  gameStatus: "idle" | "playing" | "won" | "lost";
  explodedMineIndex: number | null;
};

function numberColorClass(adjacentMines: number) {
  switch (adjacentMines) {
    case 1:
      return "text-blue-600";
    case 2:
      return "text-green-600";
    case 3:
      return "text-red-600";
    case 4:
      return "text-black";
    case 5:
      return "text-amber-700";
    default:
      return "text-zinc-900";
  }
}

const Cell = memo(function Cell({
  index,
  cell,
  sizePx,
  disabled,
  tool,
  onToolAtIndex,
  gameStatus,
  explodedMineIndex,
}: CellProps) {
  const base =
    "flex items-center justify-center border border-cyan-900/20 select-none transition-colors";

  // Determine if this is the exploded mine in loss state
  const isExplodedMine = gameStatus === "lost" && cell.hasMine && index === explodedMineIndex;

  const background = cell.isRevealed
    ? cell.hasMine
      ? isExplodedMine
        ? "bg-black" // Will show X overlay
        : "bg-black" // Regular revealed mine
      : "bg-[#40E0D0]" // Regular revealed non-mine (darker aquamarine)
    : "bg-[#B2FFF2]"; // Unrevealed cell (lighter aquamarine)

  const content = (() => {
    if (!cell.isRevealed) {
      if (cell.mark === "flag") {
        return <img src="/assets/boya.png" alt="Flag" width="16" height="16" />;
      }
      if (cell.mark === "question") {
        return <span className="text-zinc-600 font-bold text-lg">❓</span>;
      }
      return null;
    }

    // Handle revealed cells in loss state
    if (gameStatus === "lost" && cell.hasMine) {
      return (
        <div className="relative flex items-center justify-center w-full h-full">
          <img src="/assets/mina.png" alt="Mine" width="16" height="16" />
          {isExplodedMine && (
            <div className="absolute flex items-center justify-center w-full h-full text-red-500 font-bold text-2xl">
              X
            </div>
          )}
        </div>
      );
    }

    if (cell.hasMine) return null; // Regular revealed mine (non-lost state)
    if (cell.adjacentMines <= 0) return null;

    return (
      <span className={`font-bold text-lg ${numberColorClass(cell.adjacentMines)}`}>
        {cell.adjacentMines}
      </span>
    );
  })();

  return (
    <button
      type="button"
      className={`${base} ${background}`}
      style={{ width: sizePx, height: sizePx }}
      disabled={disabled}
      aria-label={`cell-${index}`}
      onClick={() => onToolAtIndex(index, tool)}
    >
      {content}
    </button>
  );
});

export default Cell;

