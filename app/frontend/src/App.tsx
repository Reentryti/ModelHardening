import { useClassifier } from "./hooks/useClassifier";
import { Header } from "./components/Header";
import { DropZone } from "./components/DropZone";
import { ModeSelector } from "./components/ModeSelector";
import { RobustnessView } from "./components/RobustnessView";
import { CompareView } from "./components/CompareView";

export default function App() {
  const {
    status, mode, imageFile, preview, compareResult, robustnessResult, error, health,
    handleFile, handleAnalyze, handleReset, setMode,
  } = useClassifier();

  const busy = status === "predicting";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-mono">
      <Header health={health} />

      <main className="max-w-[900px] mx-auto px-6 py-8">
        {/* 01 — Image */}
        <div className="mb-6">
          <div className="text-[10px] font-semibold tracking-widest uppercase text-neutral-600 mb-3">
            01 — Image
          </div>
          <DropZone onFile={handleFile} preview={preview} />
          {imageFile && (
            <div className="flex justify-between items-center mt-2 px-1">
              <span className="text-[11px] text-neutral-600">
                {imageFile.name} · {(imageFile.size / 1024).toFixed(0)} KB
              </span>
              <button onClick={handleReset}
                className="text-[11px] text-neutral-600 underline hover:text-neutral-400
                  bg-transparent border-none cursor-pointer font-mono">
                effacer
              </button>
            </div>
          )}
        </div>

        {/* 02 — Mode */}
        <div className="mb-6">
          <div className="text-[10px] font-semibold tracking-widest uppercase text-neutral-600 mb-3">
            02 — Mode d'analyse
          </div>
          <ModeSelector mode={mode} onChange={setMode} />

          <button onClick={handleAnalyze} disabled={!imageFile || busy}
            className={`w-full mt-4 py-3.5 rounded-lg font-semibold text-[13px] tracking-wider
              uppercase transition-all font-mono ${
              !imageFile
                ? "bg-neutral-900 text-neutral-600 cursor-not-allowed"
                : busy
                ? "bg-green-900/30 text-green-400 cursor-wait"
                : mode === "robustness"
                ? "bg-green-500 text-neutral-900 hover:bg-green-400 cursor-pointer"
                : "bg-blue-500 text-neutral-900 hover:bg-blue-400 cursor-pointer"
            }`}>
            {busy ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-3.5 h-3.5 border-2 border-transparent
                  border-t-current rounded-full animate-spin" />
                {mode === "robustness" ? "Génération des attaques..." : "Analyse..."}
              </span>
            ) : mode === "robustness"
              ? "  Lancer l'analyse de robustesse"
              : "  Comparer les deux modèles"
            }
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/15 text-xs text-red-400 mb-6">
            ✕ {error}
          </div>
        )}

        {/* 03 — Résultats */}
        {(robustnessResult || compareResult) && (
          <div className="mb-8">
            <div className="text-[10px] font-semibold tracking-widest uppercase text-neutral-600 mb-4">
              03 — Résultats
            </div>
            {robustnessResult && <RobustnessView data={robustnessResult} />}
            {compareResult && <CompareView data={compareResult} />}
          </div>
        )}

        {/* Légende en bas si idle */}
        {status === "idle" && !preview && (
          <div className="mt-12 p-6 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-4">
              Comment ça marche
            </div>
            <div className="grid grid-cols-3 gap-6 text-[11px] text-neutral-500 leading-relaxed">
              <div>
                <div className="text-amber-400 font-bold mb-1">Phase A — Base</div>
                EfficientNet-B0 standard. Performant sur données propres, mais vulnérable aux
                perturbations adversariales.
              </div>
              <div>
                <div className="text-green-400 font-bold mb-1">Phase C — Durci</div>
                Même architecture, ré-entraînée avec PGD adversarial training. Résiste aux
                attaques FGSM et PGD.
              </div>
              <div>
                <div className="text-red-400 font-bold mb-1">Attaques</div>
                Le serveur génère FGSM et PGD à plusieurs ε, et montre l'image perturbée + les
                prédictions des deux modèles côte à côte.
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-900 px-6 py-4 mt-8 flex justify-between text-[10px] text-neutral-700">
        <span>EfficientNet-B0 · PyTorch CPU · FastAPI</span>
        <span>15 classes · FGSM + PGD en live</span>
      </footer>
    </div>
  );
}
