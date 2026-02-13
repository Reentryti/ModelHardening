import { useCallback, useRef, useState } from "react";

export function DropZone({ onFile, preview }: { onFile: (f: File) => void; preview: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f?.type.startsWith("image/")) onFile(f);
  }, [onFile]);

  return (
    <div onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)} onDrop={handleDrop}
      className={`relative w-full min-h-[180px] max-h-[280px] border-2 border-dashed rounded-xl
        cursor-pointer flex items-center justify-center overflow-hidden transition-all
        ${dragging ? "border-green-500 bg-green-500/[0.03]" : "border-neutral-800 bg-[#0a0a0a] hover:border-neutral-700"}`}
      style={{ aspectRatio: preview ? "auto" : "16/9" }}>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      {preview ? (
        <img src={preview} alt="preview" className="w-full h-full object-contain p-3" />
      ) : (
        <div className="text-center p-8">
          <div className="text-4xl mb-3 opacity-40">📷</div>
          <div className="text-sm text-neutral-500">Glissez une image de légume ou cliquez</div>
          <div className="text-[11px] text-neutral-700 mt-2">JPEG · PNG · WebP</div>
        </div>
      )}
    </div>
  );
}
