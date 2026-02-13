import { ALL_CLASSES, VEGGIE_ICONS } from "../utils/constants";

export function ClassGrid() {
  return (
    <div className="mt-12">
      <div className="text-[10px] font-semibold tracking-widest uppercase text-neutral-700 mb-4">Classes supportées</div>
      <div className="flex flex-wrap gap-2">
        {ALL_CLASSES.map((cls) => (
          <span key={cls} className="px-3 py-1.5 rounded-md bg-neutral-900 border border-neutral-800/60 text-[11px] text-neutral-500 flex items-center gap-1.5">
            {VEGGIE_ICONS[cls]} {cls.replace("_", " ")}
          </span>
        ))}
      </div>
    </div>
  );
}
