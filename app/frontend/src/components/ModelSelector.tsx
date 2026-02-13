import type { AppMode } from "../types/api";

const MODES: { key: AppMode; label: string; phase: string; color: string }[] = [
  { key: "baseline", label: "Base",     phase: "A",     color: "amber" },
  { key: "hardened", label: "Durci",    phase: "C",     color: "green" },
  { key: "compare",  label: "Comparer", phase: "A vs C", color: "blue" },
];

export function ModelSelector({ mode, onChange }: { mode: AppMode; onChange: (m: AppMode) => void }) {
  return (
    <div className="flex gap-2">
      {MODES.map((m) => {
        const active = mode === m.key;
        const colors = active
          ? m.color === "amber" ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
          : m.color === "green" ? "border-green-500/40 bg-green-500/10 text-green-400"
          : "border-blue-500/40 bg-blue-500/10 text-blue-400"
          : "border-neutral-800 bg-transparent text-neutral-600 hover:border-neutral-700 hover:text-neutral-400";
        return (
          <button key={m.key} onClick={() => onChange(m.key)}
            className={`flex-1 py-2.5 px-3 rounded-lg text-center cursor-pointer transition-all border font-mono ${colors}`}>
            <div className="text-[10px] tracking-widest opacity-60 mb-0.5">PHASE {m.phase}</div>
            <div className="text-[13px] font-semibold">{m.label}</div>
          </button>
        );
      })}
    </div>
  );
}
