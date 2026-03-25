import React from "react";

export default function PausedOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
      <div className="lcd lcdDigits px-6 py-3 text-2xl">Paused</div>
    </div>
  );
}

