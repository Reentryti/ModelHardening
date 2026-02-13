import type { Prediction } from "../types/api";
import { VEGGIE_ICONS } from "../utils/constants";

const COLORS = {
  green: { text: "text-green-400", bar: "from-green-500 to-green-400", bg: "bg-green-500/5" },
  amber: { text: "text-amber-400", bar: "from-amber-500 to-amber-400", bg: "bg-amber-500/5" },
  blue:  { text: "text-blue-400",  bar: "from-blue-500 to-blue-400",   bg: "bg-blue-500/5" },
};

export function ConfidenceBar({ prediction, rank, maxConf, accent = "green" }:
  { prediction: Prediction; rank: number; maxConf: number; accent?: "green"|"amber"|"blue" }) {
  const pct = prediction.confidence * 100;
  const width = (prediction.confidence / maxConf) * 100;
  const isTop = rank === 0;
  const c = COLORS[accent];

  return (
    <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${isTop ? c.bg : "hover:bg-white/[0.02]"}`}>
      <span className="text-[22px] w-8 text-center shrink-0">{VEGGIE_ICONS[prediction.class_name] ?? "🌿"}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1.5">
          <span className={`text-[13px] font-mono tracking-wide ${isTop ? `${c.text} font-semibold` : "text-neutral-400"}`}>
            {prediction.class_name.replace("_", " ")}
          </span>
          <span className={`text-xs font-mono tabular-nums ${isTop ? c.text : "text-neutral-500"}`}>{pct.toFixed(1)}%</span>
        </div>
        <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${isTop ? c.bar : "from-neutral-700 to-neutral-600"}`}
            style={{ width: `${width}%` }} />
        </div>
      </div>
    </div>
  );
}
