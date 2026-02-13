import { useState, useCallback, useEffect } from "react";
import type { PredictResponse, CompareResponse, HealthResponse, AppMode, AppStatus } from "../types/api";
import { fetchHealth, predict, compare } from "../utils/api";

export function useClassifier() {
  const [status, setStatus] = useState<AppStatus>("idle");
  const [mode, setMode] = useState<AppMode>("baseline");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [compareResult, setCompareResult] = useState<CompareResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => { fetchHealth().then(setHealth).catch(() => setHealth(null)); }, []);

  const handleFile = useCallback((file: File) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null); setCompareResult(null); setError(null); setStatus("idle");
  }, []);

  const handlePredict = useCallback(async () => {
    if (!imageFile) return;
    setStatus("predicting"); setError(null); setResult(null); setCompareResult(null);
    try {
      if (mode === "compare") { setCompareResult(await compare(imageFile)); }
      else { setResult(await predict(imageFile, mode)); }
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed"); setStatus("error");
    }
  }, [imageFile, mode]);

  const handleReset = useCallback(() => {
    setImageFile(null); setPreview(null); setResult(null);
    setCompareResult(null); setError(null); setStatus("idle");
  }, []);

  return { status, mode, imageFile, preview, result, compareResult, error, health,
           handleFile, handlePredict, handleReset, setMode };
}
