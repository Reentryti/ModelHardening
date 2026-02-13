import type { RobustnessResponse, ModelResult } from "../types/api";
import { MODEL_META, VEGGIE_ICONS } from "../utils/constants";

/* Prediction boxes */
function PredCell({ result, trueLabel, modelKey }: {
  result: ModelResult; trueLabel: string; modelKey: string;
}) {
  const top = result.predictions[0];
  const correct = top.class_name === trueLabel;
  const meta = MODEL_META[modelKey];
  const conf = (top.confidence * 100).toFixed(1);

  return (
    <div className={`rounded-lg border px-3 py-2.5 min-w-[160px] transition-all ${
      correct
        ? "border-green-500/30 bg-green-500/[0.06]"
        : "border-red-500/30 bg-red-500/[0.06]"
    }`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] font-bold tracking-widest uppercase"
              style={{ color: meta?.color ?? "#888" }}>
          {meta?.tag}
        </span>
        <span className={`text-[18px] ${correct ? "" : "grayscale opacity-60"}`}>
          {correct ? "ok" : "wrong"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg">{VEGGIE_ICONS[top.class_name] ?? "🌿"}</span>
        <div>
          <div className={`text-[13px] font-semibold font-mono ${
            correct ? "text-green-300" : "text-red-300"
          }`}>
            {top.class_name.replace("_", " ")}
          </div>
          <div className={`text-[11px] font-mono tabular-nums ${
            correct ? "text-green-500/70" : "text-red-500/70"
          }`}>
            {conf}% · {result.inference_time_ms.toFixed(0)}ms
          </div>
        </div>
      </div>
      {/* Mini bars top-3 */}
      <div className="mt-2 flex flex-col gap-0.5">
        {result.predictions.slice(0, 3).map((p, i) => (
          <div key={p.class_name} className="flex items-center gap-1.5">
            <div className="h-[3px] rounded-full bg-white/[0.06] flex-1 overflow-hidden">
              <div className={`h-full rounded-full ${
                i === 0 ? (correct ? "bg-green-500" : "bg-red-500") : "bg-neutral-700"
              }`} style={{ width: `${p.confidence * 100}%` }} />
            </div>
            <span className="text-[9px] text-neutral-600 font-mono w-[35px] text-right tabular-nums">
              {(p.confidence * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Scenario */
function ScenarioRow({ label, sublabel, image_b64, predictions, trueLabel, highlight }: {
  label: string; sublabel?: string; image_b64: string;
  predictions: Record<string, ModelResult>; trueLabel: string; highlight?: boolean;
}) {
  const models = ["baseline", "hardened"].filter((k) => k in predictions);
  const baseCorrect = predictions.baseline?.predictions[0]?.class_name === trueLabel;
  const hardCorrect = predictions.hardened?.predictions[0]?.class_name === trueLabel;

  return (
    <div className={`flex gap-4 items-stretch rounded-xl p-4 transition-all ${
      highlight ? "bg-neutral-900/60" : "hover:bg-neutral-900/30"
    }`}>
      {/* Image */}
      <div className="shrink-0 w-[130px] flex flex-col items-center gap-2">
        <img
          src={`data:image/jpeg;base64,${image_b64}`}
          alt={label}
          className="w-[120px] h-[120px] rounded-lg object-cover border border-neutral-800"
        />
        <div className="text-center">
          <div className="text-[11px] font-bold font-mono text-neutral-300">{label}</div>
          {sublabel && <div className="text-[9px] text-neutral-600 font-mono">{sublabel}</div>}
        </div>
      </div>

      {/* Predictions on both models */}
      <div className="flex-1 flex gap-3">
        {models.map((k) => (
          <div key={k} className="flex-1">
            <PredCell result={predictions[k]} trueLabel={trueLabel} modelKey={k} />
          </div>
        ))}
      </div>

      {/* Difference metrics */}
      {models.length === 2 && (
        <div className="flex flex-col items-center justify-center w-[60px] shrink-0">
          {baseCorrect && hardCorrect ? (
            <div className="text-center">
              <div className="text-lg">🟢</div>
              <div className="text-[8px] text-green-600 font-mono">BOTH OK</div>
            </div>
          ) : !baseCorrect && hardCorrect ? (
            <div className="text-center">
              <div className="text-lg">🛡️</div>
              <div className="text-[8px] text-green-500 font-mono font-bold">DURCI</div>
              <div className="text-[8px] text-green-500 font-mono font-bold">RÉSISTE</div>
            </div>
          ) : baseCorrect && !hardCorrect ? (
            <div className="text-center">
              <div className="text-lg">⚠️</div>
              <div className="text-[8px] text-amber-500 font-mono">DURCI</div>
              <div className="text-[8px] text-amber-500 font-mono">CASSÉ</div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-lg">🔴</div>
              <div className="text-[8px] text-red-500 font-mono">LES DEUX</div>
              <div className="text-[8px] text-red-500 font-mono">CASSÉS</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* Recap */
function SummaryBar({ data }: { data: RobustnessResponse }) {
  const models = ["baseline", "hardened"].filter((k) => data.models_used.includes(k));
  const total = data.scenarios.length;

  const scores = models.map((k) => {
    const survived = data.scenarios.filter(
      (s) => s.predictions[k]?.predictions[0]?.class_name === data.true_label
    ).length;
    return { key: k, survived, pct: total > 0 ? (survived / total) * 100 : 0 };
  });

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
      <div className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-4">
        Résumé — Prédictions correctes maintenues sous attaque
      </div>
      <div className="flex gap-4">
        {scores.map((s) => {
          const meta = MODEL_META[s.key];
          return (
            <div key={s.key} className="flex-1">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[11px] font-bold font-mono" style={{ color: meta?.color }}>
                  {meta?.tag} — {meta?.label}
                </span>
                <span className="text-lg font-bold font-mono tabular-nums" style={{ color: meta?.color }}>
                  {s.survived}/{total}
                </span>
              </div>
              <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${s.pct}%`, backgroundColor: meta?.color }}
                />
              </div>
              <div className="text-[10px] text-neutral-600 font-mono mt-1 text-right tabular-nums">
                {s.pct.toFixed(0)}% survie
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Main Component */
export function RobustnessView({ data }: { data: RobustnessResponse }) {
  // Séparer FGSM et PGD
  const fgsm = data.scenarios.filter((s) => s.attack === "FGSM");
  const pgd = data.scenarios.filter((s) => s.attack === "PGD");

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div>
          <span className="text-[11px] font-mono text-neutral-400">Classe détectée : </span>
          <span className="text-[13px] font-bold font-mono text-neutral-200">
            {VEGGIE_ICONS[data.true_label] ?? "🌿"} {data.true_label.replace("_", " ")}
          </span>
        </div>
        <div className="text-[10px] text-neutral-600 font-mono">
          {data.scenarios.length} attaques · {data.models_used.length} modèles
        </div>
      </div>

      {/* Resume */}
      <SummaryBar data={data} />

      {/* Column labels */}
      <div className="flex gap-4 px-4 items-end">
        <div className="w-[130px] shrink-0 text-[9px] font-bold tracking-widest uppercase text-neutral-700">
          Image
        </div>
        <div className="flex-1 flex gap-3">
          {["baseline", "hardened"].filter((k) => data.models_used.includes(k)).map((k) => (
            <div key={k} className="flex-1 text-[9px] font-bold tracking-widest uppercase"
                 style={{ color: MODEL_META[k]?.color }}>
              {MODEL_META[k]?.tag} — {MODEL_META[k]?.label}
            </div>
          ))}
        </div>
        <div className="w-[60px] shrink-0 text-[9px] font-bold tracking-widest uppercase text-neutral-700 text-center">
          Verdict
        </div>
      </div>

      {/* Clean */}
      <div>
        <div className="text-[10px] font-bold tracking-widest uppercase text-blue-400 mb-2 px-2">
          ● Image originale (clean)
        </div>
        <ScenarioRow
          label="Original"
          image_b64={data.clean.image_b64}
          predictions={data.clean.predictions}
          trueLabel={data.true_label}
          highlight
        />
      </div>

      {/* FGSM */}
      {fgsm.length > 0 && (
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-red-400 mb-2 px-2">
            ● FGSM — Fast Gradient Sign Method
          </div>
          <div className="flex flex-col gap-1">
            {fgsm.map((s) => (
              <ScenarioRow
                key={`fgsm-${s.epsilon}`}
                label={`FGSM`}
                sublabel={`ε = ${s.epsilon}`}
                image_b64={s.image_b64}
                predictions={s.predictions}
                trueLabel={data.true_label}
              />
            ))}
          </div>
        </div>
      )}

      {/* PGD */}
      {pgd.length > 0 && (
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-orange-400 mb-2 px-2">
            ● PGD — Projected Gradient Descent (10 steps)
          </div>
          <div className="flex flex-col gap-1">
            {pgd.map((s) => (
              <ScenarioRow
                key={`pgd-${s.epsilon}`}
                label={`PGD`}
                sublabel={`ε = ${s.epsilon}`}
                image_b64={s.image_b64}
                predictions={s.predictions}
                trueLabel={data.true_label}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
