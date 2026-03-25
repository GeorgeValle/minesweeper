import React, { useEffect, useMemo, useReducer, useState } from "react";
import Board from "./components/Board";
import DigitalDisplay from "./components/DigitalDisplay";
import PausedOverlay from "./components/PausedOverlay";
import Toolbar from "./components/Toolbar";
import { createInitialGame, reduceGame } from "./game/engine";
import type { BoardSize, Difficulty, GameStatus, Tool } from "./game/types";
import type { GameAction } from "./game/types";

const DIFFICULTY_CYCLE: Difficulty[] = ["easy", "normal", "hard"];
const BOARD_SIZE_CYCLE: BoardSize[] = [9, 16, 30];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function nextInCycle<T>(cycle: T[], current: T): T {
  const idx = cycle.indexOf(current);
  const nextIdx = (idx + 1) % cycle.length;
  return cycle[nextIdx];
}

function faceEmoji(status: GameStatus) {
  if (status === "lost") return "😵";
  if (status === "won") return "😎";
  return "🙂";
}

export default function App() {
  const [tool, setTool] = useState<Tool>("shovel");
  const [isPaused, setIsPaused] = useState(false);
  const [timeSeconds, setTimeSeconds] = useState(0);

  const [game, dispatch] = useReducer(reduceGame, undefined, () => createInitialGame(9, "easy"));

  const flagsPlaced = useMemo(() => {
    return game.cells.reduce((acc, c) => acc + (c.mark === "flag" ? 1 : 0), 0);
  }, [game.cells]);

  const remainingMines = useMemo(() => {
    const remaining = game.mineTotal - flagsPlaced;
    return clamp(remaining, 0, 999);
  }, [game.mineTotal, flagsPlaced]);

  useEffect(() => {
    // Safety: if the engine leaves "playing", clear paused UI state.
    if (game.status !== "playing" && isPaused) setIsPaused(false);
  }, [game.status, isPaused]);

  useEffect(() => {
    if (game.status !== "playing") return;
    if (isPaused) return;

    const id = window.setInterval(() => {
      setTimeSeconds((s) => s + 1);
    }, 1000);

    return () => window.clearInterval(id);
  }, [game.status, isPaused]);

  const restart = () => {
    dispatch({ type: "RESTART" } as GameAction);
    setIsPaused(false);
    setTimeSeconds(0);
  };

  const cycleDifficulty = () => {
    const next = nextInCycle(DIFFICULTY_CYCLE, game.difficulty);
    dispatch({ type: "SET_DIFFICULTY", difficulty: next } as GameAction);
    setIsPaused(false);
    setTimeSeconds(0);
  };

  const cycleBoardSize = () => {
    const next = nextInCycle(BOARD_SIZE_CYCLE, game.boardSize);
    dispatch({ type: "SET_BOARD_SIZE", boardSize: next } as GameAction);
    setIsPaused(false);
    setTimeSeconds(0);
  };

  const onToolAtIndex = (index: number, t: Tool) => {
    if (isPaused) return;
    if (game.status === "lost" || game.status === "won") return;

    if (t === "shovel") dispatch({ type: "REVEAL_AT", index } as GameAction);
    else if (t === "flag") dispatch({ type: "FLAG_AT", index } as GameAction);
    else if (t === "question") dispatch({ type: "QUESTION_AT", index } as GameAction);
  };

  const boardLocked = isPaused || game.status === "lost" || game.status === "won";

return (
  <div className="min-h-screen p-6  flex flex-col items-center  gap-8">
    <div className="w-full max-w-5xl">
      <Toolbar
        tool={tool}
        status={game.status}
        difficulty={game.difficulty}
        boardSize={game.boardSize}
        onToolChange={setTool}
        onRestart={restart}
        onCycleDifficulty={cycleDifficulty}
        onCycleBoardSize={cycleBoardSize}
      />
    </div>

    <div className="w-full max-w-5xl flex items-center justify-between  gap-4">
        <div className="flex items-center gap-4 toolbar-styles">
          <div className="lcdDigits text-zinc-400 text-sm">Time</div>
          <DigitalDisplay value={timeSeconds} />
<button
  type="button"
  className={` button-styles rounded border ${
    game.status !== "playing"
      ? "bg-zinc-900/40 text-zinc-600 border-zinc-800 cursor-not-allowed"
      : "bg-zinc-900/40 text-zinc-200 border-zinc-700"
  }`}
  disabled={game.status !== "playing"}
  onClick={() => setIsPaused((p) => !p)}
>
  {isPaused ? "▶️" : "⏸️"}
</button>
        </div>

        <div className="flex items-center gap-3 toolbar-styles">
          <div className="lcdDigits text-zinc-400 text-sm ">Mines</div>
          <DigitalDisplay value={remainingMines} />
        </div>
      </div>

      <div className="relative w-full max-w-5xl flex items-center justify-center">
{!isPaused ? (
  <Board
    boardSize={game.boardSize}
    cells={game.cells}
    disabled={boardLocked}
    tool={tool}
    onToolAtIndex={onToolAtIndex}
    gameStatus={game.status}
    explodedMineIndex={game.explodedMineIndex}
  />
) : (
  <div className="flex items-center justify-center" style={{ width: game.boardSize * 28 }}>
    {/* Render nothing: board is hidden while paused */}
  </div>
)}

        {isPaused && <PausedOverlay />}
      </div>
    </div>
  );
}

