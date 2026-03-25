import React, { memo } from "react";

function clampTo3Digits(value: number) {
  if (value < 0) return 0;
  if (value > 999) return 999;
  return Math.floor(value);
}

export type DigitalDisplayProps = {
  value: number;
};

const DigitalDisplay = memo(function DigitalDisplay({ value }: DigitalDisplayProps) {
  const v = clampTo3Digits(value);
  const text = String(v).padStart(3, "0");

  return (
    <div className="lcd  lcdDigits text-center tabular-nums w-[5.5rem]">
      {text}
    </div>
  );
});

export default DigitalDisplay;

