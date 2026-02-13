import type { AppStatus, AppMode } from "../types/api";

const LABELS: Record<AppMode, string> = {
  baseline: "Classifier (Base)", hardened: "Classifier (Durci)", compare: "Comparer les deux",
};

export function PredictButton({ status, mode, disabled, onClick }:
  { status: AppStatus; mode: AppMode; disabled: boolean; onClick: () => void }) {
  const busy = status === "predicting";
  return (
    <button onClick={onClick} disabled={disabled || busy}
      className={`w-full py-3.5 rounded-lg font-semibold text-[13px] tracking-wider uppercase transition-all font-mono
        ${disabled ? "bg-neutral-900 text-neutral-600 cursor-not-allowed"
        : busy ? "bg-green-900/30 text-green-400 cursor-wait"
        : mode === "compare" ? "bg-blue-500 text-neutral-900 hover:bg-blue-400 cursor-pointer"
        : mode === "hardened" ? "bg-green-500 text-neutral-900 hover:bg-green-400 cursor-pointer"
        : "bg-amber-500 text-neutral-900 hover:bg-amber-400 cursor-pointer"}`}>
      {busy ? (
        <span className="flex items-center justify-center gap-2">
          <span className="inline-block w-3.5 h-3.5 border-2 border-transparent border-t-current rounded-full animate-spin" />
          Analyse...
        </span>
      ) : LABELS[mode]}
    </button>
  );
}
