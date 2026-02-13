export interface Prediction {
  class_name: string;
  class_index: number;
  confidence: number;
}

export interface PredictResponse {
  model: string;
  predictions: Prediction[];
  inference_time_ms: number;
}

export interface CompareResponse {
  results: Record<string, {
    predictions: Prediction[];
    inference_time_ms: number;
  }>;
}

export interface HealthResponse {
  status: string;
  version: string;
  device: string;
  models: Record<string, boolean>;
}

export type ModelKey = "baseline" | "hardened";
export type AppMode = "baseline" | "hardened" | "compare";
export type AppStatus = "idle" | "predicting" | "done" | "error";
