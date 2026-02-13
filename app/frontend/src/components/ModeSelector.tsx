import type { AppMode } from "../types/api";

const MODES: { key: AppMode; label: string; icon: string; desc: string; color: string }[] = [
  { key: "robustness", label: "Analyse de robustesse", icon: "🛡️",
    desc: "FGSM + PGD sur les deux modèles, images perturbées visibles", color: "green" },
  { key: "compare", label: "Comparaison simple", icon: "⚖️",
    desc: "Même image, prédictions des deux modèles côte à côte", color: "blue" },
];

export function ModeSelector({ mode, onChange }: { mode: AppMode; onChange: (m: AppMode) => void }) {
  return (
    <div className="flex gap-2">
      {MODES.map((m) => {
        const active = mode === m.key;
        const cls = active
          ? m.color === "green"
            ? "border-green-500/40 bg-green-500/10 text-green-400"
            : "border-blue-500/40 bg-blue-500/10 text-blue-400"
          : "border-neutral-800 text-neutral-600 hover:border-neutral-700 hover:text-neutral-400";
        return (
          <button key={m.key} onClick={() => onChange(m.key)}
            className={`flex-1 py-3 px-4 rounded-lg cursor-pointer transition-all border font-mono text-left ${cls}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{m.icon}</span>
              <span className="text-[12px] font-semibold">{m.label}</span>
            </div>
            <div className="text-[10px] opacity-60 leading-snug">{m.desc}</div>
          </button>
        );
      })}
    </div>
  );
}
