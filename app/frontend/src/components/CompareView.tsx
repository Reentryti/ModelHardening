import type { CompareResponse } from "../types/api";
import { MODEL_INFO, VEGGIE_ICONS } from "../utils/constants";
import { ConfidenceBar } from "./ConfidenceBar";

export function CompareView({ data }: { data: CompareResponse }) {
  const keys = ["baseline", "hardened"].filter((k) => k in data.results);
  const topPreds = keys.map((k) => data.results[k].predictions[0]);
  const agree = topPreds.length === 2 && topPreds[0].class_name === topPreds[1].class_name;

  return (
    <div>
      <div className={`mb-4 px-4 py-2.5 rounded-lg text-center text-[12px] font-mono font-semibold ${
        agree ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-amber-500/10 border border-amber-500/20 text-amber-400"}`}>
        {agree ? `✓ Accord : ${topPreds[0].class_name.replace("_", " ")}`
               : `✗ Désaccord : ${topPreds.map((p) => p.class_name.replace("_", " ")).join(" vs ")}`}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {keys.map((key) => {
          const r = data.results[key];
          const top = r.predictions[0];
          const maxConf = top?.confidence ?? 1;
          const info = MODEL_INFO[key];
          const accent = key === "hardened" ? "green" as const : "amber" as const;
          return (
            <div key={key} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="text-[10px] font-semibold tracking-widest uppercase font-mono"
                     style={{ color: info?.color }}>◆ {info?.tag} — {info?.label}</div>
                <div className="text-[10px] text-neutral-500 font-mono tabular-nums">{r.inference_time_ms.toFixed(1)} ms</div>
              </div>
              {top && (
                <div className="text-center py-4 mb-3 border-b border-neutral-800/50">
                  <div className="text-4xl mb-1">{VEGGIE_ICONS[top.class_name] ?? "🌿"}</div>
                  <div className="text-[15px] font-semibold text-neutral-200 font-mono">{top.class_name.replace("_", " ")}</div>
                  <div className="text-2xl font-bold font-mono tabular-nums mt-1" style={{ color: info?.color }}>
                    {(top.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                {r.predictions.slice(0, 5).map((pred, i) => (
                  <ConfidenceBar key={pred.class_name} prediction={pred} rank={i} maxConf={maxConf} accent={accent} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {keys.length === 2 && (
        <div className="mt-3 flex justify-center gap-6 text-[11px] text-neutral-600 font-mono">
          {keys.map((k) => <span key={k}>{MODEL_INFO[k]?.label}: {data.results[k].inference_time_ms.toFixed(1)} ms</span>)}
        </div>
      )}
    </div>
  );
}
