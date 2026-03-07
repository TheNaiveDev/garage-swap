import type { MouseEvent } from "react";

type BtnBigTypes = {
  btnBg: string;
  textColor: string;
  text: string;
  onsubmit?: (e: MouseEvent<HTMLButtonElement>) => void;
};

export default function BtnBig({
  btnBg,
  textColor,
  text,
  onsubmit,
}: BtnBigTypes) {
  return (
    <button
      onClick={onsubmit}
      className={`py-3 ${btnBg} text-lg shadow-sm rounded-md text-center ${textColor}`}
    >
      {text}
    </button>
  );
}
