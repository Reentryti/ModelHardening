import type { CompareResponse } from "../types/api";
import { MODEL_META, VEGGIE_ICONS } from "../utils/constants";

export function CompareView({ data }: { data: CompareResponse }) {
  const keys = ["baseline", "hardened"].filter((k) => k in data.results);
  const tops = keys.map((k) => data.results[k].predictions[0]);
  const agree = tops.length === 2 && tops[0].class_name === tops[1].class_name;

  return (
    <div>
      <div className={`mb-4 px-4 py-2.5 rounded-lg text-center text-[12px] font-mono font-semibold ${
        agree ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-amber-500/10 border border-amber-500/20 text-amber-400"}`}>
        {agree ? `✓ Accord : ${tops[0].class_name.replace("_", " ")}`
               : `✗ Désaccord : ${tops.map((p) => p.class_name.replace("_", " ")).join(" vs ")}`}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {keys.map((k) => {
          const r = data.results[k];
          const top = r.predictions[0];
          const meta = MODEL_META[k];
          return (
            <div key={k} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
              <div className="text-[10px] font-bold tracking-widest uppercase mb-3"
                   style={{ color: meta?.color }}>◆ {meta?.tag} — {meta?.label}</div>
              <div className="text-center py-3 mb-3">
                <div className="text-4xl mb-1">{VEGGIE_ICONS[top.class_name] ?? "🌿"}</div>
                <div className="text-[15px] font-semibold text-neutral-200 font-mono">
                  {top.class_name.replace("_", " ")}
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums mt-1" style={{ color: meta?.color }}>
                  {(top.confidence * 100).toFixed(1)}%
                </div>
                <div className="text-[10px] text-neutral-600 font-mono mt-1">{r.inference_time_ms.toFixed(1)} ms</div>
              </div>
              {r.predictions.slice(0, 5).map((p, i) => (
                <div key={p.class_name} className="flex items-center gap-2 py-1">
                  <span className="text-sm w-6 text-center">{VEGGIE_ICONS[p.class_name] ?? "🌿"}</span>
                  <span className={`text-[12px] font-mono flex-1 ${i === 0 ? "text-neutral-200" : "text-neutral-500"}`}>
                    {p.class_name.replace("_", " ")}
                  </span>
                  <div className="w-20 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: `${p.confidence * 100}%`,
                      backgroundColor: i === 0 ? meta?.color : "#444"
                    }} />
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono tabular-nums w-[40px] text-right">
                    {(p.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
