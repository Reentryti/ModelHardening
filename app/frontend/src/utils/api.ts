import type { PredictResponse, CompareResponse, HealthResponse, ModelKey } from "../types/api";

const BASE = import.meta.env.VITE_API_URL ?? "";

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${BASE}/api/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

export async function predict(file: File, model: ModelKey): Promise<PredictResponse> {
  const form = new FormData();
  form.append("file", file);
  form.append("model", model);
  const res = await fetch(`${BASE}/api/predict`, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error ?? `Prediction failed: ${res.status}`);
  }
  return res.json();
}

export async function compare(file: File): Promise<CompareResponse> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/api/compare`, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error ?? `Compare failed: ${res.status}`);
  }
  return res.json();
}
