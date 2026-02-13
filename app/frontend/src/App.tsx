import { useClassifier } from "./hooks/useClassifier";
import { Header } from "./components/Header";
import { DropZone } from "./components/DropZone";
import { ModelSelector } from "./components/ModelSelector";
import { ResultCard } from "./components/ResultCard";
import { CompareView } from "./components/CompareView";
import { PredictButton } from "./components/PredictButton";
import { ClassGrid } from "./components/ClassGrid";

export default function App() {
  const {
    status, mode, imageFile, preview, result, compareResult, error, health,
    handleFile, handlePredict, handleReset, setMode,
  } = useClassifier();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-mono">
      <Header health={health} />
      <main className="max-w-[820px] mx-auto px-6 py-8">
        {/* 01 — Image */}
        <div className="mb-6">
          <div className="text-[10px] font-semibold tracking-widest uppercase text-neutral-600 mb-3">01 — Image</div>
          <DropZone onFile={handleFile} preview={preview} />
          {imageFile && (
            <div className="flex justify-between items-center mt-2 px-1">
              <span className="text-[11px] text-neutral-600">{imageFile.name} · {(imageFile.size / 1024).toFixed(0)} KB</span>
              <button onClick={handleReset}
                className="text-[11px] text-neutral-600 underline hover:text-neutral-400 bg-transparent border-none cursor-pointer font-mono">
                effacer
              </button>
            </div>
          )}
        </div>

        {/* 02 — Modèle */}
        <div className="mb-6">
          <div className="text-[10px] font-semibold tracking-widest uppercase text-neutral-600 mb-3">02 — Modèle</div>
          <ModelSelector mode={mode} onChange={setMode} />
          <div className="mt-3 p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-500 leading-relaxed">
            {mode === "baseline" && <><span className="text-amber-400">Phase A — Modèle de base.</span> Entraînement standard EfficientNet-B0, sans défense adversariale.</>}
            {mode === "hardened" && <><span className="text-green-400">Phase C — Modèle durci.</span> Ré-entraîné avec PGD adversarial training (ε=0.03, 7 steps, 50% du batch).</>}
            {mode === "compare" && <><span className="text-blue-400">Comparaison Phase A vs C.</span> La même image passe dans les deux modèles pour comparer confiance et prédictions.</>}
          </div>
          <div className="mt-4">
            <PredictButton status={status} mode={mode} disabled={!imageFile} onClick={handlePredict} />
          </div>
        </div>

        {/* Error */}
        {error && <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/15 text-xs text-red-400 mb-6">✕ {error}</div>}

        {/* 03 — Résultats */}
        {(result || compareResult) && (
          <div className="mb-6">
            <div className="text-[10px] font-semibold tracking-widest uppercase text-neutral-600 mb-4">03 — Résultat</div>
            {compareResult ? <CompareView data={compareResult} />
              : result ? <ResultCard modelKey={result.model} predictions={result.predictions} inferenceMs={result.inference_time_ms} />
              : null}
          </div>
        )}

        {status === "idle" && !preview && <ClassGrid />}
      </main>
      <footer className="border-t border-neutral-900 px-6 py-4 mt-16 flex justify-between text-[10px] text-neutral-700">
        <span>EfficientNet-B0 · PyTorch CPU · FastAPI</span>
        <span>15 classes · 224×224 · ImageNet norm</span>
      </footer>
    </div>
  );
}
