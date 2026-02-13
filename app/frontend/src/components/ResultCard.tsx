import type { Prediction } from "../types/api";
import { VEGGIE_ICONS, MODEL_INFO } from "../utils/constants";
import { ConfidenceBar } from "./ConfidenceBar";

export function ResultCard({ modelKey, predictions, inferenceMs }:
  { modelKey: string; predictions: Prediction[]; inferenceMs: number }) {
  const top = predictions[0];
  const maxConf = top?.confidence ?? 1;
  const info = MODEL_INFO[modelKey];
  const accent = modelKey === "hardened" ? "green" as const : "amber" as const;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <div className="text-[10px] font-semibold tracking-widest uppercase font-mono"
               style={{ color: info?.color ?? "#888" }}>
            ◆ {info?.tag ?? modelKey.toUpperCase()} — {info?.label ?? modelKey}
          </div>
          <div className="text-xs text-neutral-500 font-mono">{info?.desc ?? "EfficientNet-B0"}</div>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-white/[0.04] text-[11px] text-neutral-400 font-mono tabular-nums">
          {inferenceMs.toFixed(1)} ms
        </div>
      </div>
      {top && (
        <div className="text-center py-5 mb-4 border-b border-neutral-800/60">
          <div className="text-5xl mb-2">{VEGGIE_ICONS[top.class_name] ?? "🌿"}</div>
          <div className="text-xl font-semibold text-neutral-200 font-mono tracking-tight">
            {top.class_name.replace("_", " ")}
          </div>
          <div className="text-3xl font-bold font-mono tabular-nums mt-1"
               style={{ color: info?.color ?? "#22c55e" }}>
            {(top.confidence * 100).toFixed(1)}%
          </div>
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        {predictions.map((pred, i) => (
          <ConfidenceBar key={pred.class_name} prediction={pred} rank={i} maxConf={maxConf} accent={accent} />
        ))}
      </div>
    </div>
  );
}
