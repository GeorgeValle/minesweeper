import React from "react";
import type { BoardSize, Difficulty, GameStatus, Tool } from "../game/types";

function toolIcon(tool: Tool) {
  switch (tool) {
    case "shovel":
      // Usamos w-7 h-7 para que el radar llene mejor el botón
      return <img src="/assets/radar.png" alt="Radar" className="w-7 h-7 object-contain m-3 px-3" />;
    case "flag":
      // La boya ahora tendrá el mismo peso visual
      return <img src="/assets/boya.png" alt="Buoy" className="w-7 h-7 object-contain m-3 px-3" />;
    case "question":
      // El emoji necesita un tamaño de texto mayor para equipararse
      return <span className="text-2xl m-3 px-3">❓</span>;
    default:
      return tool;
  }
}

function difficultyLabel(difficulty: Difficulty) {
  switch (difficulty) {
    case "easy":
      return "Easy";
    case "normal":
      return "Normal";
    case "hard":
      return "Hard";
    default:
      return difficulty;
  }
}

function faceEmoji(status: GameStatus) {
  if (status === "lost") return "😵";
  if (status === "won") return "😎";
  return "🙂";
}

export type ToolbarProps = {
  tool: Tool;
  status: GameStatus;
  difficulty: Difficulty;
  boardSize: BoardSize;
  onToolChange: (tool: Tool) => void;
  onRestart: () => void;
  onCycleDifficulty: () => void;
  onCycleBoardSize: () => void;
};

export default function Toolbar({
  tool,
  status,
  difficulty,
  boardSize,
  onToolChange,
  onRestart,
  onCycleDifficulty,
  onCycleBoardSize,
}: ToolbarProps) {
  return (
    <div className="max-w-5xl mx-auto flex items-center  justify-between gap-12 px-8">
      {/* Grupo de Herramientas */}
      <div className="flex items-center toolbar-styles gap-4">
        {(["shovel", "flag", "question"] as Tool[]).map((t) => {
          const active = t === tool;
          return (
            <button
              key={t}
              type="button"
              className={`w-12 h-12 rounded border button-styles ${
                active
                  ? "bg-zinc-800 text-zinc-100 shadow-inner"
                  : "bg-zinc-900/40 text-zinc-300 hover:bg-zinc-900/60"
              } flex items-center justify-center`}
              onClick={() => onToolChange(t)}
            >
              {toolIcon(t)}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="w-14 h-14 rounded-full p-4 button-styles border-2 border-zinc-700 bg-zinc-950 flex items-center justify-center text-2xl "
        onClick={onRestart}
        aria-label="restart"
      >
        {faceEmoji(status)}
      </button>

      <div className="flex items-center gap-4 toolbar-styles">
        <button
          type="button"
          className="px-4 py-3 mb-3 button-styles rounded border bg-zinc-900/40 text-zinc-300 hover:bg-zinc-900/60"
          onClick={onCycleDifficulty}
          aria-label="cycle difficulty"
        >
          <div className="text-xs leading-none text-zinc-400">Difficulty</div>
          <div className="font-semibold">{difficultyLabel(difficulty)}</div>
        </button>
        <button
          type="button"
          className="px-4 py-3 mb-3 button-styles rounded border bg-zinc-900/40 text-zinc-300 hover:bg-zinc-900/60"
          onClick={onCycleBoardSize}
          aria-label="cycle board size"
        >
          <div className="text-xs leading-none text-zinc-400">Board</div>
          <div className="font-semibold">{boardSize}x{boardSize}</div>
        </button>
      </div>
    </div>
  );
}

