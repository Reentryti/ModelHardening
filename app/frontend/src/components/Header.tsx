import type { HealthResponse } from "../types/api";

export function Header({ health }: { health: HealthResponse | null }) {
  const loaded = health ? Object.values(health.models).filter(Boolean).length : 0;
  const total = health ? Object.keys(health.models).length : 0;
  return (
    <header className="border-b border-neutral-900 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <span className="text-xl">🥦</span>
        <div>
          <div className="text-sm font-medium tracking-tight">vegclassify</div>
          <div className="text-[10px] text-neutral-600 tracking-widest">
            ANALYSE DE ROBUSTESSE ADVERSARIALE · CPU
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-neutral-700">
          {health ? `v${health.version} · ${health.device} · ${loaded}/${total} models` : "connecting..."}
        </span>
        <div className={`w-2 h-2 rounded-full ${loaded > 0
          ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-neutral-700"}`} />
      </div>
    </header>
  );
}
