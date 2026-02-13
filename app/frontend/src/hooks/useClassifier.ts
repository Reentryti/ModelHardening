import { useState, useCallback, useEffect } from "react";
import type { CompareResponse, RobustnessResponse, HealthResponse, AppMode, AppStatus } from "../types/api";
import { fetchHealth, compare, analyzeRobustness } from "../utils/api";

export function useClassifier() {
  const [status, setStatus] = useState<AppStatus>("idle");
  const [mode, setMode] = useState<AppMode>("robustness");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compareResult, setCompareResult] = useState<CompareResponse | null>(null);
  const [robustnessResult, setRobustnessResult] = useState<RobustnessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => { fetchHealth().then(setHealth).catch(() => setHealth(null)); }, []);

  const handleFile = useCallback((file: File) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setCompareResult(null); setRobustnessResult(null); setError(null); setStatus("idle");
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) return;
    setStatus("predicting"); setError(null);
    setCompareResult(null); setRobustnessResult(null);
    try {
      if (mode === "compare") {
        setCompareResult(await compare(imageFile));
      } else {
        setRobustnessResult(await analyzeRobustness(imageFile));
      }
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
      setStatus("error");
    }
  }, [imageFile, mode]);

  const handleReset = useCallback(() => {
    setImageFile(null); setPreview(null);
    setCompareResult(null); setRobustnessResult(null);
    setError(null); setStatus("idle");
  }, []);

  return {
    status, mode, imageFile, preview, compareResult, robustnessResult, error, health,
    handleFile, handleAnalyze, handleReset, setMode,
  };
}
