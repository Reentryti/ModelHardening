import type { HealthResponse, CompareResponse, RobustnessResponse } from "../types/api";

const BASE = import.meta.env.VITE_API_URL ?? "";

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${BASE}/api/health`);
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}

export async function compare(file: File): Promise<CompareResponse> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/api/compare`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Compare failed");
  return res.json();
}

export async function analyzeRobustness(
  file: File,
  fgsmEps: number[] = [0.03, 0.05, 0.1],
  pgdEps: number[] = [0.03, 0.05, 0.1],
): Promise<RobustnessResponse> {
  const form = new FormData();
  form.append("file", file);
  form.append("fgsm_eps", fgsmEps.join(","));
  form.append("pgd_eps", pgdEps.join(","));
  const res = await fetch(`${BASE}/api/robustness`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Robustness analysis failed");
  return res.json();
}
